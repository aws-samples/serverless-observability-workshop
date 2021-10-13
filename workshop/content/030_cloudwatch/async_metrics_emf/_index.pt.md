---
title: "Métricas assíncronas usando formato de métricas incorporado (EMF)"
chapter: true
weight: 34
---

# Formato métrico incorporado

Em novembro de 2019 - AWS lançou o `Embedded Metric Format (EMF)` para permitir aos clientes gerar nativamente métricas personalizadas de forma assíncrona na forma de logs gravados em CloudWatch Logs. Neste módulo, entenderemos como o EMF se compara e difere da abordagem que fizemos no módulo anterior. Usaremos o método `logMetricEMF` fornecido em nossa biblioteca de utilitários. Vamos modificar a função GetAllItems Lambda para entender esse novo comportamento.

O formato de métrica integrado do CloudWatch permite que você ingerir dados de aplicativos complexos de alta cardinalidade na forma de logs e gerar métricas acionáveis a partir deles. Você pode incorporar métricas personalizadas junto com dados detalhados de eventos de log, e o CloudWatch extrai automaticamente as métricas personalizadas para que você possa visualizar e alarmar nelas, para detecção de incidentes em tempo real. Além disso, os eventos de log detalhados associados às métricas extraídas podem ser consultados usando o CloudWatch Logs Insights para fornecer insights profundos sobre as causas raiz dos eventos operacionais.

O formato de métrica incorporado ajuda a gerar métricas personalizadas acionáveis a partir de recursos efêmeros, como funções e contêineres Lambda. Ao usar o formato de métrica incorporado para enviar logs desses recursos efêmeros, agora você pode criar facilmente métricas personalizadas sem ter que instrumentar ou manter um código separado, enquanto obtém recursos analíticos poderosos em seus dados de log.

Ao usar o formato de métrica incorporado, você pode gerar seus logs usando uma biblioteca de cliente. Como alternativa, você pode construir manualmente os logs e enviá-los usando a API `PutLogEvents` ou o agente CloudWatch.

{{% notice tip %}}
Você pode aprender mais sobre [Embedded Metric Format (EMF)](https://aws.amazon.com/about-aws/whats-new/2019/11/amazon-cloudwatch-launches-embedded-metric-format/) e como [usar as bibliotecas de cliente para gerar registros de formato métrico incorporado](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Libraries.html) examinando nossa documentação.
{{% /notice %}}