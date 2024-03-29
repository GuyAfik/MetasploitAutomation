import boto3
from metasploit.api.utils.helpers import singleton
import os


@singleton
class AwsAccess(object):
    """
    This is a class for API calls to the AWS entire API including EC2

    Attributes:
        _client(Boto3.client): client for api calls to AWS
        _resource(Boto3.resource): resource for api calls to AWS
        _session(Boto3.session): sessions for api calls to AWS

    Documentation:
        https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
        https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#service-resource
    """

    EC2 = 'ec2'

    def __init__(self):
        # For amit's mac
        # os.environ['AWS_DEFAULT_REGION'] = 'us-west-2'
        self._client = boto3.client(self.EC2, region_name='us-east-2', aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"), aws_secret_access_key=os.environ.get("AWS_SECRET_KEY"))
        self._resource = boto3.resource(self.EC2, region_name='us-east-2', aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"), aws_secret_access_key=os.environ.get("AWS_SECRET_KEY"))
        self._session = boto3.Session()

    @property
    def client(self):
        return self._client

    @property
    def resource(self):
        return self._resource

    @property
    def session(self):
        return self._session


aws_api = AwsAccess()
