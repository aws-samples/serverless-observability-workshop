---
title: "Delete CloudFormation Stacks"
chapter: false
weight: 71
---

#### Delete the stacks for our applications

```sh
aws cloudformation delete-stack --stack-name sam-app
aws cloudformation delete-stack --stack-name log-processing
aws cloudformation delete-stack --stack-name demo-service-Prod
```

Make sure to refresh until your stacks are deleted to move forward
![Cleaned Stacks](/images/delete-stack.png?width=20pc)
