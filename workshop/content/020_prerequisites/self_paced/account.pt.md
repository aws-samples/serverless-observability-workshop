---
title: "Criar uma conta da AWS"
chapter: false
weight: 1
---

{{% notice warning %}}
Sua conta deve ter a capacidade de criar novas funções do IAM e escopo de outras permissões do IAM.
{{% /notice %}}

1. Se você ainda não tiver uma conta da AWS com acesso de administrador: [crie uma agora clicando aqui](https://aws.amazon.com/getting-started/)

1. Certifique-se de que você está seguindo as etapas restantes do workshop
 como um usuário do IAM com acesso de administrador à conta da AWS.

1. [Acesse o console de gerenciamento do IAM](https://console.aws.amazon.com/iam/home?#/users$new)

1. Na navegação à esquerda, selecione **Users** e clique no botão **Add user**.

1. Insira os detalhes do usuário:
![Create User](/images/iam-1-create-user.png)

1. Anexe a política do IAM AdministratorAccess e clique em **Next: Tags**
![Attach Policy](/images/iam-2-attach-policy.png)

1. Iremos pular a adição de tags para o workshop. Clique em **Next: Review**

1. Clique para criar o novo usuário:
![Confirm User](/images/iam-3-create-user.png)

1. Tome nota da URL de login e salve-a para uso futuro:
![Login URL](/images/iam-4-save-url.png)

1. Clique nesta URL para acessar a página de login do Console de Gerenciamento da AWS, use o nome de usuário e a senha do usuário do `workshop` que você acabou de criar.

Depois de concluir a etapa acima, você pode ir direto para [**Criar um Workspace**](../../workspace/workspace)