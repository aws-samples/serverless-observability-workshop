+++
title = "Teste do aplicativo"
weight = 12
+++

#### Exportar as variáveis de saída da pilha

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos fornece. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Teste a operação `Put Item`

```sh
curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"3",  
        "name": "Sample third item"
  }'
```
