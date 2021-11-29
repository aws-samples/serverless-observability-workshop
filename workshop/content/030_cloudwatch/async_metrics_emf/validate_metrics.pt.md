+++
title = "Validar métricas no console"
weight = 15
+++

### Validar saída EMF em CloudWatch Logs

1. Vá para o seu [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).
1. Em **Logs**, clique em **Log Groups**.
1. Marque a opção **Exact match** e digite o prefixo da sua pilha, **monitoring-app**, no seu caso.
1. Você deve ver todos os grupos de log disponíveis para nossas funções Lambda. 
1. Clique naquele que contém **GetAllItemsFunction** em seu nome.

    ![metrics-1](/images/log_producer_1.png)

1. Clique no Log Stream mais recente.

    ![metrics-2](/images/log_producer_2.png)

    Você deve ser capaz de ver algo como a tela de impressão abaixo contendo pelo menos três entradas de log: Duas para os objetos de contexto e evento, um log de erro provisório em caso de qualquer falha e um final referente ao resultado da execução da função.
 
1. Expanda e navegue pela carga útil gerada para cada entrada. Observe que os metadados adicionais que adicionamos em nossa biblioteca auxiliar estão presentes para cada entrada.

![emf-1](/images/emf-1.png)

### Validar métricas em CloudWatch Metrics

1. Vá para o seu [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).
1. Clique em **Metrics**.
1. Em **Custom Namespaces**, clique no namespace `MonitoringApp`.
1. Você deve ver novas dimensões de métricas: `LogGroup`, `ServiveName`, `ServiceType`, `function_name`.
1. Clique nele e selecione todas as métricas disponíveis.

    ![metrics-1](/images/emf_metrics_1.png?width=60pc)

1. Volte para o namespace `MonitoringApp`.
1. Você deve ver novas dimensões de métricas: `LogGroup`, `ServiveName`, `ServiceType`, `operation`.
1. Clique nele e selecione todas as métricas disponíveis.

    ![metrics-2](/images/emf_metrics_2.png?width=60pc)

1. Clique na aba **Graphed Metrics** e selecione todas as métricas disponíveis.
1. Valide as métricas que você acabou de selecionar.

![metrics-3](/images/emf_metrics_3.png?width=60pc)

