+++
title = "Subsegmentos & Anotaciones"
weight = 74
+++

En los pasos anteriores, pudimos enriquecer aún más la observabilidad de nuestros servicios habilitando el `Active Tracing` en API Gateway y Lambda, y capturando las llamadas a los servicios de AWS mediante `AWS X-Ray SDK`. Pero, ¿qué pasaría si tuviéramos un escenario en el que una función de Lambda realizara varias llamadas a métodos que contenían su propia lógica empresarial y pudieran estar introduciendo una latencia innecesaria en nuestro tiempo de respuesta global? ¿Qué sucede si recibimos un error de un conjunto específico de usuarios o artículos que queríamos solucionar? ¿Cómo podríamos enriquecer nuestra aplicación para obtener aún más observabilidad en esos escenarios complejos?

AWS X-Ray SDK también le permite utilizar código de instrumentos para crear `(Subsegmentos) Subsegments` y añadir `(Anotaciones y metadatos) Annotations and Metadata` personalizados dentro de ellos. Estos subsegmentos aparecerán en la página «Detalles de seguimiento» y te permitirán capturar y ajustar el rendimiento de cada uno de tus métodos dentro de una función o biblioteca determinada. Las «anotaciones» se comportarán como uno de los atributos disponibles en los que se pueden filtrar sus trazas, para que puedas empezar a inyectar anotaciones empresariales y operativas que sean significativas para tus consultas, como `ITEM_ID`, `USER_ID`, `STATUS` y otras que luego te ayudarán a mejorar tus grupos de consultas.

{{% notice tip %}}
Puedes obtener más información sobre cómo aprovechar el SDK de AWS X-Ray para crear [(Subsegmentos) Subsegments](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-subsegments.html) y agregar [(Anotaciones y metadatos) Annotations and Metadata](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-segment.html) personalizados revisando la documentación.
{{% /notice %}}

Vamos a modificar las siguientes funciones de Lambda para añadir nuestros subsegmentos y anotaciones personalizados:

{{%children style="h4"%}}