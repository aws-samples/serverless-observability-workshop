+++
title = "Métricas y Dashboards"
chapter = true
weight = 30
+++

### CloudWatch Metrics, Alarmas y Dashboards

En este módulo, prepararemos nuestra aplicación para enviar métricas operativas y empresariales personalizadas a CloudWatch, crear alarmas basadas en métricas de fallos para notificar a nuestros ingenieros de SRE/Sysops en caso de cualquier interrupción del servicio y consolidaremos todas estas métricas en un único panel de control para facilitar las tareas de supervisión.

### Métricas

Las métricas son datos sobre el rendimiento de sus sistemas. De forma predeterminada, varios servicios proporcionan métricas gratuitas para los recursos (como instancias de Amazon EC2, volúmenes de Amazon EBS e instancias de base de datos de Amazon RDS). También puede habilitar la supervisión detallada de algunos recursos, como las instancias de Amazon EC2, o publicar sus propias métricas de aplicación. Amazon CloudWatch puede cargar todas las métricas de su cuenta (tanto las métricas de recursos de AWS como las métricas de aplicación que proporciona) para búsquedas, gráficos y alarmas.

Los datos de las métricas se conservan durante 15 meses, lo que le permite ver tanto los datos actualizados al minuto como los datos históricos.

### Alarmas

Puede añadir alarmas a los Dashboards (Paneles) de CloudWatch y supervisarlas visualmente. Cuando hay una alarma en un panel de control, se vuelve roja cuando está en estado ALARMA, lo que facilita la supervisión de su estado de forma proactiva.

Las alarmas solo invocan acciones para cambios de estado sostenidos. Las alarmas de CloudWatch no invocan acciones simplemente porque se encuentran en un estado determinado, el estado debe haber cambiado y mantenido durante un número determinado de períodos.

### Dashboards

Amazon CloudWatch Dashboards (Paneles) son páginas de inicio personalizables en la consola de CloudWatch que puede utilizar para supervisar sus recursos en una sola vista, incluso aquellos recursos que se encuentran distribuidos en distintas regiones. Puede utilizar los Dashboards de CloudWatch para crear vistas personalizadas de las métricas y las alarmas de sus recursos de AWS.

