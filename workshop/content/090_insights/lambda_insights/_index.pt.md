+++
title = "Lambda Insights"
chapter = true
weight = 91
+++


CloudWatch Lambda Insights é uma solução de monitoramento e solução de problemas para aplicativos serverless em execução via AWS Lambda. A solução coleta, agrega e resume as métricas de nível de sistema, incluindo tempo de CPU, memória, disco e rede. Ele também coleta, agrega e resume informações de diagnóstico, como inicializações a frio (cold start) e desligamentos de workers do Lambda, para ajudá-lo a isolar problemas com as funções do Lambda e resolvê-los rapidamente.

Lambda Insights usa uma nova extensão CloudWatch Lambda, que é fornecida como uma camada (layer) Lambda. Quando você instala essa extensão em uma função Lambda, ela coleta métricas de nível de sistema e emite um único evento de log de desempenho para cada chamada dessa função Lambda. O CloudWatch usa formatação de métrica incorporada para extrair métricas dos eventos de log. Para obter mais informações sobre extensões Lambda, consulte [Usando extensões AWS Lambda](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-extensions-in-preview/?nc1=b_rp). Para obter mais informações sobre o formato de métrica incorporado, consulte [Ingerindo registros de alta cardinalidade e gerando métricas com o formato de métrica incorporado do CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html).

# Importante

Embora este módulo seja projetado para ser completamente independente sem depender da conclusão anterior do módulo, é altamente recomendável implementar os recursos do [Distributed Tracing](../../070_tracing).

