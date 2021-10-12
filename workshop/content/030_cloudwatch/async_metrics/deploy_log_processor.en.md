+++
title = "Deploy the Log Processor"
weight = 11
+++

In order for us to handle our log entries in background we need two complimentary applications that we could either build ourselves or deploy from a SAR (Serverless Application Repository) already provided by a partner called Lumigo, which are responsible for auto-subscribing specific CloudWatch Log Groups to a certain Kinesis Stream, and another one that consumes data from this Stream, parses it and pushed to CloudWatch Metrics. These apps are called [SAR-Logging](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:374852340823:applications/auto-subscribe-log-group-to-arn) and [SAR-Async-Lambda-Metrics](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:374852340823:applications/async-custom-metrics).

{{% notice tip %}}
Spare a couple of minutes to understand how these two SAR apps are being deployed by examining the SAM Template on ***serverless-observability-workshop/code/log-processing/template.yaml*** file.
{{% /notice %}}

By inspecting the ***serverless-observability-workshop/code/log-processing/template.yaml*** file, you can understand the patterns that Amazon CloudWatch Logs will attempt to filter and route to this module.

```yaml
# Only captures Custom Metrics and INFO|WARN|ERROR log events; reduces cost and unnecessary noise
FilterPattern:  "?INFO ?ERROR ?WARN ?REPORT ?MONITORING"
```

Also, by inspecting the `logMetric()` and `buildStatsDMetricData()` methods at ***serverless-observability-workshop/code/sample-app/src/lib*** file, you can understand that the log structure that our metric entries will start with **MONITORING**, which will be filtered together with the **REPORT** log entry of every function execution to capture further operational data points.

### Deploy the Log Processing Utility

1. Go back to your Cloud9 environment and open a new terminal.

```sh
cd ~/environment/serverless-observability-workshop/code/log-processing
sam deploy -g
```

2. Enter the following settings when prompted:

```sh
        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [sam-app]: log-processing
        AWS Region [us-east-1]: 
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: Y
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: Y
        Save arguments to samconfig.toml [Y/n]: Y 
```

3. Wait a few minutes until the changeset is created and then **CANCEL** its deployment.

```sh 

Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy1597269838/0752490d-33a9-4995-ae17-4ccca3efbf5d


Previewing CloudFormation changeset before deployment
======================================================
Deploy this changeset? [y/N]: N
```

4. Edit the ***serverless-observability-workshop/code/log-processing/samconfig.toml*** file and modify the `capabilities` parameter to give additional permissions to CloudFormation deploy resources on your behalf:

```sh
capabilities = "CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND"
```

5. Save it and run the `sam deploy` command once again **without** the **-g** option. **Confirm** the deployment and wait a few minutes until it completes.

```sh
cd ~/environment/serverless-observability-workshop/code/log-processing
sam deploy
```

```sh 

Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy1597269838/0752490d-33a9-4995-ae17-4ccca3efbf5d


Previewing CloudFormation changeset before deployment
======================================================
Deploy this changeset? [y/N]: Y
```
