from locust import HttpUser, task, between
import json
import uuid

class MyUser(HttpUser):
    wait_time = between(1, 3)

    def create_name(self):
        self.name = str(uuid.uuid1())

    @task(1)
    def index(self):
        self.client.get("items/")
        self.client.get("items/1/")
        name = str(uuid.uuid1())
        headers = {'content-type': 'application/json','Accept-Encoding':'gzip'}
        self.client.post('/items',data= json.dumps({
                  "id": name,
                  "name": "load test"
        }), 
        headers=headers, 
        name = "Create a new item")
# locust -f locust-script.py -H ${ApiUrl} --headless -u 500 -r 100 -t 1m
        