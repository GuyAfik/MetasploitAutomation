from metasploit.api.logic.services import ContainerService
from metasploit.api.database import (
    DatabaseOperations,
    DatabaseCollections
)
from metasploit.api.docker.docker_operations import ContainerOperations

from metasploit.api.aws.amazon_operations import DockerServerInstanceOperations
from metasploit.api import constants as global_const
from metasploit.api.response import new_container_response


def update_containers_status(func):
    """
    Updates containers status in case there is any change with them ( running state ---> stopped state for example)
    """
    def wrapper(self, **kwargs):
        database = self.database

        instance_documents = database.get_all_documents()

        for document in instance_documents:
            docker_server_instance = DockerServerInstanceOperations(instance_id=document[global_const.ID]).docker_server
            containers = docker_server_instance.docker.container_collection.list(all=True)

            for container in containers:
                container.reload()
                for container_document in document["Containers"]:

                    if container.id == container_document[global_const.ID]:
                        if container.status != container_document["status"]:

                            database.update_docker_document(
                                docker_document_type="Container",
                                docker_document_id=container.id,
                                update={"Containers.$.status": container.status},
                                docker_server_id=document[global_const.ID]
                            )
        return func(self, **kwargs)
    return wrapper


class ContainerServiceImplementation(ContainerService):
    """
    Implements the container service.

    Attributes:
        database (DatabaseOperations): DatabaseOperations object.
    """
    type = "Container"

    def __init__(self):
        self.database = DatabaseOperations(collection_type=DatabaseCollections.INSTANCES)

    def create(self, *args, **kwargs):
        return self.create_metasploit_container(*args, **kwargs)

    def get_all(self, *args, **kwargs):
        return self.get_all_containers(*args, **kwargs)

    def get_one(self, *args, **kwargs):
        return self.get_container(*args, **kwargs)

    def delete_one(self, *args, **kwargs):
        return self.delete_container(*args, **kwargs)

    @update_containers_status
    def get_container(self, instance_id, container_id):
        """
        Gets a container from the DB.

        Args:
            instance_id (str): instance ID.
            container_id (str): container ID.

        Returns:
            dict: a container document in case found.
        """
        return self.database.get_docker_document(
            amazon_resource_id=instance_id, docker_resource_id=container_id, type=self.type
        )

    @update_containers_status
    def get_all_containers(self, instance_id):
        """
        Gets all containers from the DB.

        Args:
            instance_id (str): instance ID.

        Returns:
            list(dict): a list of container documents in case there are, empty list otherwise.
        """
        return self.database.get_docker_documents(amazon_resource_id=instance_id, type=self.type)

    def create_metasploit_container(self, instance_id):
        """
        Creates a new metasploit container over a docker server instance.

        Args:
            instance_id (str): instance ID.

        Returns:
            dict: a new container document.
        """
        all_containers_documents = self.database.get_docker_documents(amazon_resource_id=instance_id, type=self.type)

        new_container = ContainerOperations(
            docker_server_id=instance_id
        ).run_container_with_msfrpcd_metasploit(containers_documents=all_containers_documents)

        container_response = new_container_response(container=new_container)

        self.database.add_docker_document(
            amazon_resource_id=instance_id, docker_document_type=self.type, new_docker_document=container_response
        )

        return container_response

    def delete_container(self, instance_id, container_id):
        """
        Deletes a container from the DB.

        Args:
            instance_id (str): instance ID.
            container_id (str): container ID.

        Returns:
            str: empty string as a response in case of success.
        """
        self.database.delete_docker_document(
            amazon_resource_id=instance_id, docker_resource_id=container_id, docker_document_type=self.type
        )
        ContainerOperations(docker_server_id=instance_id, docker_resource_id=container_id).container.remove(force=True)
        return ''
