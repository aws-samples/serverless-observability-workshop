
# AWS Serverless Observability Workshop

This repository is part of workshop [Serverless Observability Workshop](https://serverless-observability.workshop.aws/en/). This repo have [AWS Serverless Application](https://aws.amazon.com/serverless/sam/) to deploy a demo application for education propose about how to instrument, collect, and analyze metrics, traces, and log of your serverless application to understand what are happen and prevent failures

### Components
- Amazon CloudWatch
- AWS X-Ray
- AWS Lambda
- Amazon DynamoDB
- AWS SNS

## Overall architecture

![Architecture](/img/architecture.png)

In this sample, we will have an API Gateway triggering AWS Lambdas to PUT and GET data from Amazon DynamoDB and publish message in a AWS SNS topic and observe what happen in the application.

### Getting started:

Make sure you have the necessary IAM permissions to deploy all the resources that will be deployed in this sample

- In the AWS Region that you want to deploy the solution, create a AWS Cloud9 environment.

#### Deploying
*Remember:* This repo is part of an [Workshop](https://serverless-observability.workshop.aws/en/) and have some steps there to help the solution works perfectly.

1. Clone the repo in your Cloud9 env:
    ```shell
   git clone https://github.com/aws-samples/serverless-observability-workshop.git
   ```

2. If you want to understand how to collect metrics and logs follow this step:
    ```shell
   cd ~/environment/serverless-observability-workshop/code/sample-app
   npm install
   sam build
   sam deploy -g
   ```   
    1. For more details see [HERE](https://catalog.us-east-1.prod.workshops.aws/workshops/b3fc5f7a-ff34-41fa-a9f2-4cd9e093e6ff/en-US/module-1)

3. If you want to undestand how to inject and check Traces follow this step:
    ```shell
   cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
   npm install
   sam build
   sam deploy -g
   ```   

#### Clean Up
1. Go back in your Cloud9 environment and remove each project like this example:
    ```shell
    cd ~/environment/serverless-observability-workshop/code/sample-app
    sam delete
   ```   

## License:
This library is licensed under the MIT-0 License. See the LICENSE file.
