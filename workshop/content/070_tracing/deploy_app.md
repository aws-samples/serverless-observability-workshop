+++
title = "Deploy the sample app"
weight = 71
+++

First of all, let's get to our sample application for this exercise.

{{% notice tip %}}
Spare a couple of minutes to understand which resources are being provisioned in the ***serverless-observability-workshop/code/sample-app-tracing/template.yaml*** file as well as its Lambda functions.
{{% /notice %}}

For the sake of showing a more complete example of active tracing in place, we will be adding a second link to our `Put Item` service in a way that for each new item recorded, a message will be sent to a SNS Topic which will later trigger another Lambda function to notify an administrator about this new item insertion.

After we deploy this application, the following resources will be provisioned in our AWS account:

![Sample Architecture](/images/tracing_app.png?width=40pc)

### Deploying your application

1. Go back you your **Cloud9** environment and navigate the sample app at ***serverless-observability-workshop/code/sample-app-tracing***

    **Optional** - If you find yourself unable to run `npm install` or `sam build` due a `no space left on device` error, you might want to free up some space.

    ```sh
    # Look for uninstallable node_modules in our workspace to free disk space
    find ~/environment -type d -name 'node_modules' -prune | xargs rm -r
    ```

    Then, install, build and deploy the application

    ```sh
    # Install, Build and Deploy the application
    cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
    npm install
    sam build
    sam deploy -g
    ```

1. Enter the following settings when prompted:

    ```sh
            Setting default arguments for 'sam deploy'
            =========================================
            Stack Name [sam-app]: monitoring-app-tracing
            AWS Region [us-east-1]: 
            #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
            Confirm changes before deploy [y/N]: N
            #SAM needs permission to be able to create roles to connect to the resources in your template
            Allow SAM CLI IAM role creation [Y/n]: Y
            getAllItemsFunction may not have authorization defined, Is this okay? [y/N]: Y
            getByIdFunction may not have authorization defined, Is this okay? [y/N]: Y
            putItemFunction may not have authorization defined, Is this okay? [y/N]: Y
            Save arguments to samconfig.toml [Y/n]: Y 
    ```

1. Wait for a few minutes and then enter the following when prompted again:

    ```sh
    Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy135353414/3d893bb8-2ecf-4491-9022-0644f5534da


    Previewing CloudFormation changeset before deployment
    ======================================================
    Deploy this changeset? [y/N]: Y
    ```

1. Follow [this deep link to CloudFormation](https://console.aws.amazon.com/cloudformation/home#/stacks?filteringText=sam-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=) to keep up with the stack deployment.

![Sample Architecture](/images/samstacks_tracing.png)

Wait until both stacks complete its deployment and take note of your API URL endpoint for later testing.

![Sample Architecture](/images/samstackcomplete_tracing.png)

### Test the APIs 

#### Export the stack output variables

To invoke our API's, we first need to fetch the `ApiUrl` output variable that our CloudFormation stack gives us. So let us iterate through our stack and export all output variables as environment variables:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

{{% notice warning %}}
Note down your API Url endpoint because it might end up being a requirement in a later module.
{{% /notice %}}


#### Test the `Put Item` operation

```sh
curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"1",  
        "name": "Sample test item"
  }'

curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"2",  
        "name": "Second test item"
  }'
```

#### Test the `Get All Items` operation

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Test the `Get Item by Id` operation

```sh
curl -X GET $ApiUrl/items/1 | jq
```