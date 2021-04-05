import logging
import pytest

from metasploit.tests.test_wrapper import BaseApiInterface
from metasploit.tests.helpers import execute_rest_api_request
from ..helpers import to_utf8, convert

from . import config


logger = logging.getLogger("UserApi")


@pytest.fixture(scope="class")
def user_api(test_client):
    """
    This fixture provides the UserApi object in order to make API calls.

    Returns:
        UserApi: a user API object.
    """

    class UserApi(BaseApiInterface):

        def post(self, create_user_body_request, create_user_url=config.CREATE_USER_URL):
            """
            Sends a POST request in order to create a user.

            Args:
                create_user_body_request (dict): a body request to create a new user.
                create_user_url (str): the URL to create the user.

            Returns:
                tuple[dict, int]: a tuple containing the body response as a first arg, and status code as second arg.
            """
            logger.info(f"Send POST request, URL: {create_user_url}, REQUEST: {create_user_body_request}")

            return execute_rest_api_request(
                url=create_user_url, api_func=self._test_client.post, request_body=create_user_body_request
            )

        def get_one(self, email, password, get_user_url=config.GET_USER_URL):
            """
            Sends a GET request in order to get a user.

            Args:
                email (str): user email.
                password (str): user password.
                get_user_url (str): the URL to get the user.

            Returns:
                tuple[dict, int]: a tuple containing the body response as a first arg, and status code as second arg.
            """
            get_user_url = get_user_url.format(email=email, password=password)
            logger.info(f"Send GET request, URL: {get_user_url}")

            return execute_rest_api_request(url=get_user_url, api_func=self._test_client.get)

        def get_many(self, get_all_users_url=config.GET_ALL_USERS_URL):
            """
            Sends a GET request in order to get all the users.

            Args:
                get_all_users_url (str): the URL to get all the users.

            Returns:
                tuple[dict, int]: a tuple containing the body response as a first arg, and status code as second arg.
            """
            logger.info(f"Send GET request, URL: {get_all_users_url}")

            return execute_rest_api_request(url=get_all_users_url, api_func=self._test_client.get)

        def delete(self, email, delete_user_url=config.DELETE_USER_URL, expected_to_fail=False):
            """
            Sends a DELETE request in order to delete a user.

            Args:
                email (str): user email.
                delete_user_url (str): the URL to delete a user.
                expected_to_fail (bool): is the delete operation expect to give an error from the API.

            Returns:
                tuple[str, int]: a tuple containing the body response as a first arg, and status code as second arg.
            """
            delete_user_url = delete_user_url.format(email=email)
            logger.info(f"Send DELETE request, URL: {delete_user_url}")

            convert_func = convert if expected_to_fail else to_utf8

            return execute_rest_api_request(
                url=delete_user_url, api_func=self._test_client.delete, convert_func=convert_func
            )

        def put(self, email, request_body, update_user_url=config.UPDATE_USER_URL, expected_to_fail=False):
            """
            Sends a PUT request in order to update a user.

            Args:
                email (str): user email.
                request_body (dict): request body to update a user.
                update_user_url (str): the URL to update a user.
                expected_to_fail (bool): is the put operation expect to give an error from the API.

            Returns:
                tuple[str, int]: a tuple containing the body response as a first arg, and status code as second arg.
            """
            update_user_url = update_user_url.format(email=email)
            logger.info(f"Send PUT request, URL: {update_user_url}")

            convert_func = convert if expected_to_fail else to_utf8

            return execute_rest_api_request(
                url=update_user_url,
                api_func=self._test_client.put,
                request_body=request_body,
                convert_func=convert_func
            )

    return UserApi(test_client=test_client)
