+++
title = "API Canaries"
weight = 41
+++


Go to [Synthetics canary](https://console.aws.amazon.com/cloudwatch/home?#synthetics:canary/list) page, and click on **Create canary**.

![synthetics-1](/images/synthetics1.png)

### Creating an API Canary

1. Select **API canary** under **Blueprints**.
1. Name it **my-api-canary**.
1. Check the **I'm using an Amazon API Gateway API** checkbox.
1. Select the **Choose API and stage from API Gateway** option.
1. Select the **monitoring-app** API.
1. Select the **Prod** stage.

    Your API URL will be automatically selected.

    ![synthetics-2](/images/synthetics2.png)

1. Click on **Add HTTP Request**.
1. Select **/items** under **Resource**.
1. Select **GET** under **Method**.
1. Accept all other default configurations and click  **Save**.

    ![synthetics-timer](/images/synthetics_http_request.png)
    ![synthetics-timer](/images/synthetics_http_request_1.png)

1. On Schedule configure it to run every 1 minute.

    ![synthetics-timer](/images/synthetics_timer.png)

1. Accept all other default configurations and click **Create canary**.

{{% notice tip %}}
If you  didn't take a note of your API Url after deploying the sample app, you can always check for its CloudFormation Stack Output Variable of type the following command on your **Cloud9 environment terminal**.
{{% /notice %}}

```sh
echo $(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
```

After a few minutes, you should be presented with a similar screen to observe your canary status.

![synthetics-3](/images/synthetics3.png)

### Introducing Failures

Let's see: what happens if we accidentally break our API? Since we are monitoring the GET method for the `/items/` route, we are going to modify our ***get-all-items.js*** Lambda function in order to introduce a random exception to make our canary fail.

7. Switch back to your **Cloud9 environment** and open the file at ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js***. Modify the `getAllItemsHandler()` method by throwing a new error right after it's HTTP method validation:

```javascript
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
    }
    throw new Error('Sample exception introduction') // <- Sample exception throw 
```

8. Save your changes to the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js*** file.

**Your getAllItemsHandler() method should look like this:**
{{% expand "Fully modified method (expand for code)" %}}
```javascript
exports.getAllItemsHandler = async (event, context) => {
    let response
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }
        throw new Error('Sample exception introduction') // <- Sample exception throw 

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
{{% /expand  %}}


#### Deploy the application

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

#### Validate your Canary

After a few minutes you should be that your canary is now in a `Failed` state.
 
![synthetics-4](/images/synthetics4.png)

Click the **my-api-canary** link to view all additional information about your canary.

![synthetics-5](/images/synthetics5.png)

### Fixing the API Canary

#### Rebasing the application code

In order for us to be able to pass our canary tests again, we are going to switch back to your **Cloud9 environment** and open the file at ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** once again. 

9. We are now going to remove the error we just introduced by modifying the Lambda handler removing the `throw new Error()` command we introduced in the `getAllItemsHandler()` method:

```javascript
throw new Error('Sample exception introduction') // <- Remove exception throw 
```

10. Save your changes to the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js*** file.

**Your getAllItemsHandler() method should look like this:**
{{% expand "Fully modified method (expand for code)" %}}
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
{{% /expand  %}}

#### Deploy the application

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

#### Validate your Canary

After a few minutes you should notice that your canary is again in a `Passing` state.

![synthetics-6](/images/synthetics6.png)
