+++
title = "Enabling Lambda Insights"
weight = 91
+++

`Amazon CloudWatch Lambda Insights` CloudWatch Lambda Insights is a monitoring and troubleshooting solution for serverless applications running on AWS Lambda. The solution collects, aggregates, and summarizes system-level metrics including CPU time, memory, disk, and network. It also collects, aggregates, and summarizes diagnostic information such as cold starts and Lambda worker shutdowns to help you isolate issues with your Lambda functions and resolve them quickly.

{{% notice tip %}}
Learn more about [Amazon CloudWatch Lambda Insights](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-insights.html) from our documentation.
{{% /notice %}}


### Modify the application

Go back you your **Cloud9** environment and open your app workspace at ***serverless-observability-workshop/code/sample-app***.

We are going to edit the ***serverless-observability-workshop/code/sample-app/template.yaml*** file to include the `Lambda Layer` containing the `Lambda Insights Extension` for all `Lambda` functions present in our template. Open the your YAML template and locate the Global section. Add the `Layers` attribute for Lambda and specify the desired version of your extension.

```yaml
Globals:
  Function:
    Runtime: nodejs12.x
    Timeout: 100
    MemorySize: 128
    CodeUri: ./
    Environment:
      Variables:
        APP_NAME: !Ref SampleTable
        SAMPLE_TABLE: !Ref SampleTable
        SERVICE_NAME: item_service
        ENABLE_DEBUG: false
        # Enable usage of KeepAlive to reduce overhead of short-lived actions, like DynamoDB queries
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1
    Layers:                                                                                 # <----- ADD FOR LAMBDA INSIGHTS
      - !Sub "arn:aws:lambda:${AWS::Region}:580247275435:layer:LambdaInsightsExtension:14"  # <----- ADD FOR LAMBDA INSIGHTS
```

Save your changes to the ***serverless-observability-workshop/code/sample-app/template.yaml*** file.

{{% notice tip %}}
Learn more about [all available Lambda Insights Extensions versions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html) from our documentation.
{{% /notice %}}

### Deploy your application

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Validate the feature enablement

In order to make sure Lambda Insights is properly setup, go to [AWS Lambda](https://console.aws.amazon.com/lambda/home?#functions?f0=true&n0=false&op=and&v0=monitoring) service console. 

Click **your-function** > **Configuration** > **Monitoring tools** and make sure `Enhanced Monitoring` is enabled.

![Lambda Insights](/images/li_1.png)

