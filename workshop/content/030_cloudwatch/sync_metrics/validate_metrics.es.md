+++
title = "Validar métricas en la consola"
weight = 13
+++

Ir a la [Consola de CloudWatch](https://console.aws.amazon.com/cloudwatch/home).

1. Clic en **(Métricas) Metrics**.
1. En **(Espacio de nombres personalizados) Custom Namespaces**, seleccionar el espacio de nombres `MonitoringApp`.
1. Deberías ver la dimensión de métricas: `function_name, service` and `operation, service`.

    ![metrics-1](/images/metrics_sync_1.png?width=80pc)

1. Clic en la dimensión **function_name, service** y seleccionar todas las métricas disponibles.

    ![metrics-2](/images/metrics_sync_2.png?width=80pc)

1. Regresar al espacio de nombres de `MonitoringApp`.
1. Clic en la dimensión **operation, service** y seleccionar todas las métricas disponibles.

    ![metrics-3](/images/metrics_sync_3.png?width=80pc)

1. Clic en la pestaña  ** (Métricas diagramadas) Graphed Metrics**.
1. Seleccionar **(Tipo de métricas exhibidas) metrics exhibition type** a `Number`.
1. Seleccionar **(Estadística) Statistic** de agregación a `Sum`.
1. Seleccionar **(Periodo) Period** en `1 Day`.
1. Validar las métricas enviadas.

![metrics-4](/images/metrics_sync_4.png?width=80pc)
