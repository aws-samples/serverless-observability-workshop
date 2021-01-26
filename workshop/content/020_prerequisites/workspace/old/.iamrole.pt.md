---
title: "Crie uma função do IAM para seu Workspace"
chapter: false
weight: 16
---


1. Siga [este deep link para criar uma função do IAM com acesso de administrador.](https://console.aws.amazon.com/iam/home#/roles$new?step=review&commonUseCase=EC2%2BEC2&selectedUseCase=EC2&policies=arn:aws:iam::aws:policy%2FAdministratorAccess)
1. Confirme se **AWS service** e **EC2** estão selecionados, então clique em **Next** para ver as permissões.
1. Confirme se **AdministratorAccess** está verificado, então clique em **Next: Tags** para atribuir as tags.
1. Mantenha os padrões e clique em **Next: Review** para rever.
1. Coloque **serverless-observability-workshop-admin** para o nome, e clique em **Create role**.
![createrole](/images/createrole.png)