import pytest
import logging


from metasploit.api.response import HttpCodes
from metasploit.tests.conftest import test_client  # noqa: F401
from metasploit.tests.helpers import (
    is_expected_code,
    is_error_response_valid,
    load_json
)


from . import config
from .user_api import user_api  # noqa: F401
from .fixtures import create_users  # noqa: F401
from .helpers import is_user_response_body_valid


logger = logging.getLogger("UserTests")


class TestCreateUserPostApi(object):

    create_user_body_requests = [config.USER_REQUEST_VALID_1, config.USER_REQUEST_VALID_2]

    @pytest.mark.parametrize(
        "invalid_user_request",
        [
            pytest.param(
                config.USER_REQUEST_WITH_INVALID_EMAIL,
                id="Create_user_with_invalid_email"
            ),
            pytest.param(
                config.USER_REQUEST_WITH_NUMBERS_IN_FIRST_NAME,
                id="Create_user_with_numbers_in_first_name"
            ),
            pytest.param(
                config.USER_REQUEST_WITH_NUMBERS_IN_LAST_NAME,
                id="Create_user_with_numbers_in_last_name"
            ),
            pytest.param(
                config.USER_REQUEST_WITH_SHORT_PASSWORD,
                id="Create_user_with_short_password"
            ),
            pytest.param(
                config.USER_REQUEST_WITHOUT_FIRST_NAME_AND_LAST_NAME,
                id="Create_user_without_first_name_and_last_name_in_body_request"
            ),
            pytest.param(
                config.USER_REQUEST_WITHOUT_PASSWORD_AND_USER_NAME,
                id="Create_user_without_username_and_password_in_body_request"
            )
        ]
    )
    def test_create_invalid_user_fails(self, invalid_user_request, user_api):
        """
        Tests scenarios where creating a user should fail.
        """
        user_response_body, actual_status_code = user_api.post(create_user_body_request=invalid_user_request)

        logger.info(f"Verify that the user body response {user_response_body} is an ERROR")
        assert is_error_response_valid(
            error_response=user_response_body,
            code=HttpCodes.BAD_REQUEST
        )

        logger.info(f"Verify that status code is {HttpCodes.BAD_REQUEST}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.BAD_REQUEST), (
            f"actual {actual_status_code}, expected {HttpCodes.BAD_REQUEST}"
        )

    def test_create_user_success(self, create_users):
        """
        Tests scenarios in which the creating a user is expected to be successful.
        """
        for new_user_body_response, actual_status_code in create_users:

            logger.info(f"Verify that the user body response {new_user_body_response} is valid")
            assert is_user_response_body_valid(
                user_response_body=new_user_body_response,

            )

            logger.info(f"Verify that status code is {HttpCodes.OK}")
            assert is_expected_code(actual_code=actual_status_code), (
                f"actual {actual_status_code}, expected {HttpCodes.OK}"
            )

    @pytest.mark.parametrize(
        "user_body_request",
        [
            pytest.param(
                config.USER_REQUEST_VALID_1,
                id="Create_existing_user_one"
            ),
            pytest.param(
                config.USER_REQUEST_VALID_2,
                id="Create_existing_user_two"
            )
        ]
    )
    @pytest.mark.usefixtures(create_users.__name__)
    def test_create_existing_user_fails(self, user_body_request, user_api):
        """
        Tests scenarios in which trying to creating an existing user fails.
        """
        user_response_body, actual_status_code = user_api.post(create_user_body_request=user_body_request)

        logger.info(f"Verify that the user body response {user_response_body} is an ERROR")
        assert is_error_response_valid(
            error_response=user_response_body,
            code=HttpCodes.DUPLICATE
        )

        logger.info(f"Verify that status code is {HttpCodes.DUPLICATE}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.DUPLICATE), (
            f"actual {actual_status_code}, expected {HttpCodes.DUPLICATE}"
        )


class TestGetUserApi(object):

    create_user_body_requests = [config.USER_REQUEST_VALID_1, config.USER_REQUEST_VALID_2]

    def test_get_all_users_without_users(self, user_api):
        """
        Tests that getting all users with empty DB returns empty list.
        """
        user_response_body, actual_status_code = user_api.get_many()

        logger.info(f"Verify that the user body {user_response_body} response is an empty list")
        assert user_response_body == [], f"actual: {user_response_body}, expected: []"

        logger.info(f"Verify that status code is {HttpCodes.OK}")
        assert is_expected_code(actual_code=actual_status_code), (
            f"actual {actual_status_code}, expected {HttpCodes.OK}"
        )

    @pytest.mark.parametrize(
        "username, password",
        [
            pytest.param(
                config.NON_EXISTING_USER_NAME,
                config.VALID_PASSWORD_1,
                id="Get_user_with_valid_password_and_bad_username"
            ),
            pytest.param(
                config.USER_NAME_1,
                config.INVALID_PASSWORD,
                id="Get_user_with_invalid_password_and_valid_username"
            ),
        ]
    )
    @pytest.mark.usefixtures(create_users.__name__)
    def test_get_user_fails(self, username, password, user_api):
        """
        Tests scenarios in which trying to get a user with invalid credentials should fail.
        """
        user_response_body, actual_status_code = user_api.get_one(username=username, password=password)

        logger.info(f"Verify that the user body response {user_response_body} is an ERROR")
        assert is_error_response_valid(error_response=user_response_body, code=HttpCodes.UNAUTHORIZED)

        logger.info(f"Verify that status code is {HttpCodes.UNAUTHORIZED}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.UNAUTHORIZED), (
            f"actual {actual_status_code}, expected {HttpCodes.UNAUTHORIZED}"
        )

    @pytest.mark.parametrize(
        "username, password",
        [
            pytest.param(
                config.USER_NAME_1,
                config.VALID_PASSWORD_1,
                id="Get_user_with_valid_password_and_bad_username"
            ),
            pytest.param(
                config.USER_NAME_2,
                config.VALID_PASSWORD_2,
                id="Get_user_with_invalid_password_and_valid_username"
            ),
        ]
    )
    def test_get_user_succeed(self, username, password, user_api):
        """
        Tests scenarios in which trying to get a user with a valid credentials should succeed.
        """
        user_response_body, actual_status_code = user_api.get_one(username=username, password=password)

        logger.info(f"Verify that the user body response {user_response_body} is valid")
        assert is_user_response_body_valid(user_response_body=user_response_body)

        logger.info(f"Verify that status code is {HttpCodes.OK}")
        assert is_expected_code(actual_code=actual_status_code), (
            f"actual {actual_status_code}, expected {HttpCodes.OK}"
        )

    def test_get_all_users_succeed(self, user_api):
        """
        Tests that get all the users succeed.
        """
        users_body_responses, actual_status_code = user_api.get_many()

        for user_body_response in users_body_responses:
            logger.info(f"Verify that the user body response {user_body_response} is valid")
            assert is_user_response_body_valid(
                user_response_body=user_body_response
            )

        logger.info(f"Verify that status code is {HttpCodes.OK}")
        assert is_expected_code(actual_code=actual_status_code), (
            f"actual {actual_status_code}, expected {HttpCodes.OK}"
        )


@pytest.mark.usefixtures(create_users.__name__)
class TestDeleteUserApi(object):

    create_user_body_requests = [config.USER_REQUEST_VALID_1, config.USER_REQUEST_VALID_2]
    is_delete_user_required = False

    @pytest.mark.parametrize(
        "invalid_username",
        [
            pytest.param(
                config.INVALID_USER_NAME,
                id="Get_user_with_valid_password_and_bad_username"
            ),
            pytest.param(
                config.NON_EXISTING_USER_NAME,
                id="Get_user_with_invalid_password_and_valid_username"
            ),
        ]
    )
    def test_delete_user_fails(self, invalid_username, user_api):
        """
        Tests scenarios where trying to delete a user that does not exist fails.
        """
        user_body_response, actual_status_code = user_api.delete(username=invalid_username)

        if isinstance(user_body_response, str):
            user_body_response = load_json(string=user_body_response)

        logger.info(f"Verify that DELETE body response {user_body_response} is an ERROR")
        assert is_error_response_valid(error_response=user_body_response, code=HttpCodes.NOT_FOUND), (
            f"Response body {user_body_response} is not as expected"
        )

        logger.info(f"Verify that the DELETE response status code is {HttpCodes.NOT_FOUND}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.NOT_FOUND), (
            f"actual {actual_status_code}, expected {HttpCodes.NOT_FOUND}"
        )

    @pytest.mark.parametrize(
        "valid_username",
        [
            pytest.param(
                config.USER_NAME_1,
                id="Get_user_with_valid_password_and_bad_username"
            ),
            pytest.param(
                config.USER_NAME_2,
                id="Get_user_with_invalid_password_and_valid_username"
            ),
        ]
    )
    def test_delete_user_succeed(self, valid_username, user_api):
        """
        Tests scenarios where trying to delete a valid user fails.
        """
        user_body_response, actual_status_code = user_api.delete(username=valid_username)

        logger.info(f"Verify that the DELETE body response is an empty string")
        assert user_body_response == '', f"Failed to delete user with username {valid_username}"

        logger.info(f"Verify that the DELETE response status code is {HttpCodes.NO_CONTENT}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.NO_CONTENT), (
            f"actual {actual_status_code}, expected {HttpCodes.NO_CONTENT}"
        )
