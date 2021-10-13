+++
title = "Validar métricas no console"
weight = 13
+++

Vá para o seu [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).

1. Clique em **Metrics**.
1. Em **Custom Namespaces**, clique no namespace `MonitoringApp`.
1. Você deve ver novas dimensões de métricas: `FunctionName, FunctionVersion, operation, service`.
1. Clique nele e selecione todas as métricas disponíveis.

    ![metrics-1](/images/metrics_async_1.png?width=60pc)

1. Volte para o console do CloudWatch Metrics e selecione o namespace `Lambda`

    ![metrics-2](/images/metrics_async_2.png?width=60pc)

1. Clique nas dimensões **FunctionName, FunctionVersion** e selecione todas as métricas disponíveis.
1. Filtre sua métrica por `monitoring-app` e selecione todas as métricas disponíveis. 
1. Valide as métricas que você acabou de selecionar junto com as que selecionamos na etapa anterior.

![metrics-3](/images/async_metrics_3.png?width=60pc)

