![Build](https://github.com/enr1c091/serverless-observability-workshop/workflows/Build/badge.svg)

# AWS Serverless Observability Workshop 

This workshop can be found at **TBA**

## Done:

- [x] ~~Write the Logger lib for Custom Logging and Metrics.~~
- [x] ~~Implement extensible Metric method for reusability across multiple apps.~~
- [x] ~~Add Business and ColdStart CloudWatch Custom Metrics.~~
- [x] ~~Add X-Ray Annotations and Metadata for method calls.~~
- [x] ~~Demonstrate how to inject X-Ray Subsegments to orchestrate method calls.~~
- [x] ~~Enable Debug toggle on SAM Template.~~
- [x] ~~Create X-Ray Group for querying failed events by annotations.~~
- [x] ~~Better document helper classes.~~
- [X] ~~Add Metric to capture Cold Start duration to report Avg time on CW Dashboards.~~
- [X] ~~Create Log Subscription to asyncronously create CW Metrics.~~
- [X] ~~Properly chain method calls inside X-Ray Subsegments.~~
- [X] ~~Enable API Gateway Custom Access Logs.~~
- [X] ~~Create CDK project to create CloudWatch Dashboard with Operational/Business metrics from Lambda.~~
- [X] ~~Add Parameters for creating the CDK CW Dashboard stack.~~

## TO-DO:

- [ ] Create CDK project to provision ES (Advanced Module in workshop).
- [ ] Create Log Subscription to push logs to ES.
- [ ] Create Kibana Visualization / Dashboards for import/export.
- [ ] Create Decorators for Tracing methods using X-Ray in a Tracing Lib.
- [ ] Transform the Tracing/Logging Lib into a Layer for extended reusability (Maybe not needed for the workshop).
