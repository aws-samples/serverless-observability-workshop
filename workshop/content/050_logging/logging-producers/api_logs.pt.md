+++
title = "Logs de acesso personalizado do API Gateway"
weight = 51
+++

Para nos ajudar a aprimorar nossos recursos de log e também compreender os padrões que nossas APIs são invocadas, o Amazon API Gateway fornece um recurso chamado `Custom Access Logs` que nos permite especificar e registrar atributos para CloudWatch Logs a partir de uma ampla gama de campos disponíveis para cada solicitação feito para nossas APIs.

{{% notice tip %}}
Saiba mais sobre [Logs de acesso personalizados](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html) e as [variáveis de log de acesso](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference) disponíveis na nossa documentação.
{{% /notice %}}

### Atualizar o template SAM

Para habilitar o registro em nossa API, devemos alterar nosso arquivo de modelo SAM em ***serverless-observability-workshop/code/sample-app/template.yaml*** para adicionar nosso padrão de registro desejado, bem como os recursos necessários para suportá-lo, que consiste em uma função IAM com as permissões adequadas para permitir que o API Gateway envie logs para CloudWatch Logs e habilite esse recurso para o próprio API Gateway.

1. Edite o arquivo ***serverless-observability-workshop/code/sample-app/template.yaml*** na declaração do recursos do seu API gateway e atualize habilitando `AccessLogSetting` para o recurso de `API Gateway` e também criando um `IAM Role` concedendo permissão para enviar logs para CloudWatch Logs e anexando este papel ao seu recurso `API Gateway`:

  ```yaml
  Resources:
  # API Gateway
    Api:
      Type: AWS::Serverless::Api
      DependsOn: ApiCWLRoleArn
      Properties:
        StageName: Prod
        AccessLogSetting:
          DestinationArn: !Sub ${ApiAccessLogGroup.Arn} # This Log Group is already created within our SAM Template
          Format: "{ 'requestId':'$context.requestId', 'ip': '$context.identity.sourceIp', 'caller':'$context.identity.caller', 'user':'$context.identity.user','requestTime':'$context.requestTime', 'xrayTraceId':'$context.xrayTraceId', 'wafResponseCode':'$context.wafResponseCode', 'httpMethod':'$context.httpMethod','resourcePath':'$context.resourcePath', 'status':'$context.status','protocol':'$context.protocol', 'responseLength':'$context.responseLength' }"
        MethodSettings:
          - MetricsEnabled: True
            ResourcePath: '/*'
            HttpMethod: '*'

    ApiCWLRoleArn:
      Type: AWS::ApiGateway::Account
      Properties: 
        CloudWatchRoleArn: !GetAtt CloudWatchRole.Arn

  # IAM Role for API GW + CWL
    CloudWatchRole:
        Type: AWS::IAM::Role
        Properties:
          AssumeRolePolicyDocument:
            Version: '2012-10-17'
            Statement:
              Action: 'sts:AssumeRole'
              Effect: Allow
              Principal:
                Service: apigateway.amazonaws.com
          Path: /
          ManagedPolicyArns:
            - 'arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
        
  ```

2. Salve as modoficações no arquivo ***serverless-observability-workshop/code/sample-app/template.yaml***.