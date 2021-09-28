+++
title = "Analisar logs no console"
weight = 54
+++


Vá para o [Console CloudWatch](https://console.aws.amazon.com/cloudwatch/home).

1. Em **Logs**, clique em **Log Groups**.
1. Marque a caixa **Correspondência exata (Exact match)** e digite o prefixo de sua pilha, **monitoring-app** em nosso caso.
1. Você deve ver todos os grupos de log disponíveis para nossas funções Lambda.
1. Clique naquele que contém **GetAllItemsFunction** em seu nome.

    ![metrics-1](/images/log_producer_1.png)

1. Clique em no fluxo de log mais recente.

    ![metrics-2](/images/log_producer_2.png)

    Você deve ser capaz de ver algo como a tela abaixo, contendo pelo menos três entradas de log: Duas para os objetos de contexto e evento, um log de erro provisório em caso de qualquer falha e um final referente ao resultado da execução da função.

1. Expanda e navegue pela carga útil gerada para cada entrada. Observe que os metadados que adicionamos em nossa biblioteca estão presentes para cada entrada. 

![metrics-3](/images/log_producer_3.png)

#### Logs do API gateway

Além disso, certifique-se de analisar os logs gerados ao invocar nossas APIs via API Gateway

![metrics-3](/images/log_producer_api.png)
