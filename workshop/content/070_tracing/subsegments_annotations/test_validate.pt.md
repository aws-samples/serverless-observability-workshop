---
title: "Implante e valide seu rastreamento"
weight: 79
---

### Modifique o aplicativo

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
sam build
sam deploy
```

### Teste as APIs

#### Exportar as variáveis de saída da pilha

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos fornece. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Teste a operação `Put Item`

```sh
curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"5",  
        "name": "Fifth test item"
  }'

curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"6",  
        "name": "Sixth test item"
  }'
```

#### Teste a operação `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Teste a operação `Get Item by Id`

```sh
curl -X GET $ApiUrl/items/5 | jq
curl -X GET $ApiUrl/items/6 | jq
```

### Validar o resultado

Vá para a página [ServiceLens Traces](https://console.aws.amazon.com/cloudwatch/home?#servicelens:traces).

Role para baixo na lista **Tipo de filtro**. Agora você pode visualizar as três anotações diferentes que criamos como filtros adicionais para seus traços.

![Service Lens](/images/subsegment_1.png)

- Selecionar **Status**.
- Selecionar **SUCCESS**.
- Clicar **Add to filter**.

![Service Lens](/images/subsegment_2.png)

- Clique em um dos rastreios (traces) para Método HTTP **POST**.

![Service Lens](/images/subsegment_3.png)

Desta vez, você poderá ver que os subsegmentos adicionais que criamos estão aparecendo com seus respectivos tempos de resposta.

![Service Lens](/images/subsegment_4.png)

- Clique no subsegmento **## Handler** e role para baixo até a área `Detalhes do segmento`. Você deve ser capaz de ver as anotações personalizadas que adicionou dentro desse subsegmento.

![Service Lens](/images/subsegment_5.png)

- Clique no subsegmento **## putItemData** e role para baixo até a área `Detalhes do segmento`. Você deve ser capaz de ver os metadados personalizados que adicionou dentro desse subsegmento.

![Service Lens](/images/subsegment_6.png)

{{% notice tip %}}
Reserve alguns minutos para analisar o mapa de serviço e os rastreamentos de **Obter item por id `get item by id`** e **Obter todos os itens `get all itens`** também.
{{% /notice %}}
