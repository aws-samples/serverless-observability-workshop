+++
title = "Validar métricas en la consola"
weight = 15
+++

### Validar la salida de EMF en CloudWatch Logs

1. Ir a la [Consola de CloudWatch](https://console.aws.amazon.com/cloudwatch/home).
1. Bajo el grupo **(Registros) Logs**, clic en **(Grupos de registros) Log Groups**.
1. Da clic en la casilla de verificación **(Coincidencia exacta) Exact match** , e  ingresa el prefijo del stack, **monitoring-app** en nuestro caso.
1. Deberías ver todos los grupos de registros disponibles para nuestras funciones de Lambda. 
1. Clic en el grupo de que contiene **GetAllItemsFunction** en el nombre.

    ![metrics-1](/images/log_producer_1.png)

1. Clic en el último (Flujo de registro) Log Stream.

    ![metrics-2](/images/log_producer_2.png)

    Deberías poder ver algo similar a la captura de pantalla que aparece a continuación, que contiene al menos tres entradas de registro: dos para los objetos de contexto y evento, un registro de errores tentativo en caso de fallos y uno final sobre el resultado de la ejecución de la función.
 
1. Expande y navegue por la carga útil generada para cada entrada. Observa que los metadatos adicionales que agregamos en nuestra librería auxiliar están presentes para cada entrada.

![emf-1](/images/emf-1.png)

### Validar métricas en CloudWatch Metrics

1. Ir a la [Consola de CloudWatch](https://console.aws.amazon.com/cloudwatch/home).
1. Clic en **(Métricas) Metrics**.
1. En **(Espacio de nombres personalizados) Custom Namespaces**, clic en el espacio de nombres `MonitoringApp`.
1. Deberías ver la dimensión de métricas: `LogGroup`, `ServiceName`, `ServiceType`, `function_name`.
1. Clic para seleccionar todas las métricas disponibles.

    ![metrics-1](/images/emf_metrics_1.png?width=60pc)

1. Regresar al espacio de nombres de `MonitoringApp`.
1. Deberías ver la dimensión de métricas: `LogGroup`, `ServiceName`, `ServiceType`, `operation`.
1. Clic para seleccionar todas las métricas disponibles.

    ![metrics-2](/images/emf_metrics_2.png?width=60pc)

1. Clic en la pestaña **(Métricas diagramadas) Graphed Metrics** y selecciona todas las métricas disponibles.
1. Valida las métricas que acabas de seleccionar.

![metrics-3](/images/emf_metrics_3.png?width=60pc)

