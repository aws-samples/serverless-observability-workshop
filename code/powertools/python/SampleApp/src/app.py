import os
import json
import boto3

from utils.router import Router
from utils.encoder import DecimalEncoder

client = boto3.resource('dynamodb')
table = client.Table(os.environ.get('SAMPLE_TABLE'))

def get_item(**kargs):
    item_id = int(kargs["event"]["pathParameters"]["proxy"].split("/")[-1])
    data = table.query(    
        KeyConditionExpression='Id = :id_val',
        ExpressionAttributeValues={
            ':id_val': item_id
        }
    )
    return {"statusCode": 200, "body": json.dumps(data.get('Items'), cls=DecimalEncoder)}

def list_items(**kargs):
    data = table.scan()
    return {"statusCode": 200, "body": json.dumps(data.get('Items'), cls=DecimalEncoder)}

def create_item(**kargs):

    item = json.loads(kargs['event']['body'])
    
    data = table.put_item(
        Item=item
    )
    
    return {"statusCode": 200, "body": json.dumps(item, cls=DecimalEncoder)}

router = Router()
router.set(path="/api/items/",      method="GET",   handler=list_items)
router.set(path="/api/items/{id}",  method="GET",   handler=get_item)
router.set(path="/api/items/",      method="POST",  handler=create_item)

def lambda_handler(event, context):
    path = event["requestContext"]["http"]["path"]
    http_method = event["requestContext"]["http"]["method"]
    method, _ = router.get(path=path, method=http_method)
    return method(event=event)
