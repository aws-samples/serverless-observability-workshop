+++
title = "Deploy the sample app"
weight = 20
+++

### Clone the GitHub Repository 

```sh
cd ~/environment
git clone https://github.com/aws-samples/serverless-observability-workshop.git
cd serverless-observability-workshop/code/sample-app
```

{{% notice tip %}}
Spare a couple of minutes to understand which resources are being provisioned in the `serverless-observability-workshop/code/sample-app/template.yaml` file as well as its Lambda functions.
{{% /notice %}}

After we deploy this application, the following resources will be provisioned in our AWS account:

![Sample Architecture](/images/architecture.png?width=40pc)

### Deploying your application

Install, build and deploy the application

```sh
# Install, Build and Deploy the application
cd ~/environment/serverless-observability-workshop/code/sample-app
npm install
sam build
sam deploy -g
```

Enter the following settings when prompted:

```sh
        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [sam-app]: monitoring-app
        AWS Region [us-east-1]: <YOUR AWS_REGION>
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: N
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: Y
        getAllItemsFunction may not have authorization defined, Is this okay? [y/N]: Y
        getByIdFunction may not have authorization defined, Is this okay? [y/N]: Y
        putItemFunction may not have authorization defined, Is this okay? [y/N]: Y
        Save arguments to configuration file [Y/n]: Y
        SAM configuration file [samconfig.toml]: 
        SAM configuration environment [default]: 

```

Follow [this deep link to CloudFormation](https://console.aws.amazon.com/cloudformation/home#/stacks?filteringText=sam-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=) to keep up with the stack deployment.

![Sample Architecture](/images/samstacks.png)

Wait until both stacks complete its deployment and take note of your API URL endpoint for later testing.

![Sample Architecture](/images/samstackcomplete.png)

### Test the APIs

#### Export the stack output variables

To invoke our API's, we first need to fetch the `ApiUrl` output variable that our CloudFormation stack gives us. So let us iterate through our stack and export all output variables as environment variables:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
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
