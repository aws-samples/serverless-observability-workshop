+++
title = "Consultar (Registros) Logs"
weight = 61
+++

### Usando consultas de Logs Insights

Ir a la [consola de CloudWatch Logs Insights](https://console.aws.amazon.com/cloudwatch/home?#logsV2:logs-insights) y seleccionar el (grupo de registro) Log Group  `/aws/lambda/monitoring-app-getAllItemsFunction`. Recuerde que puede seleccionar más de un grupo de registros si es necesario. A partir de agosto de 2020, puede seleccionar hasta 20 (grupos de registros) Log Groups a la vez.

![metrics-1](/images/query_logs_1.png)

Como puedes ver, una consulta de muestra se coloca automáticamente en el campo de consulta.

Ahora simplemente haz clic en el botón **(Ejecutar la consulta) Run query**  para ejecutar los resultados de la consulta. Según lo esperado, verás los resultados de la consulta.

La consulta de ejemplo recupera los campos `@timestamp` y `@message` de los datos de registro, ordena por el campo de marca de tiempo en orden descendente y muestra los primeros 20 registros.

![metrics-1](/images/query_logs_2.png)

#### Consultando el (registro de accesos personalizado) Custom Logging Access de API Gateway

También puede cambiar su preferencia de grupo de registros al grupo de registros `/aws/apigateway/` para consultar los registros de acceso de nuestra API, manteniendo la misma instrucción de consulta.

![metrics-1](/images/query_logs_api.png)

{{% notice tip %}}
Aprenda más sobre la sintaxis y consultas de Logs Insights  [aquí](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
{{% /notice %}}


#### Listado simple con filtrado y ordenamiento 

Seleccione nuevamente el (grupo de registro) log group `/aws/lambda/monitoring-app-getAllItemsFunction`.

Ahora pega esta consulta en el campo de registro. La siguiente consulta aplica un filtro a los mensajes y recupera solo los registros que contienen la cadena `operation` en el evento de registro y muestra el resultado ordenado por el campo de marca de tiempo en orden descendente.

```sql
fields @timestamp, @message
| sort @timestamp desc
| limit 20
| filter @message like /operation/
```

![metrics-1](/images/query_logs_3.png)

#### Listado con agregación, ordenamiento y marcas de tiempo

Ahora pega esta consulta en el campo de registro. A continuación se muestra un resultado que contiene el número de mensajes capturados en un intervalo de 5 minutos.

```sql
fields @timestamp, @message
| stats count(@message) as number_of_events by bin(5m)
| filter @message like /operation/
| limit 20
```

![metrics-1](/images/query_logs_4.png)

También puedes visualizar los resultados haciendo clic en la pestaña `(Visualización) Visualization` en el área de resultados como se muestra a continuación.

![metrics-1](/images/query_logs_5.png)

Observa que también puede añadir la visualización a un `(Panel de CloudWatch) CloudWatch Dashboard`, exportar a csv, etc.

![metrics-1](/images/query_logs_6.png)

### Realizando consultas con AWS CLI

También puedes consultar los grupos de registros mediante la CLI de AWS. La consulta siguiente consulta los 10 registros principales de un grupo de registros durante un período de tiempo específico.

Asegúrate de sustituir el grupo de registros por el que tenga en su cuenta y cambie los valores de los parámetros de hora de inicio y finalización por los valores de época correctos. Puede calcular los valores temporales de época desde este sitio web público - https://www.epochconverter.com/

{{% notice tip %}}
Por razones de simplicidad, las marcas de tiempo que aparecen a continuación se establecen entre `24th Aug, 2020` y `24th Aug, 2022`.
{{% /notice %}}

```sh
export getAllItemsFunction=$(aws cloudformation describe-stack-resources --stack-name monitoring-app --output json | jq '.StackResources[] | select(.LogicalResourceId=="getAllItemsFunction") | .PhysicalResourceId' | sed -e 's/^"//'  -e 's/"$//')
aws logs start-query --log-group-name /aws/lambda/$getAllItemsFunction --start-time '1598288209' --end-time '1661364126' --query-string 'fields @message | limit 10'
```

La consulta anterior devolverá un queryId. Copia ese ID de consulta y reemplaza la cadena `<QUERY_ID>`. en el siguiente comando y ejecútalo para ver los resultados de los datos de registro.

```sh
aws logs get-query-results --query-id <QUERY_ID>
```
