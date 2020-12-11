+++
title = "Validate Metrics in the Console"
weight = 13
+++

Go to your [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).

1. Click **Metrics**.
1. On **Custom Namespaces**, select the `MonitoringApp` namespace.
1. You should see metrics by two different dimensions: `function_name, service` and `operation, service`.

    ![metrics-1](/images/metrics_sync_1.png?width=80pc)

1. Click the **function_name, service** dimension and select all metrics available.

    ![metrics-2](/images/metrics_sync_2.png?width=80pc)

1. Go back to the `MonitoringApp` namespace.
1. Click the **operation, service** dimension and select all metrics available.

    ![metrics-3](/images/metrics_sync_3.png?width=80pc)

1. Click the **Graphed Metrics** tab.
1. Set the **metrics exhibition type** to `Number`.
1. Set the **Statistic** aggregation to `Sum`.
1. Set the **Period** to `1 Day`.
1. Validate the metrics you just pushed.

![metrics-4](/images/metrics_sync_4.png?width=80pc)
