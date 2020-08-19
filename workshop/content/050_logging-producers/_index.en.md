+++
title = "Logging - Producers and Instrumentation"
chapter = true
weight = 50
+++

# Logging - Producers and Instrumentation

[Continuous integration (CI)](https://aws.amazon.com/devops/continuous-integration/) and [continuous delivery (CD)](https://aws.amazon.com/devops/continuous-delivery/) are essential for deft organizations. Teams are more productive when they can make discrete changes frequently, release those changes programmatically and deliver updates without disruption.

In this module, we will build a CI/CD pipeline for our serverless application using [AWS CodeCommit](https://aws.amazon.com/codecommit/), [AWS CodeBuild](https://aws.amazon.com/codebuild/) and [AWS CodePipeline](https://aws.amazon.com/codepipeline/). The CI/CD pipeline will deploy our sample Node.js service in multiple environments, we will make a change to the CodeCommit repository and observe the automated delivery of this change to our account.