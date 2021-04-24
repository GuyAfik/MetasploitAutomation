import pytest
import logging

from metasploit.api.docker.docker_operations import ContainerOperations


logger = logging.getLogger(__name__)


@pytest.fixture(scope="class")
def create_metasploitable_server(docker_server_ids):
    """
    Creates a metasploitable server over a container in a docker server.

    Returns:
        tuple[str, str]: docker server ID & the created metasploitable container IP.
    """
    docker_server_id = docker_server_ids[0]
    containers_operations = ContainerOperations(docker_server_id=docker_server_id)

    logger.info(f"Create metasploitable container")
    metasploitable_container = containers_operations.run_container(
        image='tleemcjr/metasploitable2', kwargs={"stdin_open": True, "tty": True, "detach": True}
    )
    metasploitable_container.reload()
    # logger.info(f"container stats: {metasploitable_container.attrs}")

    logger.info(f"Metasploitable IP is: {metasploitable_container.attrs['NetworkSettings']['IPAddress']}")
    return docker_server_id, metasploitable_container.attrs['NetworkSettings']['IPAddress']


@pytest.fixture(scope="function")
def fill_exploit_body_request(request, create_metasploitable_server):
    """
    fills up the exploit body request to execute an exploit.

    Expects a test function to have the following parameter:
        - exploit_body_request (dict): exploit body request that needs to be filled up.

    Returns:
        dict: exploit execution body request.
    """
    exploit_body_request = request.getfixturevalue(argname="exploit_body_request")
    _target = "{target}"
    _, metasploitable_server_ip = create_metasploitable_server

    for payload, options in exploit_body_request['payloads'].items():
        for option, option_value in options.items():
            if option_value == _target:
                exploit_body_request['payloads'][payload][option] = option_value.format(
                    target=metasploitable_server_ip
                )

    for option, option_value in exploit_body_request['options'].items():
        if option_value == _target:
            exploit_body_request['options'][option] = option_value.format(target=metasploitable_server_ip)

    logger.info(f"execute exploit body response is: {exploit_body_request}")
    return exploit_body_request
