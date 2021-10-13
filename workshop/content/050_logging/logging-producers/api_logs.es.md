+++
title = "(Registro de accesos personalizado) Custom Logging Access de API Gateway"
weight = 51
+++

Para ayudarnos a mejorar nuestras capacidades de registro y comprender también los patrones que invocan nuestras API, Amazon API Gateway proporciona una función denominada `(Registros de acceso personalizado) Custom Access Logs` que nos permite especificar y registrar atributos en CloudWatch Logs desde una amplia gama de campos disponibles para cada solicitud realizada a nuestras API.

{{% notice tip %}}
Aprenda más de [(Registros de acceso personalizado) Custom Access Logs](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html) y la disponibilidad de [(variables del registro de acceso) access logging variables](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference) from our Documentation.
{{% /notice %}}

### Actualizar la plantilla de SAM

Para habilitar el (registro) logging en nuestra API, debemos modificar nuestro archivo de plantilla SAM en ***serverless-observability-workshop/code/sample-app/template.yaml*** para agregar nuestro patrón de registro deseado, así como los recursos necesarios para admitirlo, que consisten en un rol de IAM con los permisos adecuados para habilitar API Gateway para enviar registros a CloudWatch Logs y habilitar esta función en API Gateway.

1. Edita en el archivo ***serverless-observability-workshop/code/sample-app/template.yaml*** la declaración del recurso de la etapa del API Gateway y actualícelo para habilitar  `AccessLogSetting` en el recurso del `API Gateway` y también crear el `IAM Role` concediendo permiso para enviar registros a CloudWatch Logs y adjuntar esta función a su recurso de `API Gateway`:

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

2. Guardar las modificaciones en el archivo ***serverless-observability-workshop/code/sample-app/template.yaml***. 
