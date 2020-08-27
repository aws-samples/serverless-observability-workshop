+++
title = "Modifying the Application Code"
weight = 53
+++

#### Importing Dependencies

Open the Lambda function located on **/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js** and start by importing the required dependencies in the beginning of the file and initializing a `log` variable to be used in our lambda executions:

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
const { logger_setup } = require('../lib/logging/logger')
let log

```

#### Instrumenting Logs 

Modify the function handler to handle Cold Starts occurences and push the above defined metrics:

```javascript

exports.getAllItemsHandler = async (event, context) => {
    let response
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
    log = logger_setup()
    let response

    log.info(event)
    log.info(context)
    try {
        if (event.httpMethod !== 'GET') {
            // Logging
            log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": `getAllItems only accept GET method, you tried: ${event.httpMethod}` })
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
        // Logging
        log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": err })
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
    }
    // Logging
    log.info({ operation: 'get-all-items', 'method': 'getAllItemsHandler', eventPath: event.path, statusCode: response.statusCode, body: JSON.parse(response.body) })
    return response
}

```

### Deploy the application

```sh

sam build && sam deploy

```

### Test the `Get Item By ID` operation

```sh
curl -X GET $ApiUrl/items/ | jq
```
