---
title: "Async Metrics using Embedded Metrics Format (EMF)"
chapter: true
weight: 34
---

# Embedded Metric Format

As of November, 2019 - AWS released the `Embedded Metric Format (EMF)` to allow customers to natively generate custom metrics asynchronously in the form of logs written to CloudWatch Logs. In this module we will understand how EMF compares and differs from the approach we did in the previous module. We will use the `logMetricEMF` method provided in our utils lib. We are going to modify the GetAllItems Lambda function to understand this new behavior. 

The CloudWatch embedded metric format enables you to ingest complex high-cardinality application data in the form of logs and to generate actionable metrics from them. You can embed custom metrics alongside detailed log event data, and CloudWatch automatically extracts the custom metrics so that you can visualize and alarm on them, for real-time incident detection. Additionally, the detailed log events associated with the extracted metrics can be queried using CloudWatch Logs Insights to provide deep insights into the root causes of operational events.

Embedded metric format helps you to generate actionable custom metrics from ephemeral resources such as Lambda functions and containers. By using the embedded metric format to send logs from these ephemeral resources, you can now easily create custom metrics without having to instrument or maintain separate code, while gaining powerful analytical capabilities on your log data.

When using the embedded metric format, you can generate your logs using a client library. Alternatively, you can manually construct the logs and submit them using the `PutLogEvents` API or the CloudWatch agent.

{{% notice tip %}}
You can learn more on [Embedded Metric Format (EMF)](https://aws.amazon.com/about-aws/whats-new/2019/11/amazon-cloudwatch-launches-embedded-metric-format/) and how to [Use the Client Libraries to Generate Embedded Metric Format Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Libraries.html) going through our documentation.
{{% /notice %}}