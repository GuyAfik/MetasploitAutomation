import pytest
import logging


from metasploit.api.response import HttpCodes
from metasploit.tests.conftest import test_client  # noqa: F401
from metasploit.tests.helpers import (
    is_expected_code,
    is_error_response_valid
)


from . import config
from .user_api import user_api  # noqa: F401
from .fixtures import create_users, find_user_response  # noqa: F401
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
                config.USER_REQUEST_WITH_NUMBERS_IN_NAME,
                id="Create_user_with_numbers_in_name"
            ),
            pytest.param(
                config.USER_REQUEST_WITH_SHORT_PASSWORD,
                id="Create_user_with_short_password"
            ),
            pytest.param(
                config.USER_REQUEST_WITHOUT_NAME,
                id="Create_user_without_name"
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
                user_response_body=new_user_body_response, data={}
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
        "email, password",
        [
            pytest.param(
                config.INVALID_EMAIL,
                config.VALID_PASSWORD_1,
                id="Get_user_with_valid_password_and_bad_email"
            ),
            pytest.param(
                config.VALID_EMAIL_2,
                config.INVALID_PASSWORD,
                id="Get_user_with_invalid_password_and_valid_email"
            ),
        ]
    )
    @pytest.mark.usefixtures(create_users.__name__)
    def test_get_user_fails(self, email, password, user_api):
        """
        Tests scenarios in which trying to get a user with invalid credentials should fail.
        """
        user_response_body, actual_status_code = user_api.get_one(email=email, password=password)

        logger.info(f"Verify that the user body response {user_response_body} is an ERROR")
        assert is_error_response_valid(error_response=user_response_body, code=HttpCodes.UNAUTHORIZED)

        logger.info(f"Verify that status code is {HttpCodes.UNAUTHORIZED}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.UNAUTHORIZED), (
            f"actual {actual_status_code}, expected {HttpCodes.UNAUTHORIZED}"
        )

    @pytest.mark.parametrize(
        "email, password",
        [
            pytest.param(
                config.VALID_EMAIL,
                config.VALID_PASSWORD_1,
                id="Get_user_with_valid_password_and_bad_username"
            ),
            pytest.param(
                config.VALID_EMAIL_2,
                config.VALID_PASSWORD_2,
                id="Get_user_with_invalid_password_and_valid_username"
            ),
        ]
    )
    def test_get_user_succeed(self, email, password, user_api):
        """
        Tests scenarios in which trying to get a user with a valid credentials should succeed.
        """
        user_response_body, actual_status_code = user_api.get_one(email=email, password=password)

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
        "invalid_email",
        [
            pytest.param(
                config.INVALID_EMAIL,
                id="Delete_user_with_invalid_email"
            ),
            pytest.param(
                config.VALID_NON_EXISTING_EMAIL,
                id="Delete_user_with_non_existing_email"
            ),
        ]
    )
    def test_delete_user_fails(self, invalid_email, user_api):
        """
        Tests scenarios where trying to delete a user that does not exist fails.
        """
        user_body_response, actual_status_code = user_api.delete(email=invalid_email, expected_to_fail=True)

        logger.info(f"Verify that DELETE body response {user_body_response} is an ERROR")
        assert is_error_response_valid(error_response=user_body_response, code=HttpCodes.NOT_FOUND), (
            f"Response body {user_body_response} is not as expected"
        )

        logger.info(f"Verify that the DELETE response status code is {HttpCodes.NOT_FOUND}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.NOT_FOUND), (
            f"actual {actual_status_code}, expected {HttpCodes.NOT_FOUND}"
        )

    @pytest.mark.parametrize(
        "valid_email",
        [
            pytest.param(
                config.VALID_EMAIL,
                id="Get_user_with_valid_password_and_bad_username"
            ),
            pytest.param(
                config.VALID_EMAIL_2,
                id="Get_user_with_invalid_password_and_valid_username"
            ),
        ]
    )
    def test_delete_user_succeed(self, valid_email, user_api):
        """
        Tests scenarios where trying to delete a valid user fails.
        """
        user_body_response, actual_status_code = user_api.delete(email=valid_email)

        logger.info(f"Verify that the DELETE body response is an empty string")
        assert user_body_response == '', f"Failed to delete user with username {valid_email}"

        logger.info(f"Verify that the DELETE response status code is {HttpCodes.NO_CONTENT}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.NO_CONTENT), (
            f"actual {actual_status_code}, expected {HttpCodes.NO_CONTENT}"
        )


@pytest.mark.usefixtures(create_users.__name__)
class TestPutUserApi(object):

    create_user_body_requests = [config.USER_REQUEST_VALID_1, config.USER_REQUEST_VALID_2]
    _id, _name, _data = "_id", "name", "data"

    @pytest.mark.parametrize(
        ("email", "password", "update_user_body_request"),
        [
            pytest.param(
                config.VALID_EMAIL,
                config.VALID_PASSWORD_1,
                config.UPDATE_USER_BODY_REQUEST_WITH_FAKE_PARAMS_1,
                id="Update_user_with_invalid_parameters_1"
            ),
            pytest.param(
                config.VALID_EMAIL_2,
                config.VALID_PASSWORD_2,
                config.UPDATE_USER_BODY_REQUEST_WITH_FAKE_PARAMS_2,
                id="Update_user_with_invalid_parameters_2"
            ),
        ]
    )
    def test_update_user_with_unexpected_parameters(
        self, email, password, update_user_body_request, user_api, find_user_response
    ):
        """
        Tests scenarios where updating fields of a user that cannot be updated do nothing.
        """
        body_response_before_update = find_user_response

        user_body_response, actual_status_code = user_api.put(email=email, request_body=update_user_body_request)

        logger.info(f"Verify that the PUT body response is an empty string")
        assert user_body_response == '', f"Failed to update user with username {email} password {password}"

        logger.info(f"Verify that the PUT response status code is {HttpCodes.NO_CONTENT}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.NO_CONTENT), (
            f"actual {actual_status_code}, expected {HttpCodes.NO_CONTENT}"
        )

        user_body_response_post_update, _ = user_api.get_one(email=email, password=password)
        assert body_response_before_update == user_body_response_post_update

    @pytest.mark.parametrize(
        ("email", "update_user_body_request"),
        [
            pytest.param(
                config.VALID_NON_EXISTING_EMAIL,
                config.UPDATE_USER_BODY_REQUEST_WITH_FAKE_PARAMS_1,
                id="Update_user_with_invalid_email"
            )
        ]
    )
    def test_update_user_with_invalid_credentials(self, email, update_user_body_request, user_api):
        """
        Tests scenarios where updating a user with invalid credentials should fail.
        """
        user_body_response, actual_status_code = user_api.put(
            email=email, request_body=update_user_body_request, expected_to_fail=True
        )

        logger.info(f"Verify that PUT body response {user_body_response} is an ERROR")
        assert is_error_response_valid(error_response=user_body_response, code=HttpCodes.UNAUTHORIZED), (
            f"Response body {user_body_response} is not as expected"
        )

        logger.info(f"Verify that the PUT response status code is {HttpCodes.UNAUTHORIZED}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.UNAUTHORIZED), (
            f"actual {actual_status_code}, expected {HttpCodes.UNAUTHORIZED}"
        )

    @pytest.mark.parametrize(
        ("email", "password", "update_user_body_request", "expected_params"),
        [
            pytest.param(
                config.VALID_EMAIL,
                config.UPDATED_PASSWORD_1,
                config.UPDATE_USER_PASSWORD_BODY_REQUEST,
                {},
                id="Update_user_password"
            ),
            pytest.param(
                config.VALID_EMAIL,
                config.UPDATED_PASSWORD_1,
                config.UPDATE_USER_NAME_BODY_REQUEST,
                {_name: config.UPDATE_USER_NAME_BODY_REQUEST[_name]},
                id="Update_user's_name"
            ),
            pytest.param(
                config.VALID_EMAIL,
                config.UPDATED_PASSWORD_1,
                config.UPDATE_USER_DATA_BODY_REQUEST,
                {_data: config.UPDATE_USER_DATA_BODY_REQUEST[_data]},
                id="Update_user_data"
            ),
            pytest.param(
                config.VALID_EMAIL_2,
                config.UPDATED_PASSWORD_2,
                config.UPDATE_ALL_USER_PARAMS_BODY_REQUEST,
                {
                    _name: config.UPDATE_ALL_USER_PARAMS_BODY_REQUEST[_name],
                    _data: config.UPDATE_ALL_USER_PARAMS_BODY_REQUEST[_data]
                },
                id="Update_all_user_parameters"
            )
        ]
    )
    def test_update_user_succeed(self, email, password, update_user_body_request, expected_params, user_api):
        """
        Tests scenarios where updating a user should succeed.
        """
        user_body_response, actual_status_code = user_api.put(email=email, request_body=update_user_body_request)

        logger.info(f"Verify that the PUT body response is an empty string")
        assert user_body_response == '', f"Failed to update user with username {email} password {password}"

        logger.info(f"Verify that the PUT response status code is {HttpCodes.NO_CONTENT}")
        assert is_expected_code(actual_code=actual_status_code, expected_code=HttpCodes.NO_CONTENT), (
            f"actual {actual_status_code}, expected {HttpCodes.NO_CONTENT}"
        )

        user_body_response_post_update, status_code = user_api.get_one(email=email, password=password)
        assert status_code != HttpCodes.UNAUTHORIZED, f"Failed to update password {password}"

        for key, val in expected_params.items():
            logger.info(f"Verify that update {key} to {val} was successful")
            assert user_body_response_post_update[key] == val, (
                f"Failed to update {key} to {val}, actual: {user_body_response_post_update[key]}"
            )
