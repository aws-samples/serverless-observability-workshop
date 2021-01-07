---
title: "Pushing Metrics Asynchronously"
chapter: true
weight: 33
---

# Pushing Metrics Asynchronously

In the previous exercise, we learned how to push metrics synchronously using the AWS SDK. However, that approach, for being synchronous, ends up consuming resources from our Lambda functions in terms of additional latency (around 60ms per service call) and memory consumption, which may lead to more expensive and slow executions. 

To overcome this overhead, we can adopt an asynchronous strategy to create these metrics. This strategy consists of printing the metrics in a structured or semi-structured format as logs to Amazon CloudWatch Logs and have a mechanism in background processing these entries based on a filter pattern that matches the same entry that was printed.  

To understand how to push metrics asynchronously we will use the `logMetric` method provided in our utils lib. We are going to modify the GetItemById Lambda function to understand this new behavior.
