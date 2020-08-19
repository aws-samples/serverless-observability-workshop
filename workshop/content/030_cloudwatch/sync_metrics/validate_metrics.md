+++
title = "Validate Metrics in the Console"
weight = 13
+++

Go to your [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).

- Click **Metrics**.
- On **Custom Namespaces**, click the **MonitoringApp** namespace.
- You should see metrics by two different dimensions: **function_name, service** and **operation, service**.

![metrics-1](/images/metrics_sync_1.png?width=60pc)

- Click the **function_name, service** dimension and select all metrics available.

![metrics-2](/images/metrics_sync_2.png?width=60pc)

- Go back to the **MonitoringApp** namespace
- Click the **operation, service** dimension and select all metrics available.

![metrics-3](/images/metrics_sync_3.png?width=60pc)

- Click the **Graphed Metrics** tab.
- Set the metrics exhibition type to **Number**.
- Set the Statistic aggregation to **Sum**.
- Set the Period to **1 Day**.
- Validate the metrics you just pushed.

![metrics-4](/images/metrics_sync_4.png?width=60pc)
