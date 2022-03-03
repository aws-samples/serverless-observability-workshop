---
title: "Create a Workspace"
chapter: false
weight: 14
---

{{% notice warning %}}
**If you are running this workshop at an AWS Event (Immersion Day, re:Invent, Summit, etc) using Event Engine, you must skip this step.**
{{% /notice %}}

{{% notice tip %}}
Ad blockers, javascript disablers, and tracking blockers should be disabled for
the cloud9 domain, or connecting to the workspace might be impacted.
Cloud9 requires third-party-cookies. You can whitelist the [specific domains]( https://docs.aws.amazon.com/cloud9/latest/user-guide/troubleshooting.html#troubleshooting-env-loading).
{{% /notice %}}

### Launch Cloud9 in your closest region:
{{< tabs name="Region" >}}
{{{< tab name="N. Virginia" include="us-east-1.en.md" />}}
{{{< tab name="Oregon" include="us-west-2.en.md" />}}
{{{< tab name="Ireland" include="eu-west-1.en.md" />}}
{{{< tab name="Ohio" include="us-east-2.en.md" />}}
{{{< tab name="Singapore" include="ap-southeast-1.en.md" />}}
{{{< tab name="Sydney" include="ap-southeast-2.en.md" />}}
{{{< tab name="São Paulo" include="sa-east-1.en.md" />}}
{{< /tabs >}}


- Accept the default values for **Stack name** and **Parameters** and click **Create stack**. 

![c9before](/images/cfn-stack-1.png)

![c9before](/images/cfn-stack-2.png)

- Wait until your Stack creating status shows as `CREATE_COMPLETE`

![c9before](/images/cfn-stack-3.png)

- Go to your [Cloud9 Environment](https://console.aws.amazon.com/cloud9/home).
- Find the environment named **serverless-observability-workshop**, click **Open IDE**.
- When the Cloud9 console is shown, customize the environment by closing the **welcome tab** and the **AWS Toolkit** tab, **lower work area**, and opening a new **terminal** tab in the main work area:
![c9before](/images/c9before.png)

- Your workspace should now look like this:
![c9after](/images/c9after.png)


{{% notice tip %}}
If you like this theme, you can choose it yourself by selecting **View / Themes / Solarized / Solarized Dark**
in the Cloud9 workspace menu.

{{% /notice %}}

