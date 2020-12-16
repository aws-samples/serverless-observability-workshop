---
title: "Create Cloud9 Environment"
chapter: false
weight: 1
---

This section provides instructions on how to run a AWS Cloudformation script to set up the AWS Cloud9 environment. AWS CloudFormation gives you an easy way to model a collection of related AWS and third-party resources, provision them quickly and consistently. AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser

1. Once you are in the AWS Management Console, ensure you have selected the correct region from menu on the top-right hand corner.
![region](/images/region-change.png?width=20pc)

1. Click [this link](https://console.aws.amazon.com/cloudformation/home?#/stacks/create/review?templateURL=https://serverless-observability-workshop-templates.s3.amazonaws.com/template.yaml&stackName=serverless-observability-workshop-c9) which will take you to a page to quickly create the Cloudformation stack. Running this stack will create your Cloud9 environment with the relevant users and permissions to continue with this workshop.

1. Enter a password (must contain at least 8 characters, and include uppercase, lowercase, numbers). Note this password down somewhere. This password is required to log into the console using an IAM user.

1. Click the checkbox that acknowledges creating IAM resources.

1. Click `Create Stack`.
![c9-cfn](/images/c9-cfn.png?width=40pc)

1. Wait until the stack status becomes `CREATE_COMPLETE`.

1. Go to the outputs tab and click the link against the `AWSConsoleSignInUrl` key. 
![cfn-outputs](/images/cfn-outputs.png?width=40pc)

1. Once you are in the sign-page, enter the username as`workshop`, password from step 3, and click the `Sign in` button.

You are now logged into the AWS Management Console as the `workshop` user.

