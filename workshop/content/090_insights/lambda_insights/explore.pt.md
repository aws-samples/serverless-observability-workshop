+++
title = "Explorar métricas"
weight = 93
+++

### Visualização multifuncional

Vá para o console [Lambda Insights](https://console.aws.amazon.com/cloudwatch/home?#lambda-insights:performance).

Selecione a opção **Multifuncional**. Você pode selecionar as funções Lambda que são criadas por nosso aplicativo e ver suas métricas.

![Service Lens](/images/li_mf_1.png)

Essas métricas permitem entender que todas as funções começaram com um tempo de resposta relativamente baixo e aumentaram drasticamente e também tiveram sua alocação de memória no máximo durante todo o teste. Você também pode notar que, embora a `Duração` para `getItemByIdFunction` e `getAllItemsFunction` sejam muito altas, a duração para `putItemFunction` e `notificarNewItemFunction` estava constantemente baixa e abaixo de um limite aceitável, mesmo com seu consumo de memória no máximo.

Por outro lado, embora tenhamos experimentado uma taxa de erro mais alta nas respostas do API Gateway, conforme mostrado pela saída do Locust, nem um único erro foi relatado pelo Lambda nas funções. Isso ocorre porque estamos tratando nossas exceções dentro de nossas funções, sendo assim considerada uma execução bem-sucedida.

Poderíamos tentar alocar mais memória de 128 MB a 1 GB para nossas funções e ver o que acontece, mas isso realmente resolveria nosso problema considerando que o `putItemFunction` teve um bom desempenho sob a mesma alocação de memória?

![Service Lens](/images/li_mf_2.png)

Clique na função **monitoring-app-getAllItemsFunction** ** para analisar.

### Visualização de função única

![Service Lens](/images/li_sf_1.png)

`Lambda Insights` é integrado com `ServiceLens`. Você pode visualizar os traços do `AWS X-Ray` clicando em **Visualizar** mostrado abaixo para uma execução de função específica que foi apresentada pelo AWS X-Ray. Caso você tenha passado pelo módulo [Distributed Tracing](../../../070_tracing), clique em um dos rastreamentos disponíveis para pesquisar ainda mais.

![Service Lens](/images/li_sf_2.png)

### Rodada de bônus

{{% notice warning %}}
Esta etapa requer que você passe pelo módulo [Distributed Tracing](../../../070_tracing) Caso você não tenha feito isso, ainda vale a pena ler o exemplo.
{{% /notice %}}

#### Integração ServiceLens e X-Ray

Ao selecionar um rastreamento específico da etapa anterior, você irá diretamente para o console do ServiceLens Service Map para navegar por todos os nós do rastreamento. Isso nos torna mais fácil entender que o problema está ocorrendo dentro do `Amazon DynamoDB`, o que está estrangulando nossa solicitação.

![Service Lens](/images/li_trace_1.png)

![Service Lens](/images/li_trace_2.png)

![Service Lens](/images/li_trace_3.png)


Agora está claro para nós que o maior infrator está dentro do design de nossa mesa do DynamoDB. Conforme o teste de carga avança, estamos inundando nossa tabela com itens enquanto ainda executamos uma operação `Scan` para a mesma tabela, tornando-a uma operação mais complexa e cara, já que projetamos nosso código de aplicativo e tabela seguindo uma abordagem ingênua, sem` Índices` ou `Paginação do Resultado da Consulta`.

Agora você pode entender que simplesmente aumentar a alocação de memória para nossas funções de 128 MB para 1 GB (ou mesmo 3 GB) pode trazer um pequeno benefício no início, mas, no final das contas, encontraríamos o mesmo `ProvisionedThroughputExceededException`, nos levando a repensar o forma como projetamos nossa mesa e buscamos seus itens.

Este é apenas um dos muitos exemplos onde não apenas o `Lambda Insights`, mas também a implementação das `métricas de negócios e operação` adequadas e `rastreamento distribuído` podem realmente facilitar seu trabalho durante as tarefas de solução de problemas, seja para gargalos de desempenho ou qualquer tipo de interrupções de serviço.
