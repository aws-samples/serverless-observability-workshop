+++
title = "Modifying the Application Code"
weight = 11
+++

### Defining Metrics

We are pushing the following Business & Operational metrics:
- Cold Starts
- UnsupportedHTTPMethod
- SuccessfulPutItem
- FailedPutItem
- SuccessfulGetAllItems
- FailedGetAllItems

### Modifying the Put Item Function

#### Importing Dependencies

Open the Lambda function located on **/serverless-observability-workshop/code/sample-app/src/handlers/put-item.js** and start by importing the required dependencies in the beginning of the file and initializing a `_cold_start` variable to capture cold starts in our lambda executions:

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
const { putMetric } = require('../lib/logging/logger')

let _cold_start = true

```

#### Adding PutMetric 

Modify the function handler to handle Cold Starts occurences and push the above defined metrics:

```javascript

exports.putItemHandler = async (event, context) => {
    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }

        const item = await putItem(event)

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

exports.putItemHandler = async (event, context) => {
    try {
        if (_cold_start) {
            //Metrics
            await putMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
            _cold_start = false
        }
        if (event.httpMethod !== 'POST') {
            await putMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }

        const item = await putItem(event)

        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(item)
        }
        //Metrics
        await putMetric(name = 'SuccessfulPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
        //Metrics
        await putMetric(name = 'FailedPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
    }
    return response
}

```
### Modifying the Get All Items Function

#### Importing Dependencies

Open the Lambda function located on **/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js** and start by importing the required dependencies in the beginning of the file and initializing a `_cold_start` variable to capture cold starts in our lambda executions:

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
const { putMetric } = require('../lib/logging/logger')

let _cold_start = true

```

#### Adding PutMetric 

Modify the function handler to handle Cold Starts occurences and push the above defined metrics:

```javascript

exports.getAllItemsHandler = async (event, context) => {

    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }

        const items = await getAllItems()
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
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

exports.getAllItemsHandler = async (event, context) => {

    try {
        if (_cold_start) {
            //Metrics
            await putMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
            _cold_start = false
        }
        if (event.httpMethod !== 'GET') {
            await putMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }

        const items = await getAllItems()
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
        }
        //Metrics
        await putMetric(name = 'SuccessfulGetAllItems', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
        //Metrics
        await putMetric(name = 'FailedGetAllItems', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
    }
    
    return response
}

```

### Deploy the application

```sh

sam build && sam deploy

```
