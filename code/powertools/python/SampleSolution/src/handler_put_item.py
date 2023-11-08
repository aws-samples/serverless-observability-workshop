import os
import json
import boto3

from utils.encoder import DecimalEncoder
from utils.functions import get_calling_ip

from aws_lambda_powertools import Logger, Metrics, single_metric
from aws_lambda_powertools.metrics import MetricUnit

logger = Logger()
metrics = Metrics()

client = boto3.resource('dynamodb')
table = client.Table(os.environ.get('SAMPLE_TABLE'))
    
@logger.inject_lambda_context
@metrics.log_metrics(capture_cold_start_metric=True)
def lambda_handler(event, context):
    with single_metric(name="TotalExecutions", unit=MetricUnit.Count, value=1) as metric:
        metric.add_dimension(name="FunctionContext", value="$LATEST")

    item = json.loads(event['body'])
    
    calling_ip = get_calling_ip()
    logger.append_keys(additional_info={
        "request_location": calling_ip,
        "body": event["body"]
    })
    logger.debug("ip address successfuly captured")


    if item["Id"] >= 0:
        data = table.put_item(
            Item=item
        )
        metrics.add_metric(name="SuccessfulPutItem", unit=MetricUnit.Count, value=1)
        metrics.add_metadata(key="request_location", value=f"{calling_ip}")
        return {"statusCode": 200, "body": json.dumps(item, cls=DecimalEncoder)}
    else:
        metrics.add_metric(name="FailedPutItem", unit=MetricUnit.Count, value=1)
        return {"statusCode": 400, "body": json.dumps({"message": "failure to add item"})}
    

