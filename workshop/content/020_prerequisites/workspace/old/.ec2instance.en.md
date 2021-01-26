---
title: "Attach the IAM role to your Workspace"
chapter: false
weight: 17
---

1. Follow [this deep link to find your Cloud9 EC2 instance](https://console.aws.amazon.com/ec2/v2/home?#Instances:tag:Name=aws-cloud9-serverless-observability-workshop;sort=desc:launchTime)
1. Select the instance, then choose **Actions / Security / Modify IAM Role**
![c9instancerole](/images/c9instancerole2.png)
1. Choose **serverless-observability-workshop-admin** from the **IAM Role** drop down, and select **Save**
![c9attachrole](/images/c9attachrole2.png)
