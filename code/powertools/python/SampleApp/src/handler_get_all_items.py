import os
import json
import boto3

from utils.encoder import DecimalEncoder

client = boto3.resource('dynamodb')
table = client.Table(os.environ.get('SAMPLE_TABLE'))

def lambda_handler(event, context):
    data = table.scan()
    return {"statusCode": 200, "body": json.dumps(data.get('Items'), cls=DecimalEncoder)}
