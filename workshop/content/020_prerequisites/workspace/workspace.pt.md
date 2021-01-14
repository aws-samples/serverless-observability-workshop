---
title: "Criar um Workspace"
chapter: false
weight: 14
---

{{% notice warning %}}
O workspace do Cloud9 deve ser criado por um usuário do IAM com privilégios de administrador,
não o usuário root da conta. Certifique-se de que você está conectado como um usuário do IAM, não o usuário root da conta.
{{% /notice %}}

{{% notice tip %}}
Ad blockers, javascript disablers, e tracking blockers devem ser desativados para
o domínio cloud9, ou a conexão com o workspace pode ser afetada.
O Cloud9 requer cookies de terceiros. Você pode colocar na whitelist os [domínios específicos]( https://docs.aws.amazon.com/cloud9/latest/user-guide/troubleshooting.html#troubleshooting-env-loading).
{{% /notice %}}

### Inicie o Cloud9 na sua região mais próxima:
{{< tabs name="Region" >}}
{{{< tab name="N. Virginia" include="us-east-1.pt.md" />}}
{{{< tab name="Oregon" include="us-west-2.pt.md" />}}
{{{< tab name="Ireland" include="eu-west-1.pt.md" />}}
{{{< tab name="Ohio" include="us-east-2.pt.md" />}}
{{{< tab name="Singapore" include="ap-southeast-1.pt.md" />}}
{{{< tab name="Sydney" include="ap-southeast-2.pt.md" />}}
{{{< tab name="São Paulo" include="sa-east-1.pt.md" />}}
{{< /tabs >}}

- Selecione **Create environment**
- Nomeie como  **serverless-observability-workshop**, clique em Next.
- Nas Configurações do ambiente, verifique se a opção "Create a new EC2 instance for environment (direct access)" está selecionada.
- Escolha **t3.small** para o tipo de instância, mantenha todos os valores padrão e clique em **Next Step**
- Revise os detalhes e clique em **Create environment** (isso levará alguns minutos)

- Quando o console do Cloud9 for exibido, personalize o ambiente fechando a guia **welcome** e a guia **AWS Toolkit**, **lower work area**, e abrindo uma nova guia **terminal** na área de trabalho principal:
![c9before](/images/c9before.png)

- Seu workspace agora deve ser parecido com este:
![c9after](/images/c9after.png)


{{% notice tip %}}
Se você gosta deste tema, você pode escolhê-lo sozinho, selecionando **View / Themes / Solarized / Solarized Dark**
no menu do workspace do Cloud9.

{{% /notice %}}

