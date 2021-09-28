+++
title = "Criar Grupos de X-Ray"
weight = 80
+++

Usando uma expressão de filtro, você pode definir critérios pelos quais aceitar rastreios no grupo.

Você pode chamar o grupo por nome ou por Amazon Resource Name (ARN) para gerar seu próprio gráfico de serviço, resumos de rastreamento e métricas do Amazon CloudWatch. Depois que um grupo é criado, os rastreamentos de entrada são verificados em relação à expressão de filtro do grupo à medida que são armazenados no serviço do X-Ray. As métricas para o número de rastreamentos que correspondem a cada critério são publicadas no CloudWatch a cada minuto.

Atualizar a expressão de filtro de um grupo não altera os dados já registrados. A atualização se aplica apenas a rastreamentos subsequentes. Isso pode resultar em um gráfico mesclado das expressões novas e antigas. Para evitar isso, exclua o grupo atual e crie um novo.

### Criar Grupos de X-Ray

1. Vá para [AWS XRay](https://console.aws.amazon.com/xray/home#service-map) e clique no menu suspenso **Padrão** e selecione **Criar grupo**.

    ![Service Lens](/images/xray_group.png)

2. Na nova janela, nomeie o grupo como **Higherlatency** e insira a seguinte expressão. Esta é uma expressão simples que filtra apenas solicitações que exibem mais de 2 segundos de tempo de resposta.

    ```SQL
    responsetime > 2
    ```

    ![Service Lens](/images/xray_group_11.png)


{{% notice tip %}}
Você também pode criar expressões de filtro usando as anotações personalizadas que criamos na etapa anterior, por exemplo, agrupando todas as solicitações com falha usando a expressão de filtro: 
`Annotation.Status = "FAILED"`
{{% /notice %}}

3. **(Opcional)** Reserve algum tempo (cerca de 9 a 10 minutos) desde o último teste de API e invoque mais uma vez sua API.

    ```sh
    export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
    echo "export ApiUrl="$ApiUrl
    curl -X GET $ApiUrl/items/ | jq
    ```

4. **(Opcional)** Uma vez criado e selecionado, você verá que o Mapa de Serviço muda para mostrar apenas os serviços e rotas que exibem mais de 2 segundos de tempo de resposta.

    ![Service Lens](/images/xray_group_1.png)

    Quando um grupo é criado, o X-Ray também publica novas métricas.

5. **(Opcional)** Vá para o namespace AWS XRay em [CloudWatch Metrics](https://console.aws.amazon.com/cloudwatch/home?#metricsV2:graph=~();namespace=~'AWS*2fX-Ray). Clique em **Group Metrics**.

    Você verá uma nova métrica chamada `ApproximateTraceCount` criada para o grupo` Higherlatency` que acabou de criar.

    ![Service Lens](/images/xray_group_2.png)

{{% notice warning %}}
Depois de criar um Grupo no X-Ray, os rastreamentos anteriores estarão disponíveis na guia `Trace`, mas apenas novas invocações irão gerar` CloudWatch Metrics` ou estarão disponíveis na tela `Service Map`. 
{{% /notice %}}
