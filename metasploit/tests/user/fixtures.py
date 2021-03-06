import pytest
import logging

from metasploit.api.response import HttpCodes
from metasploit.api.logic.user_service import hash_email

logger = logging.getLogger("UserFixtures")


@pytest.fixture(scope="session", autouse=True)
def delete_all_users(request, user_api):
    """
    Deletes all the users left overs in the api.
    """
    def fin():
        users_body_response, status_code = user_api.get_many()
        assert status_code == HttpCodes.OK

        for user_res in users_body_response:

            username = user_res.get("username")
            logger.info(f"Delete user {username}")
            delete_body_response, status_code = user_api.delete(email=username)

            assert delete_body_response == ''
            assert status_code == HttpCodes.NO_CONTENT

    request.addfinalizer(fin)


@pytest.fixture(scope="class")
def create_users(request, user_api):
    """
    Creates users via post request.

    Returns:
        list[list[tuple]/tuple, int]: a list of all newly created users body responses and their status code.
    """
    create_user_body_requests = getattr(request.cls, "create_user_body_requests", [])
    is_delete_user_required = getattr(request.cls, "is_delete_user_required", True)
    users_body_responses = []
    delete_users = []

    def fin():
        """
        Deletes all the created users using DELETE.
        """
        if is_delete_user_required:
            for email in delete_users:
                logger.info(f"Delete user {email}")
                delete_body_response, status_code = user_api.delete(email=email)

                assert delete_body_response == ''
                assert status_code == HttpCodes.NO_CONTENT
    request.addfinalizer(fin)

    for user_body_request in create_user_body_requests:
        logger.info(f"Creating user {user_body_request}")
        users_body_responses.append(user_api.post(create_user_body_request=user_body_request))
        delete_users.append(user_body_request.get("email"))

    return users_body_responses


@pytest.fixture(scope="function")
def find_user_response(request, user_api):
    """
    Finds the corresponding user response that was created by user email.

    Returns:
        dict: a corresponding user body response, empty dict otherwise.
    """
    _email, _id = "email", "_id"
    email = request.getfixturevalue(argname=_email)

    users_body_responses, _ = user_api.get_many()

    for user_body_resp in users_body_responses:
        if hash_email(email=email) == user_body_resp[_id]:
            return user_body_resp

    return {}
