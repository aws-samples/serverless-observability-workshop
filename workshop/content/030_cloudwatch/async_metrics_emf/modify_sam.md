+++
title = "Modify the SAM Template"
weight = 12
+++

### Modify the SAM Template

1. Go back you your **Cloud9** environment and open your app workspace at ***serverless-observability-workshop/code/sample-app***.

    We are going to edit the ***serverless-observability-workshop/code/sample-app/template.yaml*** file to include a `Custom Metric Namespace` for all `Lambda` functions in our template. Open the your YAML template and locate the Global section. Add the `AWS_EMF_NAMESPACE` environment variable for Lambda.

    ```yaml
    Globals:
    Function:
        Runtime: nodejs12.x
        Timeout: 100
        MemorySize: 128
        CodeUri: ./
        Environment:
        Variables:
            APP_NAME: !Ref SampleTable
            SAMPLE_TABLE: !Ref SampleTable
            SERVICE_NAME: item_service
            ENABLE_DEBUG: false
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1
            AWS_EMF_NAMESPACE: MonitoringApp # <----- ADD FOR NAMESPACE SETUP  
    ```

    Save your changes to the ***serverless-observability-workshop/code/sample-app/template.yaml*** file.
