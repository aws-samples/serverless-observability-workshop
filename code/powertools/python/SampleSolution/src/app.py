import os
import json
import boto3

from utils.router import Router
from utils.encoder import DecimalEncoder
from utils.functions import get_calling_ip

from aws_lambda_powertools import Logger, Metrics, single_metric, Tracer
from aws_lambda_powertools.metrics import MetricUnit

logger = Logger()
tracer = Tracer()
metrics = Metrics()

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
    logger.info("Getting ip address from external service")
    logger.info(f"Location: {get_calling_ip()}")
    

    data = table.scan()
    return {"statusCode": 200, "body": json.dumps(data.get('Items'), cls=DecimalEncoder)}

def create_item(**kargs):
    with single_metric(name="TotalExecutions", unit=MetricUnit.Count, value=1) as metric:
        metric.add_dimension(name="FunctionContext", value="$LATEST")

    item = json.loads(kargs['event']['body'])

    logger.append_keys(additional_info={
        "request_location": get_calling_ip(),
        "item_id": item["Id"]
    })
    logger.info("Creating item")

    if item["Id"] >= 0:
        table.put_item(
            Item=item
        )
        metrics.add_metric(name="SuccessfulPutItem", unit=MetricUnit.Count, value=1)
        metrics.add_metadata(key="request_location", value=f"{get_calling_ip()}")
        return {"statusCode": 200, "body": json.dumps(item, cls=DecimalEncoder)}
    else:
        metrics.add_metric(name="FailedPutItem", unit=MetricUnit.Count, value=1)
        return {"statusCode": 400, "body": json.dumps({"message": "failure to add item"})}

router = Router()
router.set(path="/api/items/",      method="GET",   handler=list_items)
router.set(path="/api/items/{id}",  method="GET",   handler=get_item)
router.set(path="/api/items/",      method="POST",  handler=create_item)

@metrics.log_metrics(capture_cold_start_metric=True)
@logger.inject_lambda_context
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    path = event["requestContext"]["http"]["path"]
    http_method = event["requestContext"]["http"]["method"]
    method, _ = router.get(path=path, method=http_method)
    return method(event=event)
