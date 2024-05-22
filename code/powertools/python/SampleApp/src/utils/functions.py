import urllib3

SERVICE_URL = "http://checkip.amazonaws.com/"
USER_AGENT = 'AWS Lambda Python/3.9 Client'

def get_calling_ip():
    http = urllib3.PoolManager()
    response = http.request('GET',SERVICE_URL, headers={'User-Agent': USER_AGENT})
    return response.data.decode('utf-8').strip()
