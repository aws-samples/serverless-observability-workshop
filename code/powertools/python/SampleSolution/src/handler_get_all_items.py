import os
import json
import boto3

from utils.encoder import DecimalEncoder
from utils.functions import get_calling_ip

from aws_lambda_powertools import Logger, Tracer

logger = Logger()
tracer = Tracer()

client = boto3.resource('dynamodb')
table = client.Table(os.environ.get('SAMPLE_TABLE'))

@logger.inject_lambda_context
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.info("Getting ip address from external service")
    logger.info(f"Location: {get_calling_ip()}")
    data = table.scan()
    return {"statusCode": 200, "body": json.dumps(data.get('Items'), cls=DecimalEncoder)}
