+++
title = "Teste de carga do aplicativo"
weight = 92
+++

Para ver como nosso aplicativo resiste aos picos de tráfego, vamos usar o [Locust](https://locust.io/) para testar a carga de nossas 3 APIs simultaneamente. Para este teste, devemos emular o acesso de **250 usuários simultâneos durante 10 minutos**, gerando usuários a uma **taxa de 10 usuários/s**

#### Exportar as variáveis de saída da pilha

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos fornece. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Execute o teste de carga

Volte para seu **Ambiente Cloud9** e abra um novo terminal.

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
locust -f locust-script.py -H ${ApiUrl} --headless -u 250 -r 10 -t 10m
```

{{% notice warning %}}
Lembre-se de que este teste levará **10 minutos** para ser concluído.
{{% /notice %}}

Após sua conclusão, você deverá ver seu terminal com uma saída como a seguinte:

![Lambda Insights](/images/li_2.png)

Você notou que a operação `/POST` não apresentou erros e manteve sua latência relativamente baixa, enquanto as outras duas operações `/GET` apresentaram uma taxa de erro e latência geral realmente elevadas?. Na próxima etapa, tentaremos entender o porquê.