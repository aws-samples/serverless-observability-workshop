+++
title = "Create X-Ray Groups"
weight = 80
+++

Using a filter expression, you can define criteria by which to accept traces into the group.

You can call the group by name or by Amazon Resource Name (ARN) to generate its own service graph, trace summaries, and Amazon CloudWatch metrics. Once a group is created, incoming traces are checked against the group’s filter expression as they are stored in the X-Ray service. Metrics for the number of traces matching each criteria are published to CloudWatch every minute.

Updating a group’s filter expression doesn’t change data that’s already recorded. The update applies only to subsequent traces. This can result in a merged graph of the new and old expressions. To avoid this, delete the current group and create a fresh one.

### Create X-Ray Group

Go to [AWS XRay](https://console.aws.amazon.com/xray/home#service-map) and click on the **Default** drop down and select **Create group**.

![Service Lens](/images/xray_group.png)

In the new window, name the group **Higherlatency** and enter the following expression. This is a simple expression that filters only requests that exhibit more than 2 seconds response time.

```SQL
responsetime > 2
```

![Service Lens](/images/xray_group_11.png)

{{% notice tip %}}
You can also create filter expressions using the custom annotations we created in the previous step, for example, grouping all failed requests by using the filter expression: 
**Annotation.Status = "FAILED"**
{{% /notice %}}

Once created and selected, you will see that the Service Map changes to show only the services and routes that exhibit more than 2 seconds response time.

![Service Lens](/images/xray_group_1.png)

When a Group is created, X-Ray also publishes new metrics.

Go to AWS XRay namespace on [CloudWatch Metrics](https://console.aws.amazon.com/cloudwatch/home?#metricsV2:graph=~();namespace=~'AWS*2fX-Ray). Go to **Group Metrics**

You will see a new metric called **ApproximateTraceCount** created for the group **Higherlatency** which you just created.

![Service Lens](/images/xray_group_2.png)
