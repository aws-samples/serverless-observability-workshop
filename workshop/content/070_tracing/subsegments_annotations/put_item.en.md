---
title: "Put Item Function"
weight: 75
---

### Modify the application

Go back you your **Cloud9** environment and open your app workspace at ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modify the Put Item Function

1. Lambda doesn't allow us to add custom annotations and metadata to its root segment, so we first need to create our custom subsegment by updating our handler.

1. Edit the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js*** file to add an initial subsegment called `## Handler` using the `AWSXRay.captureAsyncFunc()` method on the entire handler method and closing the `subsegment` inside a new `finally` clause in our `try/catch`.

    ```javascript

    exports.putItemHandler = async (event, context) => {
      return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
          // Initialization
          try{
            // Happy Path
          } catch(err) {
            // Exception Handling
          } finally {
              subsegment.close()
          }
          return response
      }, AWSXRay.getSegment());
    }
    ```

1. Next, we are ready to add our annotations in case of successful and failed executions to our given Item ID. Inside your `handler`, find and add in the end of your `try` and beginning of your `catch` statements the annotations for `ItemID` and `Status`:

    ````javascript
        // Initialization
        try{
            // Happy Path
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. Next, let's modify the `putItem()` method to receive the `subsegment` as a parameter and create an additional subsegment to capture any business logic inside this method. We will be also adding the item payload as metadata.

    ```javascript
    const putItem = async (event, segment) => {
        return AWSXRay.captureAsyncFunc('## putItemData', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Item Payload', params)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```


1. Now, let's modify the `publishSns()` method to also receive the `subsegment` as a parameter and create an additional subsegment to capture any business logic inside this method. We will be also adding the message payload as metadata.

    ```javascript
    const publishSns = async (data, segment) => {
        return AWSXRay.captureAsyncFunc('## publishNewItemSNS', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Message Payload', msg)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```

1. Finally, modify the `handler` method to pass the subsegment to both `putItem()` and `publishSns()` methods.
   
    ```javascript
    const item = await putItem(event, subsegment)
    await publishSns(item, subsegment)
    ```

1. Save your changes to the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js*** file.

**Your entire file should look like the code below:**

{{% expand "Fully modified file (expand for code)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS();

exports.putItemHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        let response
        try {
            if (event.httpMethod !== 'POST') {
                throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
            }

            const item = await putItem(event, subsegment)
            await publishSns(item, subsegment)

            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(item)
            }
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'FAILED')
            response = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err)
            }
        } finally {
            subsegment.close()
        }
        return response
    }, AWSXRay.getSegment());
}

const putItem = async (event, segment) => {
    return AWSXRay.captureAsyncFunc('## putItemData', async (subsegment) => {
        let response
        try {
            const body = JSON.parse(event.body)
            const id = body.id
            const name = body.name

            var params = {
                TableName: process.env.SAMPLE_TABLE,
                Item: { id: id, name: name }
            }

            response = await docClient.put(params).promise()

            //Tracing
            subsegment.addMetadata('Item Payload', params)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}


const publishSns = async (data, segment) => {
    return AWSXRay.captureAsyncFunc('## publishNewItemSNS', async (subsegment) => {
        let response
        try {
            const msg = {
                TopicArn: process.env.TOPIC_NAME,
                Message: JSON.stringify({
                    operation: "notify_new_item",
                    details: {
                        //id: data.Attributes.id,
                        //name: data.Attributes.FullName ? data.Attributes.FullName : "N/A"
                        id: 1,
                        name: "N/A"
                    }
                }),
                MessageAttributes: {
                    "Status": { "DataType": "String", "StringValue": "Success" }
                }
            }

            response = await sns.publish(msg).promise()

            subsegment.addMetadata('Message Payload', msg)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}
```