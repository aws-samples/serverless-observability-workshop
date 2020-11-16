+++
title = "API Gateway Custom Access Logging"
weight = 51
+++

To help us enhance our logging capabilites and also understand the patterns our APIs are invoked, Amazon API Gateway provides a feature called `Custom Access Logs` which allow us to specify and log attributes to CloudWatch Logs from a wide range of available fields for each request made to our APIs.

{{% notice tip %}}
Learn more about [Custom Access Logs](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html) and the available [access logging variables](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference) from our Documentation.
{{% /notice %}}

### Update the SAM Template

In order to enable logging in our API, we must alter our SAM Template file at ***serverless-observability-workshop/code/sample-app/template.yaml*** to add our desired logging pattern as well as the required resources to support it, which consist of an IAM Role with the proper permissions to enable API Gateway to push logs to CloudWatch Logs, and enabling this feature to API Gateway itself.

1. Edit the ***serverless-observability-workshop/code/sample-app/template.yaml*** file the resource declaration of your API Gateway stage and update by enabling `AccessLogSetting` to the `API Gateway` resource and also creating an `IAM Role` granting permission to push logs to CloudWatch Logs and attaching this role to your `API Gateway` resource:

  ```yaml
  Resources:
  # API Gateway
    Api:
      Type: AWS::Serverless::Api
      DependsOn: ApiCWLRoleArn
      Properties:
        StageName: Prod
        AccessLogSetting:
          DestinationArn: !Sub ${ApiAccessLogGroup.Arn} # This Log Group is already created within our SAM Template
          Format: "{ 'requestId':'$context.requestId', 'ip': '$context.identity.sourceIp', 'caller':'$context.identity.caller', 'user':'$context.identity.user','requestTime':'$context.requestTime', 'xrayTraceId':'$context.xrayTraceId', 'wafResponseCode':'$context.wafResponseCode', 'httpMethod':'$context.httpMethod','resourcePath':'$context.resourcePath', 'status':'$context.status','protocol':'$context.protocol', 'responseLength':'$context.responseLength' }"
        MethodSettings:
          - MetricsEnabled: True
            ResourcePath: '/*'
            HttpMethod: '*'

    ApiCWLRoleArn:
      Type: AWS::ApiGateway::Account
      Properties: 
        CloudWatchRoleArn: !GetAtt CloudWatchRole.Arn

  # IAM Role for API GW + CWL
    CloudWatchRole:
        Type: AWS::IAM::Role
        Properties:
          AssumeRolePolicyDocument:
            Version: '2012-10-17'
            Statement:
              Action: 'sts:AssumeRole'
              Effect: Allow
              Principal:
                Service: apigateway.amazonaws.com
          Path: /
          ManagedPolicyArns:
            - 'arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
        
  ```

2. Save the modofications to the ***serverless-observability-workshop/code/sample-app/template.yaml*** file. 
