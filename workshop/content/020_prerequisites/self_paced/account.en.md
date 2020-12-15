---
title: "Create an AWS account"
chapter: false
weight: 1
---

{{% notice warning %}}
Your account must have the ability to create new IAM roles and scope other IAM permissions.
{{% /notice %}}

1. If you don't already have an AWS account with Administrator access: [create
one now by clicking here](https://aws.amazon.com/getting-started/)

1. Ensure you are following the remaining workshop steps
    as an IAM user with administrator access to the AWS account.

1. [Go to the IAM Management console](https://console.aws.amazon.com/iam/home?#/users$new)

1. On the left hand navigation, select **Users**, then click on the **Add User** button.

1. Enter the user details:
![Create User](/images/iam-1-create-user.png)

1. Attach the AdministratorAccess IAM Policy, and click **Next: Tags**
![Attach Policy](/images/iam-2-attach-policy.png)

1. We will skip adding tags for the workshop. Click **Next: Review**

1. Click to create the new user:
![Confirm User](/images/iam-3-create-user.png)

1. Take note of the login URL and save it for future use:
![Login URL](/images/iam-4-save-url.png)

1. Click on this URL to go to the AWS Management Console login page, use the username and password for the `workshop` user you just created.

Once you have completed the step above, you can head straight to [**Create a Workspace**](../../workspace/workspace)