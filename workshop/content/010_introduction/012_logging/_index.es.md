+++
title = "Logging (registro)"
weight = 12
description = "El logging (registro) centralizado posibilita el almacenamiento de todos los logs en un único sitio y en un formato estándar entre ellos, capaz de simplificar las actividades de análisis y correlaciones."
+++

El logging (registro) centralizado aporta dos importantes beneficios: en primer lugar, almacena todos los registros de logs en un formato estandarizado entre ellos, simplificando drásticamente las actividades de análisis y correlaciones. En segundo lugar, provee un almacenamiento seguro para todos tus datos. Caso una máquina se vea comprometida, el invasor no será capaz de hacer alteraciones en los logs almacenados en el depósito central - a menos que este depósito también sea comprometido. 
Una vez creado este depósito, el próximo paso es introducir técnicas de análisis centralizadas. 

CloudWatch Logs Insights permite que, interactivamente, busques y analices sus logs almacenados en el CloudWatch Logs. Podrás realizar queries para ayudarlo en la eficacia en la respuesta a problemas operacionales. En el caso de que ocurra un fallo, podrás utilizar CloudWatch Logs Insights para identificar las causas potenciales y validar las correcciones. 

CloudWatch Logs Insights incluye un lenguaje propio para queries con pocos comandos, pero que son poderosos. CloudWatch Logs Insights también provee muestras de queries, descripciones de estos comandos, auto-complete de queries, y descubrimiento automático de los campos disponibles en sus logs para que sean utilizados en queries. Muestras de queries de ejemplos están disponibilizados para diversos servicios de AWS y sus respectivos logs generados.

CloudWatch Logs Insights descubre automáticamente campos en logs de servicios de AWS, como el Amazon Route 53, AWS Lambda, AWS CloudTrail y Amazon VPC, y cualquier otra aplicación o log customizado que genere un evento de log en un JSON.

Puedes utilizar el CloudWatch Logs Insights para investigar datos enviados al CloudWatch Logs desde el 5 de noviembre de 2018.

Una sola consulta puede llegar a contener hasta 20 log groups. El tiempo máximo de ejecución por consulta es de 15 minutos. Resultados de queries estarán disponibles por 7 días.

Puedes guardar las consultas que haz creado, lo que podrá auxiliarte a ejecutar queries complejas siempre que necesite, sin la necesidad de crearlas de nuevo cuando quieras ejecutarlas.

[Aquí](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) puedes conocer más acerca del CloudWatch Logs Insights. 
