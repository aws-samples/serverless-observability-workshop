+++
title = "Validate Metrics in the Console"
weight = 13
+++

Go to your [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).

- Click **Metrics**.
- On **Custom Namespaces**, click the **MonitoringApp** namespace.
- You should see a new metrics dimensions: **FunctionName, FunctionVersion, operation, service**.
- Click it and select all metrics available.

![metrics-1](/images/metrics_async_1.png?width=60pc)

- Go back to the CloudWatch Metrics console and select the **Lambda** namespace

![metrics-2](/images/metrics_async_2.png?width=60pc)

- Click the **FunctionName, FunctionVersion** dimension and select all metrics available.
- Filter your metric by **sam-app** and select all available metrics. 
- Validate the metrics you just selected together with the ones we selected in the previous step.

![metrics-3](/images/async_metrics_3.png?width=60pc)

