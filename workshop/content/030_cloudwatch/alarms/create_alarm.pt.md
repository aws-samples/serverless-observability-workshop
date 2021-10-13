+++
title = "Criar um alarme de métrica"
weight = 11
+++

Um alarme de métrica observa uma única métrica do CloudWatch ou o resultado de uma expressão matemática com base nas métricas do CloudWatch. O alarme executa uma ou mais ações com base no valor da métrica ou expressão relativa a um limite ao longo de vários períodos de tempo. A ação pode ser uma ação do Amazon EC2, uma ação do Amazon EC2 Auto Scaling ou uma notificação enviada a um tópico do Amazon SNS.

### Criação de um alarme de métrica

Vá para seu [CloudWatch Alarms Console](https://console.aws.amazon.com/cloudwatch/home?#alarmsV2:).

1. Clique em **Create Alarm**.
1. Clique em **Select Metric**.
1. Isso o levará à página inicial do Metrics, onde verá todos os namespaces disponíveis na conta. Selecione o namespace `MonitoringApp`

![alarm-1](/images/alarm_1.png?width=60pc)

4. Selecione `FunctionName, FunctionVersion, operation, service` dimensão e selecione a métrica `SuccessfulGetItem` que criamos no exercício anterior.

![alarm-2](/images/alarm_2.png?width=60pc)
![alarm-3](/images/alarm_3.png?width=60pc)

5. Insira o valor limite (**por exemplo, 1**) que deseja que os dados métricos sejam monitorados. Observe que a opção **Static** é selecionada por padrão, o que significa que definiremos um valor estático como o limite a ser monitorado.

6. Expanda **Additional configuration** onde você pode indicar quantas ocorrências da violação qualificam para o alarme a ser acionado. Defina os valores como 1 de 5, o que fará com que o alarme seja acionado se houver 1 violação em 5 períodos de avaliação. Observe a mensagem no topo do gráfico que descreve a configuração como **This alarm will trigger when the blue line goes above the red line for 1 datapoints within 25 minutes.**

7. Clique em **Next**.

8. Na figura **Configure actions**, você pode definir a ação que deseja tomar quando o alarme muda para diferentes estados, como

    - `In alarm`
    - `OK`
    - `Insufficient data`

As opções disponíveis para ações incluem, - `Send a notification to an SNS topic` - `Take an Auto scaling action` - `EC2 action` se a métrica é de uma instância EC2

9. Selecione **Create a new topic** para criar um novo tópico SNS para enviar a notificação e fornecer seu endereço de e-mail.

![alarm-4](/images/alarm_4.png?width=50pc)

10. Nomeie como `my_observability_topic`, preencha o `e-mail address` e clique em **Create topic**.
11. Clique em **Next**.
12. Nomeie como `My Observability Alarm`.
13. Clique em **Next**.

![alarm-4](/images/alarm_name.png?width=50pc)

14. Revise suas configurações e clique em **Create alarm**.
15. Abra sua caixa de entrada de e-mail e confirme sua inscrição no tópico SNS 
![alarm-4](/images/alarm_confirm.png?width=50pc)


{{% notice warning %}}
Se você não confirmar sua assinatura de e-mail, não receberá nenhum e-mail de notificação para alarmes disparados. **Lembre-se sempre de verificar também sua pasta de spam**.
{{% /notice %}}