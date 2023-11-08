import os
import json
import boto3

from utils.encoder import DecimalEncoder

client = boto3.resource('dynamodb')
table = client.Table(os.environ.get('SAMPLE_TABLE'))

def lambda_handler(event, context):
    item_id = int(event["pathParameters"]["id"])
    data = table.query(    
        KeyConditionExpression='Id = :id_val',
        ExpressionAttributeValues={
            ':id_val': item_id
        }
    )
    return {"statusCode": 200, "body": json.dumps(data.get('Items'), cls=DecimalEncoder)}
