import logging


logger = logging.getLogger("UserHelpers")


def is_user_response_body_valid(user_response_body, **expected):
    """
    Validates whether a user response body is valid or not.

    Args:
        user_response_body (dict): a user response body.

    Keyword arguments:
         _id (str): the expected user ID.
         name (str): the expected user name.
         data (str): the expected user data

    Returns:
        bool: True if user response body is valid, False otherwise.
    """
    _id, _name, _data = "_id", "name", "data"

    if _id not in user_response_body:
        logger.error(f"There is no {_id} key in the user response body {user_response_body}")
        return False

    if _name not in user_response_body:
        logger.error(f"There is no {_name} key in the user response body {user_response_body}")
        return False

    if _data not in user_response_body:
        logger.error(f"There is not {_data} key in the user response body {user_response_body}")
        return False

    return is_user_response_body_expected(user_response_body, **expected)


def is_user_response_body_expected(user_response_body, **expected):
    """
    Verifies whether a user response body is as expected or not.

    Args:
        user_response_body (dict): a user response body.

    Keyword arguments:
         _id (str): the expected user ID.
         name (str): the expected user name.
         data (str): the expected user data

    Returns:
        bool: True if user response body as expected, False otherwise.
    """
    _id, _name, _data = "_id", "name", "data"

    if _id in expected:
        expected_id = expected.get(_id)
        actual_id = user_response_body.get(_id)
        if expected_id != actual_id:
            logger.error(f"actual user ID: {actual_id}, expected ID: {expected_id}")
            return False

    if _name in expected:
        expected_name = expected.get(_name)
        actual_name = user_response_body.get(_name)
        if expected_name != actual_name:
            logger.error(f"actual name: {actual_name}, expected name: {expected_name}")
            return False

    if _data in expected:
        expected_data = expected.get(_data)
        actual_data = user_response_body.get(_data)
        if actual_data != expected_data:
            logger.error(f"actual user data: {actual_data}, expected user data: {expected_data}")
            return False

    return True
