+++
title = "Disparando um Alarme"
weight = 12
+++

Volte rapidamente para o seu terminal no `Cloud9` e realize uma chamada API `GetItemByID`. 

### Exportar a variável de saída da pilha

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos dá. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Teste a operação `Get Item By ID`

```sh
curl -X GET $ApiUrl/items/1 | jq
```

### Navegando na tela de Alarmes

Depois de criar o alarme, você notará que o alarme agora está no estado `Insufficient data` o que indica que não há dados suficientes para validar o alarme. Esperar por 5 minutos mudará o estado do alarme para `OK` em verde ou `In alarm` em vermelho.

![alarm-5](/images/alarm_5.png)

Você deverá receber um e-mail logo após o primeiro período de coleta de dados.

![alarm-6](/images/alarm_6.png)
