---
title: "Async Metrics using Embedded Metrics Format (EMF)"
chapter: true
weight: 34
---

In the previous exercise, we learned how to push metrics synchronously using the AWS SDK. However, that approach, for being synchronous, ends up consuming resources from our Lambda functions in terms of additional latency (around 60ms per service call) and memory consumption, which may lead to more expensive and slow executions. 

To overcome this overhead, we can adopt an asynchronous strategy to create these metrics. This strategy consists of printing the metrics in a structured or semi-structured format as logs to Amazon CloudWatch Logs and have a mechanism in background processing these entries based on a filter pattern that matches the same entry that was printed.  

# Embedded Metric Format

As of November, 2019 - AWS released the `Embedded Metric Format (EMF)` to allow customers to natively generate custom metrics asynchronously in the form of logs written to CloudWatch Logs. In this module we will understand how EMF compares and differs from the approach we did in the previous module. We will use the `logMetricEMF` method provided in our utils lib. We are going to modify the GetAllItems and GetItemById Lambda functions to understand this new behavior. 

The CloudWatch embedded metric format enables you to ingest complex high-cardinality application data in the form of logs and to generate actionable metrics from them. You can embed custom metrics alongside detailed log event data, and CloudWatch automatically extracts the custom metrics so that you can visualize and alarm on them, for real-time incident detection. Additionally, the detailed log events associated with the extracted metrics can be queried using CloudWatch Logs Insights to provide deep insights into the root causes of operational events.

Embedded metric format helps you to generate actionable custom metrics from ephemeral resources such as Lambda functions and containers. By using the embedded metric format to send logs from these ephemeral resources, you can now easily create custom metrics without having to instrument or maintain separate code, while gaining powerful analytical capabilities on your log data.

When using the embedded metric format, you can generate your logs using a client library. Alternatively, you can manually construct the logs and submit them using the `PutLogEvents` API or the CloudWatch agent.

{{% notice tip %}}
You can learn more on [Embedded Metric Format (EMF)](https://aws.amazon.com/about-aws/whats-new/2019/11/amazon-cloudwatch-launches-embedded-metric-format/) and how to [Use the Client Libraries to Generate Embedded Metric Format Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Libraries.html) going through our documentation.
{{% /notice %}}