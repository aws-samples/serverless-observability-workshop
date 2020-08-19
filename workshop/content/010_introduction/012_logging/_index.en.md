+++
title = "Logging"
weight = 12
description = "Centralized logging allows one to store all logs in a single location and in a standardized format, simplifying log analysis and correlation tasks."
+++

Centralized logging provides two important benefits. First, it places all of your log records in a single location and in a standardized format, greatly simplifying log analysis and correlation tasks. Second, it provides you with a secure storage area for your log data. In the event that a machine on your network becomes compromised, the intruder will not be able to tamper with the logs stored in the central log repository -- unless that machine is also compromised. Once you establish a central log repository, the next step is to introduce centralized analysis techniques. 

CloudWatch Logs Insights enables you to interactively search and analyze your log data in Amazon CloudWatch Logs. You can perform queries to help you more efficiently and effectively respond to operational issues. If an issue occurs, you can use CloudWatch Logs Insights to identify potential causes and validate deployed fixes.

CloudWatch Logs Insights includes a purpose-built query language with a few simple but powerful commands. CloudWatch Logs Insights provides sample queries, command descriptions, query autocompletion, and log field discovery to help you get started. Sample queries are included for several types of AWS service logs.

CloudWatch Logs Insights automatically discovers fields in logs from AWS services such as Amazon Route 53, AWS Lambda, AWS CloudTrail, and Amazon VPC, and any application or custom log that emits log events as JSON.

You can use CloudWatch Logs Insights to search log data that was sent to CloudWatch Logs on November 5, 2018 or later.

A single request can query up to 20 log groups. Queries time out after 15 minutes, if they have not completed. Query results are available for 7 days.

You can save queries that you have created. This can help you run complex queries when you need, without having to re-create them each time that you want to run them.

Click [here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) to learn more about how to use CloudWatch Logs Insights.
