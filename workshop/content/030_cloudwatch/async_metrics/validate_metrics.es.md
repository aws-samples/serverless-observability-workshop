+++
title = "Validar métricas en la consola"
weight = 13
+++

Ir a la [Consola de CloudWatch](https://console.aws.amazon.com/cloudwatch/home).

1. Clic en **(Métricas) Metrics**.
1. En **(Espacio de nombres personalizados) Custom Namespaces**, clic en el espacio de nombres `MonitoringApp`.
1. Deberías ver la dimensión de métricas: `FunctionName, FunctionVersion, operation, service`.
1. Clic para seleccionar todas las métricas disponibles.

    ![metrics-1](/images/metrics_async_1.png?width=60pc)

1. Regresa a la consola de CloudWatch Metrics y seleccione el espacio de nombres de  `Lambda`

    ![metrics-2](/images/metrics_async_2.png?width=60pc)

1. Clic en la dimensión **FunctionName, FunctionVersion** y seleccione todas las métricas disponibles.
1. Filtrar la métrica por `monitoring-app` y seleccionar todas las métricas disponibles. 
1. Validar las métricas que has seleccionado junto con las métricas del paso anterior.

![metrics-3](/images/async_metrics_3.png?width=60pc)

