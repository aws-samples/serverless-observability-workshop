+++
title = "Logging"
weight = 12
description = "Logging centralizado possibilita o armazenamento de todos os logs em um único logal, e em um formato padronizado entre eles, simplificando atividades de análise e correlações."
+++

Logging centralizado provê dois importantes benefícios. Primeiro, ele armazena todos os registros de logs e em um formato padronizado entre eles, simplificando drásticamente atividades de análise e correlações. Segundo, ele provê um armazenamento seguro para todos seus dados. Caso uma máquina na sua rede seja comprometida, o invasor não será capaz de alterar seus logs armazenados no repositório central -- ao menos que este repositório também seja comprometido. Uma vez que você crie este repositório, o próximo passo é introduzir técnicas de análise centralizadas.

CloudWatch Logs Insights possibilita que você interativamente pesquise e analise seus logs armazenados no CloudWatch Logs. Você pode realizar queries para ajudá-lo aser mais eficiente  e eficaz na respostas a problemas operacionais. Caso uma falha ocorra, você pode usar o CloudWatch Logs Insights para identificar suas potenciais causas e validar suas correções.

CloudWatch Logs Insights inclui uma linguagem de própria para queries com poucos comandos, porém poderosos. CloudWatch Logs Insights tamb;em provê queries de exemplos, descrições destes comandos, auto-complete de queries, e descoberta automática dos campos disponíveis em seus logs para serem utilizados em queries. Queries de exemplos são disponibilizadas para diversos serviços da AWS e seus respectivos logs gerados.

CloudWatch Logs Insights automaticamente descobre campos em logs de serviços da AWS, como o Amazon Route 53, AWS Lambda, AWS CloudTrail, e Amazon VPC, e qualquer outra aplicação ou log customizado que gere um evento de log em JSON.

Você pode utilizar o CloudWatch Logs Insights para pesquisar dados enviados para o CloudWatch Logs de 5 de Novembro de 2018 em diante.

Uma simples query pode conter até 20 log groups. O timeout máximo por query é de 15 minutos. Resultados de queries ficam disponíveis por 7 dias.

Você pode salvar as queries que você criou. Isto pode auxiliá-lo a rodar queries complexas sempre que precisar, sem precisar recriá-las cada vez que precisar executá-las.

Clique [aqui](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) para conhecer mais sobre o CloudWatch Logs Insights.
