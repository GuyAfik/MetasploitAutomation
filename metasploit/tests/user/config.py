CREATE_USER_URL = "/Users/Create"
GET_USER_URL = "/Users/Get/{email}/{password}"
GET_ALL_USERS_URL = "/Users/Get"
DELETE_USER_URL = "/Users/Delete/{email}"
UPDATE_USER_URL = "/Users/Update/{email}"

VALID_PASSWORD_1 = "123456789"
VALID_PASSWORD_2 = "Thalyta123"
UPDATED_PASSWORD_1 = "1234567890"
UPDATED_PASSWORD_2 = "hello!beautiful"
INVALID_PASSWORD = "1234"
VALID_NAME_1 = "Guy"
VALID_NAME_2 = "Thalyta"
UPDATED_NAME = "Pnina"
INVALID_NAME = "Guy123"
VALID_EMAIL = "guyafik423468@gmail.com"
VALID_EMAIL_2 = "Thalyta@gmail.com"
INVALID_EMAIL = "guyafik42@@.com"
VALID_NON_EXISTING_EMAIL = "blasdf@gmail.com"
USER_DATA = {
    "1": "1",
    "2": "2",
    "3": {
        "4": "4",
        "5": {
            "6": {
                "7": {

                }
            }
        }
    },
    "8": "8"
}

# Invalid user requests
USER_REQUEST_WITH_SHORT_PASSWORD = {
    "name": VALID_NAME_1,
    "password": INVALID_PASSWORD,
    "email": VALID_EMAIL
}

USER_REQUEST_WITH_NUMBERS_IN_NAME = {
    "name": INVALID_NAME,
    "password": VALID_PASSWORD_1,
    "email": VALID_EMAIL
}

USER_REQUEST_WITH_INVALID_EMAIL = {
    "name": VALID_NAME_1,
    "password": VALID_PASSWORD_1,
    "email": INVALID_EMAIL
}

USER_REQUEST_WITHOUT_NAME = {
    "password": VALID_PASSWORD_1,
    "email": VALID_EMAIL
}

USER_REQUEST_WITHOUT_PASSWORD_AND_USER_NAME = {
    "first_name": VALID_NAME_1,
    "last_name": VALID_NAME_1
}

# Valid user requests
USER_REQUEST_VALID_1 = {
    "name": VALID_NAME_1,
    "password": VALID_PASSWORD_1,
    "email": VALID_EMAIL
}

USER_REQUEST_VALID_2 = {
    "name": VALID_NAME_2,
    "password": VALID_PASSWORD_2,
    "email": VALID_EMAIL_2
}

UPDATE_USER_BODY_REQUEST_WITH_FAKE_PARAMS_1 = {
    "bla": "blabla",
    "something": "nothing"
}

UPDATE_USER_BODY_REQUEST_WITH_FAKE_PARAMS_2 = {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4"
}

UPDATE_USER_PASSWORD_BODY_REQUEST = {
    "password": UPDATED_PASSWORD_1
}

UPDATE_USER_NAME_BODY_REQUEST = {
    "name": UPDATED_NAME
}

UPDATE_USER_DATA_BODY_REQUEST = {
    "data": USER_DATA
}

UPDATE_ALL_USER_PARAMS_BODY_REQUEST = {
    "password": UPDATED_PASSWORD_2,
    "name": UPDATED_NAME,
    "data": USER_DATA
}

