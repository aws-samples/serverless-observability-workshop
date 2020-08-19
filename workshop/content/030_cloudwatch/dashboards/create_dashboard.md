+++
title = "Create a Dashboard"
weight = 11
+++

To demonstrate ways you can automate and create flexible and reusable dashboards, we will be deploying a CDK template to create our dashboards based on the previously created metrics for our sample app.

### Deploy the CDK Dashboard Template

Go back to your Cloud9 environment and open a new terminal.

```sh
cd ~/environment/serverless-observability-workshop/code/cloudwatch-cdk
npm update
npm install -g aws-cdk typescript
npm install
cdk deploy -c stack_name=sam-app
```

{{% notice tip %}}
Spare a couple of minutes to understand how these two SAR apps are being deployed by examining the SAM Template on `serverless-observability-workshop/code/cloudwatch-cdk` file.
{{% /notice %}}

Go to your [CloudWatch Dashboard Console](https://console.aws.amazon.com/cloudwatch/home?#dashboards:).

![dashboard-1](/images/dashboard_1.png)

This CDK project creates two dashboards based on several widgets with different representations (Lines and Numbers) to demonstrate the different possibilities one can monitor its application health. 

One Operational Dashboard for SysOps-related metrics.

![dashboard-2](/images/dashboard_2.png)

And also a Business Dashboard for keeping up with business-related metrics.

![dashboard-3](/images/dashboard_3.png)

