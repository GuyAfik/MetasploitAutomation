
import docker
from docker.errors import DockerException

from metasploit.api.connections import (
    Connection,
    SSH
)
from metasploit.api.errors import (
    DockerServerConnectionError,
    CommandFailureError
)
from requests.adapters import ConnectionError
from metasploit.api.aws import constants as aws_const
from metasploit.api.utils.helpers import recover_containers


class Docker(Connection):
    """
    This class attempts to connect to a specified docker server.

    Attributes:
        _docker_client (DockerClient): The docker client obj can be used to maintain docker operations.
        _api_client (APIClient): The low level API obj for docker.
    """

    def __init__(self, docker_server_ip, protocol='tcp', docker_port=2375, max_connection_attempts=5):
        """
        Initialize the connection to the docker server over an AWS ec2 instance using a chosen protocol,
        docker server ip and a port that the docker server listens to.

        Args:
            docker_server_ip (str): the docker server public ip.
            protocol (str): a protocol to use in order to connect to the docker server. etc: tcp/udp.
            docker_port (int): the port that the docker server listens to.
            max_connection_attempts (int): maximum times to try and connect the docker API.
        """
        base_url = f"{protocol}://{docker_server_ip}:{docker_port}"

        is_docker_daemon_recovered = False
        ssh = None
        connection_attempts = 0
        while connection_attempts < max_connection_attempts:
            try:

                self._docker_client = docker.DockerClient(base_url=base_url)
                self._api_client = docker.APIClient(base_url=base_url)

                if self._docker_client.ping():
                    if is_docker_daemon_recovered:
                        recover_containers(containers=self._docker_client.containers.list(all=True))
                    break
            except (ConnectionError, DockerException):
                if not ssh:
                    ssh = SSH(hostname=docker_server_ip)

                are_commands_successful, cmd = ssh.execute_commands(commands=aws_const.RELOAD_DOCKER_DAEMON)
                if not are_commands_successful:
                    raise CommandFailureError(cmd=cmd, instance_fqdn=docker_server_ip)

                connection_attempts += 1
                is_docker_daemon_recovered = True

        if connection_attempts >= max_connection_attempts:
            raise DockerServerConnectionError(docker_server=docker_server_ip, url=base_url)

    @property
    def api_client(self):
        return self._api_client

    @property
    def docker_client(self):
        return self._docker_client

    @property
    def info(self):
        """
        Display system-wide information about the docker, Identical to the docker info command.

        Returns:
            dict: information about the the docker such as containers running, images, etc.
        """
        return self._docker_client.info()

    @property
    def container_collection(self):
        """
        Get a container collection obj.

        Returns:
            ContainerCollection: a container collection obj.
        """
        return self._docker_client.containers

    @property
    def network_collection(self):
        """
        Get a network collection obj.

        Returns:
            NetworkCollection: a network collection obj.
        """
        return self._docker_client.networks

    @property
    def image_collection(self):
        """
        Get an image collection obj.

        Returns:
            ImageCollection: a image collection obj.
        """
        return self._docker_client.images

    @property
    def config_collection(self):
        """
        Get a config collection obj.

        Returns:
            ConfigCollection: a config collection obj.

        """
        return self._docker_client.configs
