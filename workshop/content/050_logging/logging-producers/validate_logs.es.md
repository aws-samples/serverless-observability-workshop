+++
title = "Analizando (registros) Logs en la consola"
weight = 54
+++

Ir a la [Consola de CloudWatch](https://console.aws.amazon.com/cloudwatch/home).

1. Bajo **(Registros) Logs**, clic en **(Grupos de registro) Log Groups**.
1. Seleccion la casilla de verificación **(Coincidencia exacta) Exact match** , ane ingresa el prefijo de su Stack, **monitoring-app** en nuestro caso.
1. Deberías ver todos los grupos de registro disponibles para nuestras funciones de Lambda. 
1. Haz clic en aquel que contenga **GetAllItemsFunction** en su nombre.

    ![metrics-1](/images/log_producer_1.png)

1. Haz clic en el último (flujo de registro) Log Stream.

    ![metrics-2](/images/log_producer_2.png)

    Deberías poder ver algo como la siguiente captura de pantalla que contiene al menos tres entradas de registro: dos para los objetos de contexto y evento, un registro de errores tentativo en caso de fallos y uno final sobre el resultado de la ejecución de la función.
 
1. Expande y navega por (la carga útil) el payload generado para cada entrada. Observe que los metadatos adicionales que agregamos en nuestra librería auxiliar están presentes para cada entrada.

![metrics-3](/images/log_producer_3.png)

#### (Registros de API Gateway) API Gateway Logs

Además, asegúrate de investigar los registros generados al invocar nuestras API a través de API Gateway

![metrics-3](/images/log_producer_api.png)
