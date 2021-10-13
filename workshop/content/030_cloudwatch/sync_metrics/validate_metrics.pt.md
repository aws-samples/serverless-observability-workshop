+++
title = "Validar métricas no console"
weight = 13
+++

Vá para o seu [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).

1. Clique em **Metrics**.
1. Em **Custom Namespaces**, selecione o `MonitoringApp` namespace.
1. Você deve ver as métricas por duas dimensões diferentes: `function_name, service` and `operation, service`.

    ![metrics-1](/images/metrics_sync_1.png?width=80pc)

1. Clique na dimensão **function_name, service** e selecione todas as métricas disponíveis.

    ![metrics-2](/images/metrics_sync_2.png?width=80pc)

1. Volte para o `MonitoringApp` namespace.
1. Clique na dimensão **operation, service** e selecione todas as métricas disponíveis.

    ![metrics-3](/images/metrics_sync_3.png?width=80pc)

1. Clique na aba **Graphed Metrics**.
1. Configure o campo **metrics exhibition type** para `Number`.
1. Configure a agregação **Statistic** para `Sum`.
1. Configure o **Period** para `1 Day`.
1. Valide as métricas que você acabou de enviar.

![metrics-4](/images/metrics_sync_4.png?width=80pc)
