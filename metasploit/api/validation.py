"""
Module to represent any API call that the server receives.
"""
import functools
from flask_restful import request

from metasploit.api.response import (
    ApiResponse
)
from metasploit.api.errors import (
    BadJsonInput,
    InvalidInputTypeError,
    BadRequest
)


def validate_json_request(*expected_args):
    """
    Validates the json request for an api function that needs a request as input.

    Args:
        expected_args (list): list of arguments that should be checked if there are in the json request.
    """
    def decorator_validate_json(api_func):
        """
        decorator for an api function.

        Args:
            api_func (Function) an api function.
        """
        @functools.wraps(api_func)
        def wrapper_validate_json(*args, **kwargs):
            """
            Wrapper decorator to validate json input to the api.

            Args:
                args (list): function arguments.
                kwargs (dict): function arguments.

            Returns:
                ApiResponse: an api response obj.

            Raises:
                BadJsonInput: in case the parameters for the json request are not valid.
                ResourceNotFoundError: in case the requested resource was not found.
            """

            type_validation = validate_request_type(client_request=request.json)
            if not type_validation:
                raise InvalidInputTypeError()

            bad_inputs = validate_api_request_arguments(
                api_request=request.json, expected_args=expected_args
            )
            if bad_inputs:
                raise BadJsonInput(bad_inputs=bad_inputs)

            return api_func(*args, **kwargs)

        return wrapper_validate_json
    return decorator_validate_json


def validate_request_type(client_request):
    """
    Validate the client request type (dict).

    Returns:
        tuple(bool, str): a tuple that indicates if the request type is ok. (True, 'Success') for a valid request type,
        otherwise, (False, err)
    """
    try:
        if not isinstance(client_request, dict):
            return False
        return True
    except (BadRequest, TypeError, AttributeError):
        raise InvalidInputTypeError()


def validate_api_request_arguments(api_request, expected_args):
    """
    Validates that the api request from the client has valid arguments for the api function that was used.

    Args:
        api_request (dict): a dictionary that composes the api request from the client.
        expected_args (list(str)): a list containing all the arguments that should be checked.

    Returns:
        list: a list with arguments that aren't valid if exists, empty list otherwise
    """
    bad_inputs = []

    for expected_arg in expected_args:
        if expected_arg not in api_request:
            bad_inputs.append(expected_arg)
    return bad_inputs
