+++
title = "Explorar Métricas"
weight = 93
+++

### Visualización de múltiples funciones

Ir a la consola de [Lambda Insights](https://console.aws.amazon.com/cloudwatch/home?#lambda-insights:performance). 

Selecciona la opción de **Multi-Function** . Puedes seleccionar las funciones de Lambda que crea nuestra aplicación y ver sus métricas.

![Service Lens](/images/li_mf_1.png)

Estas métricas nos permiten entender que todas las funciones comenzaron con un tiempo de respuesta relativamente bajo y aumentaron drásticamente y también tuvieron su asignación de memoria al máximo durante toda la prueba. También puedes notar que aunque la duración de `gettembyIdFunction` y `getalItemsFunction` es muy alta, la duración de `putItemFunction` y `notifyNewItemFunction` fue constantemente baja y por debajo de un umbral aceptable, incluso con su consumo de memoria al máximo.

Por otro lado, aunque hemos experimentado una tasa de error más alta en las respuestas de API Gateway, como se muestra en la salida de Locust, Lambda no ha informado de un solo error en todas las funciones. Esto se debe a que estamos manejando nuestras excepciones dentro de nuestras funciones, por lo que se nos considera una ejecución exitosa.

Podríamos intentar asignar más memoria de 128 MB a 1 GB a nuestras funciones y ver qué sucede, pero ¿resolvería realmente nuestro problema teniendo en cuenta que la función  `putItemFunction` se ejecutó bien bajo la misma asignación de memoria?

![Service Lens](/images/li_mf_2.png)


Haz clic en la función **Monitoring-app-getAlItemsFunction** para analizarla.

### Visualización de única función

![Service Lens](/images/li_sf_1.png)

`Lambda Insights` está integrado con `ServiceLens`. Puede ver las trazas de `AWS X-Ray` haciendo clic en **View** como se muestra a continuación para una ejecución de función concreta que ha sido muestreada por AWS X-Ray. En caso de que haya pasado por el módulo de [Rastreo distribuido](../../../070_tracing), haz clic en uno de los Traces (trazas) disponibles para profundizar aún más.

![Service Lens](/images/li_sf_2.png)

### Ronda de bonificación

{{% notice warning %}}
Este paso requiere que pases por el módulo de [Rastreo distribuido](../../../070_tracing). En caso de que no lo hayas hecho, vale la pena leer el ejemplo.
{{% /notice %}}

#### ServiceLens y la integración con X-Ray

Al seleccionar un Trace (traza) específico del paso anterior, irá directamente a la consola de Service Map de ServiceLens para navegar por todos los nodos de seguimiento. Esto nos facilita entender que el problema está ocurriendo dentro de `Amazon DynamoDB`, lo que limita nuestra solicitud.

![Service Lens](/images/li_trace_1.png)

![Service Lens](/images/li_trace_2.png)

![Service Lens](/images/li_trace_3.png)

Ahora nos queda claro que el mayor infractor está dentro del diseño de nuestra tabla de DynamoDB. A medida que avanza la prueba de carga, estamos inundando nuestra tabla con elementos mientras seguimos realizando una operación de `Scan` en la misma tabla, lo que la convierte en una operación más compleja y costosa, ya que diseñamos nuestro código de aplicación y tabla siguiendo un enfoque ingenuo, sin  `Indexes` ni `Query Result Pagination`.

Ahora puedes comprender que simplemente aumentar la asignación de memoria a nuestras funciones de 128 MB a 1 GB (o incluso 3 GB) podría aportar una pequeña ventaja al principio, pero al final nos encontramos con la misma excepción `ProvisionedThroughputExceededException`, o que nos lleva a repensar la forma en que diseñamos nuestra tabla y obtenemos sus ítems.

Este es solo uno de los muchos ejemplos en los que no solo `Lambda Insights`, sino también la implementación de las `metricas de negocio y operacionales` y `distributed tracing (rastreo distribuido)` pueden realmente facilitar su trabajo durante las tareas de solución de problemas, ya sea por cuellos de botella de rendimiento o cualquier tipo de interrupción del servicio.