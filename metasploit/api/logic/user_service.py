import hashlib
import binascii
import os

from metasploit.api.logic.services import UserService
from metasploit.api.database import DatabaseOperations, DatabaseCollections

from metasploit.api.user.user import User
from metasploit.api.errors import InvalidUserNameOrPassword
from metasploit.api.utils.decorators import validate_json_request


class UserServiceImplementation(UserService):
    """
    Implements the user service.

    Attributes:
        database (DatabaseOperations): DatabaseOperations object.
    """
    type = "User"

    def __init__(self):
        self.database = DatabaseOperations(collection_type=DatabaseCollections.USERS)

    def create(self, *args, **kwargs):
        return self.create_user(*args, **kwargs)

    def get_one(self, *args, **kwargs):
        return self.get_user(*args, **kwargs)

    def get_all(self):
        return self.get_all_users()

    def delete_one(self, *args, **kwargs):
        return self.delete_user(*args, **kwargs)

    def get_user(self, email, password):
        """
        Returns an existing user document from the DB.

        Returns:
            dict: a user client response in case found.

        Raises:
            PasswordIsInvalidError: in case the password is not correct.
        """
        existing_user = User(**self.database.get_user_document_by_id(user_id=hash_email(email=email)))

        if verify_password(stored_password=existing_user.password, provided_password=password):
            return existing_user.client_response()
        else:
            raise InvalidUserNameOrPassword()

    def get_all_users(self):
        """
        Gets all the existing users.

        Returns:
            list[dict]: a list of all available users.
        """
        users_response = []
        all_available_users = self.database.get_all_documents()

        for user in all_available_users:
            users_response.append(User(**user).client_response())
        return users_response

    @validate_json_request("name", "password", "email")
    def create_user(self, **create_user_json):
        """
        Creates a user in the DB and returns the new created user document.

        Returns:
            dict: a new user document.
        """
        new_user = User(**create_user_json)
        new_user.password = hash_password(password=new_user.password)
        self.database.insert_user_document(new_user_document=new_user.document())
        return new_user.client_response()

    def delete_user(self, email):
        """
        Deletes a user from the DB.

        Returns:
            str: empty string as a response in case of success.
        """
        self.database.delete_amazon_document(resource_id=hash_email(email=email), type=self.type)
        return ''

    def update(self, email, **update_user_json):
        """
        Updates a user and inserts the changes to the DB.

        Returns:
            str: empty string as a response in case of success.
        """

        _data, _name, _password = "data", "name", "password"
        user_id = hash_email(email=email)

        existing_user = User(**self.database.get_user_document_by_id(user_id=user_id))

        if _name in update_user_json:
            existing_user.name = update_user_json.get(_name)
        if _password in update_user_json:
            existing_user.password = hash_password(password=update_user_json.get(_password))
        if _data in update_user_json:
            existing_user.data = update_user_json.get(_data)

        self.database.update_amazon_document(amazon_resource_id=user_id, update=existing_user.document())
        return ''


def hash_email(email):
    """
    Returns the hashed representation of the email parameter.

    Args:
        email (str): user email.

    Returns:
        str: hashed email.
    """
    return hashlib.sha256(f"{email}{email}{email}".encode('utf-8')).hexdigest()


def hash_password(password, hashname='sha512', num_of_iterations=10000, salt_bytes=60):
    """
    Hashes a password combined with a salt value.

    Args:
        password (str): password to hash.
        hashname (str): which hashing should be performed. e.g.: "sha512", "sha256"
        num_of_iterations (int): the num of iterations that the hash function will operate to encrypt the data.
        salt_bytes (int): number of salt bytes for hashing usage.

    Returns:
        str: hashed password representation.
    """
    salt = hashlib.sha256(os.urandom(salt_bytes)).hexdigest().encode('ascii')

    pwdhash = hashlib.pbkdf2_hmac(
        hash_name=hashname, password=password.encode('utf-8'), salt=salt, iterations=num_of_iterations
    )
    pwdhash = binascii.hexlify(data=pwdhash)

    return (salt + pwdhash).decode('ascii')


def verify_password(stored_password, provided_password, hashname='sha512', num_of_iterations=10000):
    """
    Checks whether a provided user by the client is indeed the correct password.

    Args:
        stored_password (str): The stored password from the DB.
        provided_password (str): the password that the client provides.
        hashname (str): which hashing should be performed on the provided password. e.g.: "sha512", "sha256"
        num_of_iterations (int): the num of iterations that the hash function will operate to encrypt the provided pass.

    Returns:
        bool: if the provided password by the client is the same as stored password, False otherwise.
    """
    salt = stored_password[:64]
    stored_password = stored_password[64:]

    pwdhash = hashlib.pbkdf2_hmac(
        hash_name=hashname,
        password=provided_password.encode('utf-8'),
        salt=salt.encode('ascii'),
        iterations=num_of_iterations
    )
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')

    return pwdhash == stored_password