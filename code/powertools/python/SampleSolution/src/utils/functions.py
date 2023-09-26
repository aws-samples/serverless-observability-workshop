import urllib3
from aws_lambda_powertools import Tracer

SERVICE_URL = "http://checkip.amazonaws.com/"
USER_AGENT = 'AWS Lambda Python/3.9 Client'

tracer = Tracer()

@tracer.capture_method
def get_calling_ip():
    http = urllib3.PoolManager()
    response = http.request('GET',SERVICE_URL, headers={'User-Agent': USER_AGENT})
    location = response.data.decode('utf-8').strip()
    tracer.put_annotation("Location", location)
    tracer.put_metadata("Location", location)
    return location
