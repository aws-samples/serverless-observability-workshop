---
title: "Atualizar seu Workspace"
chapter: false
weight: 15
---

#### Instalar dependências

- Execute os seguintes comandos no terminal Cloud9 para atualizar o [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) e instale o [jq](https://stedolan.github.io/jq/) (a command-line JSON processor) e o [Locust](https://locust.io/) (uma ferramenta para testes de carga)
```
nvm install stable
sudo yum -y install jq 
sudo pip3 install locust
```