---
title: "Delete CloudFormation Stacks"
chapter: false
weight: 71
---

#### Delete the stack for our sample application

```sh
aws cloudformation delete-stack --stack-name monitoring-app
```

#### Delete the stack for log processing

If you completed the `CloudWatch Metrics, Alarms, and Dashboards > Pushing Metrics Asynchronously` module:

```sh
aws cloudformation delete-stack --stack-name log-processing
```

#### Delete the stack for distributed tracing

If you completed the `Distributed Tracing` module:

```sh
aws cloudformation delete-stack --stack-name monitoring-app-tracing
```

#### Delete the stack for the CDK-based CW Metrics Dashboard

If you completed the `CloudWatch Metrics, Alarms, and Dashboards > Creating Dashboards` module:

```sh
aws cloudformation delete-stack --stack-name CloudwatchCdkStack
```

Make sure to refresh until your stacks are deleted to move forward.