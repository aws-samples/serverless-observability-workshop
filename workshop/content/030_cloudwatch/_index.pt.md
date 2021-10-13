+++
title = "Métricas e Painéis"
chapter = true
weight = 30
+++

# Métricas, Alarmes e Painéis do CloudWatch

Neste módulo, vamos preparar nosso aplicativo para enviar métricas operacionais e de negócios personalizadas para CloudWatch, criar alarmes com base em métricas sobre falhas para notificar nossos engenheiros de SRE/SysOps em caso de qualquer interrupção do serviço e consolidar todas essas métricas em um único painel para facilitar as tarefas de monitoramento.


### Métricas

Métricas são dados sobre o desempenho de seus sistemas. Por padrão, vários serviços fornecem métricas gratuitas para recursos (como instâncias do Amazon EC2, volumes do Amazon EBS e instâncias do banco de dados Amazon RDS). Você também pode ativar o monitoramento detalhado para alguns recursos, como suas instâncias do Amazon EC2, ou publicar suas próprias métricas de aplicativo. O Amazon CloudWatch pode carregar todas as métricas em sua conta (tanto as métricas de recursos da AWS quanto as métricas de aplicativos que você fornece) para pesquisa, gráficos e alarmes.

Os dados de suas métricas são mantidos por 15 meses, permitindo que você visualize dados atualizados e históricos.


### Alarmes

Você pode adicionar alarmes aos painéis do CloudWatch e monitorá-los visualmente. Quando um alarme está no painel, ele fica vermelho quando está no estado ALARME, tornando mais fácil monitorar seu status de forma proativa.

Os alarmes invocam ações apenas para mudanças de estado sustentadas. Os alarmes do CloudWatch não invocam ações simplesmente porque estão em um estado particular, o estado deve ter mudado e sido mantido por um determinado número de períodos.


### Painéis

Os painéis do Amazon CloudWatch são páginas iniciais personalizáveis no console do CloudWatch que você pode usar para monitorar seus recursos em uma única exibição, mesmo aqueles recursos que estão espalhados por diferentes regiões. Você pode usar os painéis do CloudWatch para criar visualizações personalizadas das métricas e alarmes para seus recursos da AWS.


