+++
title = "Deploy & Validate Metrics in the Console"
weight = 15
+++

### Deploy the application

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Export the stack output variables

To invoke our API's, we first need to fetch the `ApiUrl` output variable that our CloudFormation stack gives us. So let us iterate through our stack and export all output variables as environment variables:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Test the `Get Item By ID` operation

```sh
curl -X GET $ApiUrl/items/1 | jq
```

### Test the `Get All Items` operation

```sh
curl -X GET $ApiUrl/items/ | jq
```

### Validate EMF Output in CloudWatch Logs

1. Go to your [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).
1. Under **Logs**, click **Log Groups**.
1. Check the **Exact match** box, and type the prefix of your Stack, **monitoring-app** in our case.
1. You should see all available Log Groups for our Lambda functions. 
1. Click in the one that contains **GetAllItemsFunction** on its name.

    ![metrics-1](/images/log_producer_1.png)

1. Click in the latest Log Stream.

    ![metrics-2](/images/log_producer_2.png)

    You should be able to  see something like the print screen below containing at least three log entries: Two for the context and event objects, a tentative error log in case of any failures, and a final one regarding the result of the function execution.
 
1. Expand and navigate through the payload generated for each entry. Notice that the additional metadata that we added in our helper lib are present for each entry.

![emf-1](/images/emf-1.png)

### Validate Metrics in CloudWatch Metrics

1. Go to your [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).
1. Click **Metrics**.
1. On **Custom Namespaces**, click the `MonitoringApp` namespace.
1. You should see a new metrics dimensions: `LogGroup`, `ServiceName`, `ServiceType`, `function_name`.
1. Click it and select all metrics available.

    ![metrics-1](/images/emf_metrics_1.png?width=60pc)

1. Go back to the `MonitoringApp` namespace.
1. You should see another new metrics dimensions: `LogGroup`, `ServiceName`, `ServiceType`, `operation`.
1. Click it and select all metrics available.

    ![metrics-2](/images/emf_metrics_2.png?width=60pc)

1. Click the **Graphed Metrics** tab and select all metrics available.
1. Validate the metrics you just selected.

![metrics-3](/images/emf_metrics_3.png?width=60pc)

