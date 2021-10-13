---
title: "Alarmes de Métricas"
chapter: true
weight: 35
---

# Alarmes

Você pode adicionar alarmes aos painéis do CloudWatch e monitorá-los visualmente. Quando um alarme está no painel, ele fica vermelho quando está no estado ALARME, tornando mais fácil monitorar seu status de forma proativa.

Os alarmes invocam ações apenas para mudanças de estado sustentadas. Os alarmes do CloudWatch não invocam ações simplesmente porque estão em um estado particular, o estado deve ter mudado e sido mantido por um determinado número de períodos.

Depois que um alarme invoca uma ação devido a uma mudança no estado, seu comportamento subsequente depende do tipo de ação que você associou ao alarme. Para ações do Amazon EC2 Auto Scaling, o alarme continua a invocar a ação para cada período em que o alarme permanece no novo estado. Para notificações do Amazon SNS, nenhuma ação adicional é invocada.

Você pode criar alarmes de métricas e alarmes compostos no CloudWatch

Um alarme de métrica observa uma única métrica do CloudWatch ou o resultado de uma expressão matemática com base nas métricas do CloudWatch. O alarme executa uma ou mais ações com base no valor da métrica ou expressão relativa a um limite ao longo de vários períodos de tempo. A ação pode ser uma ação do Amazon EC2, uma ação do Amazon EC2 Auto Scaling ou uma notificação enviada a um tópico do Amazon SNS.

Um alarme composto inclui uma expressão de regra que leva em consideração os estados de alarme de outros alarmes que você criou. O alarme composto entra no estado ALARME apenas se todas as condições da regra forem atendidas. Os alarmes especificados em uma expressão de regra de alarme composto podem incluir alarmes métricos e outros alarmes compostos.
