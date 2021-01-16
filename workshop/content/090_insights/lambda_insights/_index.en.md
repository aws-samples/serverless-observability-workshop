+++
title = "Lambda Insights"
chapter = true
weight = 91
+++

# Lambda Insights

CloudWatch Lambda Insights is a monitoring and troubleshooting solution for serverless applications running on AWS Lambda. The solution collects, aggregates, and summarizes system-level metrics including CPU time, memory, disk, and network. It also collects, aggregates, and summarizes diagnostic information such as cold starts and Lambda worker shutdowns to help you isolate issues with your Lambda functions and resolve them quickly.

Lambda Insights uses a new CloudWatch Lambda extension, which is provided as a Lambda layer. When you install this extension on a Lambda function, it collects system-level metrics and emits a single performance log event for every invocation of that Lambda function. CloudWatch uses embedded metric formatting to extract metrics from the log events. For more information about Lambda extensions, see [Using AWS Lambda extensions](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-extensions-in-preview/?nc1=b_rp). For more information about embedded metric format, see [Ingesting High-Cardinality Logs and Generating Metrics with CloudWatch Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html).

# Important

Although this module is designed to be completely independent without depending on the previous module completion, it is highly recommended to implement the features from the [Distributed Tracing](../../070_tracing).
