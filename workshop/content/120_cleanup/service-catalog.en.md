---
title: "Undeploy the Service Catalog"
chapter: false
weight: 73
---

Let us now terminate the provisioned product in Service Catalog as well as deleting both the product and portifolio we created.

#### Empty the Build Artifact S3 Bucket

Go to your [AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home) and search for the stack Service Catalog created starting with the **SC-** prefix. Go to Outputs and take note of the ArtifactBucket S3 Bucket name.
![Cleaned Stacks](/images/sc-stack.png)

```sh
aws s3 rm s3://<YOUR-ARTIFACT-BUCKET-NAME> --recursive
```

#### Terminate provisioned product

```sh
aws servicecatalog terminate-provisioned-product --provisioned-product-name demo-service
```

Go to your [Service Catalog console](https://console.aws.amazon.com/servicecatalog/home) in **Provisioned Products** and wait until the termination is complete to move forward
![Terminated Product](/images/delete-prov-prod.png)

#### Remove product association from the portifolio

- Go to **Portifolios**.
- Select the product named **Projects with CI/CD Pipeline**.
- Click the **Products** tab.
- Select the product named **Serverless Project**, click **Remove** and confirm.

![Removed Product from Portifolio](/images/remove-prod-port.png)

#### Remove user association from the portifolio

- Click the **Group, roles, and users** tab.
- Select your user, click **Remove group, role, or user** and confirm.

![Removed Product from Portifolio](/images/remove-user-port.png)

#### Delete the portifolio

- Click **Actions** and choose **Delete**.
- Click **Delete** once again.

![Cleaned Portifolio](/images/delete-portifolio.png)

#### Delete the product

- Go to **Products**.
- Select the product named **Serverless Project**, click **Actions** and choose **Delete**.
- Click **Delete** once again.

![Cleaned Product](/images/delete-product.png)
