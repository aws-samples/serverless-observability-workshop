+++
title = "Subsegmentos e anotações"
weight = 74
+++

Nas etapas anteriores, fomos capazes de enriquecer ainda mais nossa observabilidade de serviço habilitando `Active Tracing` para o API Gateway e Lambda e capturando chamadas de serviço AWS usando `AWS X-Ray SDK`. Mas o que aconteceria se tivéssemos um cenário em que uma função Lambda executasse várias chamadas de método que contivessem sua própria lógica de negócios e pudesse introduzir latência desnecessária em nosso tempo de resposta geral? E se recebermos um erro para um conjunto específico de usuários ou itens que desejamos solucionar? Como poderíamos enriquecer nosso aplicativo para obter ainda mais observabilidade para esses cenários complexos?

O SDK do AWS X-Ray também permite instrumentar o código para criar `Subsegmentos` e adicionar `Anotações e metadados` personalizados dentro deles. Esses subsegmentos aparecerão na página `Trace details` e permitirão que você capture e ajuste o desempenho de cada um de seus métodos dentro de uma determinada função ou biblioteca. `Annotations` irá se comportar como um dos atributos disponíveis, para filtrar seus rastros (traces), e então você pode começar a injetar anotações de negócios ou operacionais que são significativas para suas consultas, como` ITEM_ID`, `USER_ID`,` STATUS`, e outros que irão mais tarde ajudá-lo a aprimorar seus grupos de consulta.

{{% notice tip %}}
Você pode aprender mais sobre como aproveitar o AWS X-Ray SDK para criar [Subsegments](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-subsegments.html) e adicionar anotações customizadas [Annotations and Metadada](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-segment.html) vendo  nossa documentação.
{{% /notice %}}

Vamos modificar as seguintes funções do Lambda para adicionar nossos subsgmentos e anotações personalizadas:

{{%children style="h4"%}}