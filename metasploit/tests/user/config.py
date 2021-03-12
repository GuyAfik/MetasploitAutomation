CREATE_USER_URL = "/Users/Create"
GET_USER_URL = "/Users/Get/{username}/{password}"
GET_ALL_USERS_URL = "/Users/Get"
DELETE_USER_URL = "/Users/Delete/{username}"

VALID_PASSWORD_1 = "123456789"
VALID_PASSWORD_2 = "Thalyta123"
INVALID_PASSWORD = "1234"
VALID_FIRST_NAME = "Guy"
VALID_FIRST_NAME_2 = "Thalyta"
VALID_LAST_NAME_2 = "DosSantos"
INVALID_FIRST_NAME = "Guy123"
VALID_LAST_NAME = "jackson"
INVALID_LAST_NAME = "jackson123"
USER_NAME_1 = "username1"
USER_NAME_2 = "username2"
INVALID_USER_NAME = "blabla"
NON_EXISTING_USER_NAME = "Guy8395"
VALID_EMAIL = "guyafik423468@gmail.com"
VALID_EMAIL_2 = "Thalyta@gmail.com"
INVALID_EMAIL = "guyafik42@@.com"

# Invalid user requests
USER_REQUEST_WITH_SHORT_PASSWORD = {
    "first_name": VALID_FIRST_NAME,
    "last_name": VALID_LAST_NAME,
    "username": USER_NAME_1,
    "password": INVALID_PASSWORD,
    "email": VALID_EMAIL
}

USER_REQUEST_WITH_NUMBERS_IN_FIRST_NAME = {
    "first_name": INVALID_FIRST_NAME,
    "last_name": VALID_LAST_NAME,
    "username": USER_NAME_1,
    "password": VALID_PASSWORD_1,
    "email": VALID_EMAIL
}

USER_REQUEST_WITH_NUMBERS_IN_LAST_NAME = {
    "first_name": VALID_FIRST_NAME,
    "last_name": INVALID_LAST_NAME,
    "username": USER_NAME_1,
    "password": VALID_PASSWORD_1,
    "email": VALID_EMAIL
}

USER_REQUEST_WITH_INVALID_EMAIL = {
    "first_name": VALID_FIRST_NAME,
    "last_name": VALID_LAST_NAME,
    "username": USER_NAME_1,
    "password": VALID_PASSWORD_1,
    "email": INVALID_EMAIL
}

USER_REQUEST_WITHOUT_FIRST_NAME_AND_LAST_NAME = {
    "username": USER_NAME_1,
    "password": VALID_PASSWORD_1,
    "email": VALID_EMAIL
}

USER_REQUEST_WITHOUT_PASSWORD_AND_USER_NAME = {
    "first_name": VALID_FIRST_NAME,
    "last_name": VALID_LAST_NAME,
    "username": USER_NAME_1,
}

# Valid user requests
USER_REQUEST_VALID_1 = {
    "first_name": VALID_FIRST_NAME,
    "last_name": VALID_LAST_NAME,
    "username": USER_NAME_1,
    "password": VALID_PASSWORD_1,
    "email": VALID_EMAIL
}

USER_REQUEST_VALID_2 = {
    "first_name": VALID_FIRST_NAME_2,
    "last_name": VALID_LAST_NAME_2,
    "username": USER_NAME_2,
    "password": VALID_PASSWORD_2,
    "email": VALID_EMAIL_2
}