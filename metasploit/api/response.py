from flask import jsonify, make_response


class HttpCodes(object):
    OK = 200
    CREATED = 201
    ACCEPTED = 202
    NO_CONTENT = 204
    MULTI_STATUS = 207
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    METHOD_NOT_ALLOWED = 405
    DUPLICATE = 409
    INTERNAL_SERVER_ERROR = 500
    SERVICE_UNAVAILABLE = 503


class ApiResponse(object):
    """
    This is a class to represent an API response.

    Attributes:
        response (dict/list/serializable object): a response from the database.
        http_status_code (int): the http status code of the response.
    """
    def __init__(self, response=None, http_status_code=HttpCodes.OK):

        self._response = response
        self._http_status_code = http_status_code

    def __call__(self):
        """
        Returns an API response for the client.

        Returns:
            Response: a flask response.
        """
        return make_response(jsonify(self.response), self.http_status_code)

    @property
    def response(self):
        return self._response

    @response.setter
    def response(self, res):
        self._response = res

    @property
    def http_status_code(self):
        return self._http_status_code


class ErrorResponse(ApiResponse):

    def __init__(self, error_msg, http_error_code, req=None, path=None):
        """
        Prepare an error response for a resource.

        Args:
            error_msg (str): error message to send.
            http_error_code (int): the http error code.
            req (dict): the request by the client.
            path (str): The path in the api the error occurred.

        Returns:
            dict: parsed error response for the client.
        """
        response = {
            "Error":
                {
                    "Message": error_msg,
                    "Code": http_error_code,
                    "Request": req,
                    "Url": path
                }
        }
        super(ErrorResponse, self).__init__(response=response, http_status_code=http_error_code)


def new_docker_instance_response(instance):
    """
    Creates new docker response for the client & DB.

    Args:
        instance (DockerServerInstance): docker server object.

    Returns:
         dict: instance response.
    """
    return {
        "_id": instance.instance_id,
        "IpParameters": {
            "PublicIpAddress": instance.public_ip_address,
            "PublicDNSName": instance.public_dns_name,
            "PrivateIpAddress": instance.private_ip_address,
            "PrivateDNSName": instance.private_dns_name
        },
        "SecurityGroups": instance.security_groups,
        "State": instance.state,
        "Containers": [],
        "Images": [],
        "Metasploit": []
    }


def new_container_response(container):
    """
    Creates a new container response for the client and DB.

    Args:
        container (Container): container object.

    Returns:
        dict: container response.
    """
    container.reload()
    return {
        "_id": container.id,
        "image": container.image.tags,
        "name": container.name,
        "status": container.status,
        "ports": container.ports
    }


def client_user_response(user):
    """
    Creates a new user response for the client.

    Args:
        user (User): user object.

    Returns:
        dict: user response.
    """
    return {
        "_id": user.id,
        "name": user.name,
        "data": user.data
    }


def fill_user_document(user):
    """
    Creates a new user response for the DB.

    Args:
        user (User): user object.

    Returns:
        dict: user response.
    """
    return {
        "_id": user.id,
        "email": user.email,
        "name": user.name,
        "password": user.password,
        "data": user.data
    }
