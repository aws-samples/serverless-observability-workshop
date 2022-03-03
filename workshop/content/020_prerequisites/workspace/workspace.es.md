---
title: "Crear un Workspace"
chapter: false
weight: 14
---

{{% notice warning %}}
**Puedes saltar este paso si estás haciendo este workshop desde un evento en AWS (Immersion Day, re:Invent, Summit, etc.) utilizando el Event Engine.**
{{% /notice %}}

{{% notice tip %}}
Ad blockers, javascript dissablers y tracking blockers deben estar desactivados para el dominio Cloud9, o la conexión con el workspace podrá verse afectada. Cloud9 requiere uso de cookies de terceros. Podrás agregar a la whitelist los [dominios específicos.]( https://docs.aws.amazon.com/cloud9/latest/user-guide/troubleshooting.html#troubleshooting-env-loading).
{{% /notice %}}

### Inicia el Cloud9 en tu región más cercana:
{{< tabs name="Region" >}}
{{{< tab name="N. Virginia" include="us-east-1.es.md" />}}
{{{< tab name="Oregon" include="us-west-2.es.md" />}}
{{{< tab name="Ireland" include="eu-west-1.es.md" />}}
{{{< tab name="Ohio" include="us-east-2.es.md" />}}
{{{< tab name="Singapore" include="ap-southeast-1.es.md" />}}
{{{< tab name="Sydney" include="ap-southeast-2.es.md" />}}
{{{< tab name="São Paulo" include="sa-east-1.es.md" />}}
{{< /tabs >}}


- Acepta los valores predeterminados para **Stack name** y **Parameters**  y haz clic en **Create stack**. 

![c9before](/images/cfn-stack-1.png)

![c9before](/images/cfn-stack-2.png)

- Espera hasta que el stack esté con status de creación `CREATE_COMPLETE`

![c9before](/images/cfn-stack-3.png)

- Accede a tu [Consola de Cloud9](https://console.aws.amazon.com/cloud9/home).
- Encuentra el sitio que se llama **serverless-observability-workshop**, haz clic en **Open IDE**.
- Cuando aparezca la consola de Cloud9, personalice el entorno cerrando las pestañas **welcome tab** y **AWS Toolkit** tab, **lower work area**, y abriendo una nueva pestaña **terminal** en el escritorio principal:

![c9before](/images/c9before.png)

- Tu workspace debe asemejarse con este: 
![c9after](/images/c9after.png)


{{% notice tip %}}
Si te gusta este tema, puedes elegirlo solo al seleccionar **View / Themes / Solarized / Solarized Dark**
en el menú de workspace del Cloud9. 

{{% /notice %}}

