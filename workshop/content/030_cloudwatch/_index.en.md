+++
title = "CloudWatch Metrics, Alarms, and Dashboards"
chapter = true
weight = 30
+++

# CloudWatch Metrics, Alarms, and Dashboards

In this module, we are going to prepare our application to push custom business and operational metrics to CloudWatch, create alarms based on failure metrics to notify our SRE/SysOps engineers in case of any service disruption, and consolidate all these metrics in a single dashboard to ease monitoring tasks.

### Metrics

Metrics are data about the performance of your systems. By default, several services provide free metrics for resources (such as Amazon EC2 instances, Amazon EBS volumes, and Amazon RDS DB instances). You can also enable detailed monitoring for some resources, such as your Amazon EC2 instances, or publish your own application metrics. Amazon CloudWatch can load all the metrics in your account (both AWS resource metrics and application metrics that you provide) for search, graphing, and alarms.

Metric data is kept for 15 months, enabling you to view both up-to-the-minute data and historical data.

### Alarms

You can add alarms to CloudWatch dashboards and monitor them visually. When an alarm is on a dashboard, it turns red when it is in the ALARM state, making it easier for you to monitor its status proactively.

Alarms invoke actions for sustained state changes only. CloudWatch alarms don’t invoke actions simply because they are in a particular state, the state must have changed and been maintained for a specified number of periods.

### Dashboards

Amazon CloudWatch dashboards are customizable home pages in the CloudWatch console that you can use to monitor your resources in a single view, even those resources that are spread across different Regions. You can use CloudWatch dashboards to create customized views of the metrics and alarms for your AWS resources.

