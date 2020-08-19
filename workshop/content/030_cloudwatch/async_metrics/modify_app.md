+++
title = "Modifying the Application Code"
weight = 12
+++

### Defining Metrics

We are pushing the following Business & Operational metrics:
- Cold Starts
- UnsupportedHTTPMethod
- SuccessfulGetItem
- FailedGetItem
### Modifying the Get All Items Function

#### Importing Dependencies

Open the Lambda function located on **/serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js** and start by importing the required dependencies in the beginning of the file and initializing a `_cold_start` variable to capture cold starts in our lambda executions:

```javascript

const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()

```

To:

```javascript

const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const { MetricUnit } = require('../lib/helper/models')
const { logMetric } = require('../lib/logging/logger')

let _cold_start = true

```

#### Adding LogMetric 

Modify the function handler to handle Cold Starts occurences and push the above defined metrics:

```javascript

exports.getByIdHandler = async (event, context) => {
  let response
  try {
    if (event.httpMethod !== 'GET') {
      throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
    }

    id = event.pathParameters.id
    const item = await getItemById(id)

    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(item)
    }
  } catch (err) {
    response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(err)
    }
  }
  return response
}

```

to :

```javascript

exports.getByIdHandler = async (event, context) => {
  let response
  try {
    if (_cold_start) {
      //Metrics
      await logMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
      _cold_start = false
    }
    if (event.httpMethod !== 'GET') {
      await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
    }

    id = event.pathParameters.id
    const item = await getItemById(id)

    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(item)
    }
    //Metrics
    await logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
  } catch (err) {
    response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(err)
    }
    //Metrics
    await logMetric(name = 'FailedGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
  }
  return response
}

```

### Deploy the application

```sh

sam build && sam deploy

```

### Test the `Get Item By ID` operation

```sh
curl -X GET $ApiUrl/items/1 | jq
```
