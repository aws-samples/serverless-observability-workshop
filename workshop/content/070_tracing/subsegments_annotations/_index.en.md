+++
title = "Subsegments & Annotations"
weight = 74
+++

In the previous steps, we were able to further enrich our service observability by enable `Active Tracing` to API Gateway and Lambda, and by capturing AWS Service calls using `AWS X-Ray SDK`. But what would happen if we had a scenario in which one Lambda function performed multiple method calls that contained its own business logic and could be introducing unnecessary latency to our overall response time? What if we received an error for a specific set of users or items that we wanted to troubleshoot? How could we enrich our application to gain even more observability for those complex scenarios?

AWS X-Ray SDK also allows you to instrument code in order to create `Subsegments` and add custom `Annotations and Metadata` inside them. These subsegments will then appear in the `Trace details` page and will allow you to capture and fine-tune the performance of each of your methods inside a given function or library. `Annotations` will behave like one of the available attributes one can filter their traces, so you can start injecting business and operational annotations that are meaningful to your queries, like `ITEM_ID`, `USER_ID`, `STATUS`, and others that will later help you to enhance your query groups.  

{{% notice tip %}}
You can learn more on how to leverage the AWS X-Ray SDK to create [Subsegments](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-subsegments.html) and add custom [Annotations and Metadada](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-segment.html) going through our documentation.
{{% /notice %}}

We are going to modify the following Lambda functions to add our custom subsgments and annotations:

{{%children style="h4"%}}