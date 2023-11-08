import os
import json
import boto3

from utils.encoder import DecimalEncoder

client = boto3.resource('dynamodb')
table = client.Table(os.environ.get('SAMPLE_TABLE'))
    
def lambda_handler(event, context):
    item = json.loads(event['body'])
    
    if item["Id"] >= 0:
        data = table.put_item(
            Item=item
        )
    
        return {"statusCode": 200, "body": json.dumps(item, cls=DecimalEncoder)}
    else:
        
        return {"statusCode": 400, "body": json.dumps({"message": "failure to add item"})}
    
