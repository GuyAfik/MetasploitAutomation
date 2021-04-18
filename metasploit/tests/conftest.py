import pytest

from flask import current_app
from metasploit.api.controllers.flask_wrapper import application


@pytest.fixture(scope="session")
def test_client():
    """
    Provides a test test_client of flask for all the tests/fixtures.
    """
    app = application
    app.config['TESTING'] = True

    with app.app_context():
        yield current_app.test_client()
