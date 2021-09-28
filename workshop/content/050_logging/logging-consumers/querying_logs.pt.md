+++
title = "Consultando os Logs"
weight = 61
+++

### Usando as consultas de Logs Insights

Vá para o [Console do CloudWatch Logs Insights](https://console.aws.amazon.com/cloudwatch/home?#logsV2:logs-insights) e selecione o grupo de log `/aws/lambda/monitoring-app-getAllItemsFunction`. Lembre-se de que você pode selecionar mais de um grupo de log, se necessário. A partir de agosto de 2020, você pode selecionar até 20 grupos de log por vez.

![metrics-1](/images/query_logs_1.png)

Como você pode ver, um exemplo de consulta é automaticamente colocado no campo de consulta.

Agora, basta clicar no botão **Executar consulta (Run quer)** para executar os resultados da consulta. Como esperado, você verá os resultados da consulta.

A consulta de amostra busca os campos `@timestamp` e` @message` dos dados de log, ordena pelo campo de timestamp em ordem decrescente e exibe os primeiros 20 registros.

![metrics-1](/images/query_logs_2.png)

#### Consultando logs de acesso personalizado do API Gateway

Você também pode mudar sua preferência de grupo de log para o grupo de log `/aws/apigateway/` para consultar os logs de acesso de nossa API, enquanto mantém a mesma instrução de consulta

![metrics-1](/images/query_logs_api.png)

{{% notice tip %}}
Saiba mais sobre a sintaxe e as consultas no Logs Insights [aqui] (https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
{{% /notice %}}


#### Lista simples com filtro e classificação

Selecione mais uma vez o grupo de log `/aws/lambda/monitoring-app-getAllItemsFunction`.

Agora cole esta consulta no campo de log. A consulta a seguir aplica um filtro nas mensagens e busca apenas os registros que contêm a string `operação` no evento de registro e exibe o resultado ordenado pelo campo de carimbo de data / hora em ordem decrescente

```sql
fields @timestamp, @message
| sort @timestamp desc
| limit 20
| filter @message like /operation/
```

![metrics-1](/images/query_logs_3.png)

#### Lista com agregação, classificação e série temporal

Agora cole esta consulta no campo de log. A seguinte imagem mostra um resultado que contém o número de mensagens capturadas em um intervalo de 5 minutos

```sql
fields @timestamp, @message
| stats count(@message) as number_of_events by bin(5m)
| filter @message like /operation/
| limit 20
```

![metrics-1](/images/query_logs_4.png)

Você também pode visualizar os resultados clicando na guia `Visualização` na área de resultados conforme mostrado abaixo.

![metrics-1](/images/query_logs_5.png)

Observe que você também pode adicionar a visualização a um `CloudWatch Dashboard`, exportar para csv e assim por diante.

![metrics-1](/images/query_logs_6.png)

### Consultando usando AWS CLI

Você também pode consultar os grupos de log usando o AWS CLI. A consulta a seguir mostra os 10 principais registros de um grupo de registros para um período de tempo específico.

Certifique-se de substituir o grupo de log apropriado que você tem em sua conta e alterar os valores dos parâmetros de tempo de início e término para os valores de tempo de época (epoch) corretos. Você pode calcular os valores de tempo de época (epoch) neste site público - https://www.epochconverter.com/

{{% notice tip %}}
Por razões de simplicidade, os carimbos (timestamps) de data / hora abaixo são definidos entre `24 de agosto de 2020` e` 24 de agosto de 2022`.
{{% /notice %}}

```sh
export getAllItemsFunction=$(aws cloudformation describe-stack-resources --stack-name monitoring-app --output json | jq '.StackResources[] | select(.LogicalResourceId=="getAllItemsFunction") | .PhysicalResourceId' | sed -e 's/^"//'  -e 's/"$//')
aws logs start-query --log-group-name /aws/lambda/$getAllItemsFunction --start-time '1598288209' --end-time '1661364126' --query-string 'fields @message | limit 10'
```

A consulta acima retornará um queryId. Copie esse ID de consulta e substitua a string `<QUERY_ID>` no comando abaixo e execute-o para ver os resultados dos dados de registro.

```sh
aws logs get-query-results --query-id <QUERY_ID>
```
