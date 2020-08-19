---
title: "Remove the Environment Stacks"
chapter: false
weight: 71
---

#### Delete the stacks for each environment created for our application

```sh
aws cloudformation delete-stack --stack-name demo-service-Dev
aws cloudformation delete-stack --stack-name demo-service-Staging
aws cloudformation delete-stack --stack-name demo-service-Prod
```

Make sure to refresh until your stacks are deleted to move forward
![Cleaned Stacks](/images/delete-stack.png?width=20pc)
