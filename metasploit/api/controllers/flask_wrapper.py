from flask_restful import Api, request
from flask import Flask
import flask

from metasploit.api.response import (
    ErrorResponse
)
from .api_endpoints import (
    InstancesController,
    ContainersController,
    MetasploitController,
    UserController
)
from metasploit.api.utils.rest_api_utils import HttpCodes, HttpMethods
from metasploit.api.logic.docker_server_service import DockerServerServiceImplementation
from metasploit.api.logic.container_service import ContainerServiceImplementation
from metasploit.api.logic.metasploit_service import MetasploitServiceImplementation
from metasploit.api.logic.user_service import UserServiceImplementation

# front-end serving configuration. guy, if u touch i'll kill you!
application = Flask(__name__, template_folder='../../../templates', static_folder='../../../static')

@application.route("/")
def index():
    return flask.render_template("index.html")

class FlaskAppWrapper(object):
    """
    This is a class to wrap flask program and to create its endpoints to functions.

    Attributes:
        self._api (FlaskApi) - the api of flask.
    """
    def __init__(self, app):
        self._api = Api(app=app)
        self._app = app
        self.add_all_endpoints()

    @property
    def app(self):
        return self._app

    @application.errorhandler(HttpCodes.NOT_FOUND)
    def invalid_urls_error(self):
        """
        Catches a client request that is not a valid API URL.

        Returns:
            tuple (Json, int): an error response that shows all available URL's for the client to use.
        """

        err_msg = {
            "AvailableUrls": [
                '/SecurityGroups/Get',
                '/SecurityGroups/Get/<id>',
                '/SecurityGroups/Create',
                '/SecurityGroups/Delete/<id>',
                '/SecurityGroups/<id>/UpdateInboundPermissions',
                '/DockerServerInstances/Create',
                '/DockerServerInstances/Get',
                '/DockerServerInstances/Get/<id>',
                '/DockerServerInstances/Delete/<id>',
                '/DockerServerInstances/<id>/Containers/Get',
                '/DockerServerInstances/<instance_id>/Containers/Get/<container_id>',
                '/DockerServerInstances/<instance_id>/Containers/Delete/<container_id>',
                '/DockerServerInstances/<id>/Images/Pull',
                '/DockerServerInstances/<instance_id>/Containers/CreateMetasploitContainer',
                '/DockerServerInstances/<instance_id>/Metasploit/<target>/RunExploit',
                '/DockerServerInstances/<instance_id>/Metasploit/<target>/ScanOpenPorts',
                '/DockerServerInstances/<instance_id>/Metasploit/<exploit_name>/ExploitInfo'
            ]
        }
        return ErrorResponse(
            error_msg=err_msg, http_error_code=HttpCodes.BAD_REQUEST, req=request.json, path=request.base_url
        )()


    @application.errorhandler(HttpCodes.METHOD_NOT_ALLOWED)
    def method_not_allowed(self):
        """
        Catches a client request which indicates abut a bad method over a valid API URL.

        Returns:
            tuple (Json, int): an error response and 405 status code indicating for 'METHOD_NOT_ALLOWED'.
        """
        return ErrorResponse(
            error_msg=f"Method {request.method} is not allowed in URL {request.base_url}",
            http_error_code=HttpCodes.METHOD_NOT_ALLOWED,
            req=request.json,
            path=request.base_url
        )()

    @application.errorhandler(HttpCodes.BAD_REQUEST)
    def bad_request(self):
        """
        Catches a client request which indicates about an invalid data input to the server.

        Returns:
            tuple (Json, int): an error response and 400 status code indicating for 'Bad Request'.
        """
        return ErrorResponse(
            error_msg="Invalid data type input",
            http_error_code=HttpCodes.BAD_REQUEST,
            req=request.json,
            path=request.base_url
        )()

    def get_api(self):
        """
        Get flask API.
        """
        return self._api

    def run(self, debug, port=5000):
        """
        Run flask app.
        """
        self._app.run(debug=debug, port=port)

    def add_all_endpoints(self):
        """
        Add all the api endpoints
        """

        self._add_container_endpoints()
        self._add_docker_instance_endpoints()
        self._add_metasploit_endpoints()
        self._add_user_endpoints()

    def _add_docker_instance_endpoints(self):
        """
        Add all the endpoints that is related to docker server operations.
        """
        docker_server_controller_kwargs = {'docker_server_implementation': DockerServerServiceImplementation}


        self._api.add_resource(
            InstancesController,
            '/DockerServerInstances/Create',
            endpoint='/DockerServerInstances/Create',
            methods=[HttpMethods.POST],
            resource_class_kwargs=docker_server_controller_kwargs,
        )

        self._api.add_resource(
            InstancesController,
            '/DockerServerInstances/Get',
            endpoint='/DockerServerInstances/Get',
            methods=[HttpMethods.GET],
            resource_class_kwargs=docker_server_controller_kwargs,
        )

        self._api.add_resource(
            InstancesController,
            '/DockerServerInstances/Get/<instance_id>',
            endpoint='/DockerServerInstances/Get/<instance_id>',
            methods=[HttpMethods.GET],
            resource_class_kwargs=docker_server_controller_kwargs,
        )

        self._api.add_resource(
            InstancesController,
            '/DockerServerInstances/Delete/<instance_id>',
            endpoint='/DockerServerInstances/Delete/<instance_id>',
            methods=[HttpMethods.DELETE],
            resource_class_kwargs=docker_server_controller_kwargs,
        )

    def _add_container_endpoints(self):
        """
        Add all the endpoints that is related to container operations.
        """
        container_controller_kwargs = {'container_service_implementation': ContainerServiceImplementation}

        self._api.add_resource(
            ContainersController,
            '/DockerServerInstances/<instance_id>/Containers/Get',
            endpoint='/DockerServerInstances/<instance_id>/Containers/Get',
            methods=[HttpMethods.GET],
            resource_class_kwargs=container_controller_kwargs,
        )

        self._api.add_resource(
            ContainersController,
            '/DockerServerInstances/<instance_id>/Containers/Get/<container_id>',
            endpoint='/DockerServerInstances/<instance_id>/Containers/Get/<container_id>',
            methods=[HttpMethods.GET],
            resource_class_kwargs=container_controller_kwargs,
        )

        self._api.add_resource(
            ContainersController,
            '/DockerServerInstances/<instance_id>/Containers/Delete/<container_id>',
            endpoint='/DockerServerInstances/<instance_id>/Containers/Delete/<container_id>',
            methods=[HttpMethods.DELETE],
            resource_class_kwargs=container_controller_kwargs,
        )

        self._api.add_resource(
            ContainersController,
            '/DockerServerInstances/<instance_id>/Containers/CreateMetasploitContainer',
            endpoint='/DockerServerInstances/<instance_id>/Containers/CreateMetasploitContainer',
            methods=[HttpMethods.POST],
            resource_class_kwargs=container_controller_kwargs,
        )

    def _add_metasploit_endpoints(self):
        """
        Add all the endpoints that is related to metasploit operations.
        """
        metasploit_controller_kwargs = {
            'metasploit_service_implementation': MetasploitServiceImplementation
        }

        self._api.add_resource(
            MetasploitController,
            '/DockerServerInstances/<instance_id>/Metasploit/<target>/RunExploit',
            endpoint='/DockerServerInstances/<instance_id>/Metasploit/<target>/RunExploit',
            methods=[HttpMethods.POST],
            resource_class_kwargs=metasploit_controller_kwargs,
        )

        self._api.add_resource(
            MetasploitController,
            '/DockerServerInstances/<instance_id>/Metasploit/<target>/ScanOpenPorts',
            endpoint='/DockerServerInstances/<instance_id>/Metasploit/<target>/ScanOpenPorts',
            methods=[HttpMethods.GET],
            resource_class_kwargs=metasploit_controller_kwargs,
        )

        self._api.add_resource(
            MetasploitController,
            '/DockerServerInstances/<instance_id>/Metasploit/<exploit_name>/ExploitInfo',
            endpoint='/DockerServerInstances/<instance_id>/Metasploit/<exploit_name>/ExploitInfo',
            methods=[HttpMethods.GET],
            resource_class_kwargs=metasploit_controller_kwargs,
        )

        self._api.add_resource(
            MetasploitController,
            '/DockerServerInstances/<instance_id>/Metasploit/<payload_name>/PayloadInfo',
            endpoint='/DockerServerInstances/<instance_id>/Metasploit/<payload_name>/PayloadInfo',
            methods=[HttpMethods.GET],
            resource_class_kwargs=metasploit_controller_kwargs,
        )

        self._api.add_resource(
            MetasploitController,
            '/DockerServerInstances/<instance_id>/Metasploit/<auxiliary_name>/AuxiliaryInfo',
            endpoint='/DockerServerInstances/<instance_id>/Metasploit/<auxiliary_name>/AuxiliaryInfo',
            methods=[HttpMethods.GET],
            resource_class_kwargs=metasploit_controller_kwargs,
        )

        self._api.add_resource(
            MetasploitController,
            '/DockerServerInstances/<instance_id>/Metasploit/<target>/RunAuxiliary',
            endpoint='/DockerServerInstances/<instance_id>/Metasploit/<target>/RunAuxiliary',
            methods=[HttpMethods.POST],
            resource_class_kwargs=metasploit_controller_kwargs,
        )

    def _add_user_endpoints(self):
        """
        Add all endpoints that are related to user operations.
        """
        user_controller_kwargs = {
            'user_service_implementation': UserServiceImplementation
        }

        self._api.add_resource(
            UserController,
            '/Users/Create',
            endpoint='/Users/Create',
            methods=[HttpMethods.POST],
            resource_class_kwargs=user_controller_kwargs,
        )

        self._api.add_resource(
            UserController,
            '/Users/Update/<email>',
            endpoint='/Users/Update/<email>',
            methods=[HttpMethods.PUT],
            resource_class_kwargs=user_controller_kwargs,
        )

        self._api.add_resource(
            UserController,
            '/Users/Get/<email>/<password>',
            endpoint='/Users/Get/<username>/<password>',
            methods=[HttpMethods.GET],
            resource_class_kwargs=user_controller_kwargs,
        )

        self._api.add_resource(
            UserController,
            '/Users/Get',
            endpoint='/Users/Get',
            methods=[HttpMethods.GET],
            resource_class_kwargs=user_controller_kwargs,
        )

        self._api.add_resource(
            UserController,
            '/Users/Delete/<email>',
            endpoint='/Users/Delete/<email>',
            methods=[HttpMethods.DELETE],
            resource_class_kwargs=user_controller_kwargs,
        )


flask_wrapper = FlaskAppWrapper(app=application)
