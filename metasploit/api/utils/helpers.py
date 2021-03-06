import time
import functools
from metasploit.api import constants as global_constants

from metasploit.api.errors import (
    PortNotFoundError,
    TimeoutExpiredError,
    ApiException
)


def singleton(cls):
    """
    Make a class a Singleton class (only one instance)
    """
    @functools.wraps(cls)
    def wrapper_singleton(*args, **kwargs):
        if not wrapper_singleton.instance:
            wrapper_singleton.instance = cls(*args, **kwargs)
        return wrapper_singleton.instance

    wrapper_singleton.instance = None
    return wrapper_singleton


def choose_port_for_msfrpcd(containers_document):
    """
    Choose dynamically the port that msfrpcd would listen to.

    Args:
        containers_document (dict): all of the instance container docker_documents

    Returns:
        int: port to be used, 0 if there is not such a port.
    """
    used_ports = get_all_used_port_in_instance(containers_document=containers_document)
    for port in global_constants.PORTS:
        if port not in used_ports:
            return port
    raise PortNotFoundError('No port available to run msfrpc daemon in a container - internal server error')


def get_all_used_port_in_instance(containers_document):
    """
    Gets all the used ports in an instance.

    Args:
        containers_document (dict): containers documents.

    Returns:
        list: all the used ports for the containers in the instance.
    """
    if containers_document:
        all_containers_ports = [container_document["ports"] for container_document in containers_document]
        used_ports = []
        for container_port_details in all_containers_ports:
            for port in container_port_details.keys():
                used_ports.append(port)
        return used_ports
    else:
        return []


class TimeoutSampler(object):
    """
    An iterator class that takes a function and it's parameters and executes it for 'timeout' seconds and produces
    it's result every 'sleep' seconds.

    Attributes:
        timeout (int): maximum timeout limit for the function to be performed.
        sleep (int): samples the function each 'sleep' seconds.
        func (Function): a function to execute.
        func_args (list): function args.
        function_kwargs (dict): function kwargs.
        start_time (int): start time to sample.
        last_sample_time (int): time of the last sample.
    """
    def __init__(self, timeout, sleep, func, *func_args, **func_kwargs):

        self.timeout = timeout
        self.sleep = sleep

        self.func = func
        self.func_args = func_args
        self.func_kwargs = func_kwargs

        self.start_time = None
        self.last_sample_time = None

    def __iter__(self):
        """
        Iterator that generates the function output every 'sleep' seconds.

        Yields:
            any function output.

        Raises:
            TimeoutExpiredError: in case the function sampling reached to the timeout provided.
        """
        if self.start_time is None:
            self.start_time = time.time()

        while True:
            self.last_sample_time = time.time()
            yield self.func(*self.func_args, **self.func_kwargs)

            if self.timeout < (time.time() - self.start_time):
                raise TimeoutExpiredError(error_msg=f"Timeout occurred sampling {self.func.__name__}")
            time.sleep(self.sleep)

    def iterate(self, result):
        """
        Samples the function and in case the function gets the desired result (True or False).

        Args:
            result (bool): expected result from the function.

        Returns:
            bool: True in case function output is what's expected, false otherwise.
        """
        try:
            for res in self:
                if result == res:
                    return True
        except TimeoutExpiredError:
            return False


def recover_containers(containers):
    """
    Recovers all the containers of an instance including metasploit msfrpcd.

    Args:
         containers (list[Container]): a list of container objects.

    Raises:
        ApiException: in case one of the containers was not able to be recovered.
    """
    port = None

    for container in containers:  # start all the containers
        container.start()
        container.reload()

        for ports in container.ports.values():
            for port_configuration in ports:
                port = port_configuration["HostPort"]
                if port:
                    break
        exit_code, _ = container.exec_run(f"./msfrpcd -P 123456 -S -p {port}")
        if exit_code:
            raise ApiException(error_msg=f"Failed recovering container {container.id}", error_code=500)
