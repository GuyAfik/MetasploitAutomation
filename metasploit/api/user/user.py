import hashlib
from email_validator import validate_email, EmailNotValidError

from metasploit.api.response import client_user_response, fill_user_document
from metasploit.api.errors import BadEmailError, BadFirstNameOrLastName, BadPasswordLength


class User(object):
    """
    This class represents a user in the API.

    Attributes:
        email (str): email address of the user.
        _id (str): user ID.


    """
    def __init__(self, name=None, email=None, password=None, _id=None, data=None):
        """
        Initializes the user constructor.

        Args:
            name (str): name of the user.
            email (str): email address of the user.
            password (str): password of the user.
            _id (str): user ID.
            data (dict): user data.
        """
        if len(password) < 8:
            raise BadPasswordLength(password=password)
        try:
            validate_email(email=email)
        except EmailNotValidError:
            raise BadEmailError(email=email)

        if not name.isalpha():
            raise BadFirstNameOrLastName(name=name)

        self._name = name
        self._email = email
        self._password = password
        self._data = data if data else {}
        self._id = hashlib.sha256(f"{email}{email}{email}".encode('utf-8')).hexdigest() if not _id else _id

    @property
    def id(self):
        return self._id

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, name):
        self._name = name

    @property
    def email(self):
        return self._email

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = password

    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, data):
        self._data = data

    def client_response(self):
        """
        Returns a response built for the client.

        Returns:
            dict: a response meant to be sent for the client.
        """
        return client_user_response(user=self)

    def document(self):
        """
        Returns a response built for the DB.

        Returns:
            dict: a response meant to be saved for the DB.
        """
        return fill_user_document(user=self)
