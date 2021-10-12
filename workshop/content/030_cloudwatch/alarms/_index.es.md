---
title: "Alarmas basadas en métricas"
chapter: true
weight: 35
---

# Alarmas

Puedes añadir alarmas a los paneles de CloudWatch y supervisarlas visualmente. Cuando hay una alarma en un panel de control, se vuelve roja cuando está en estado ALARMA, lo que facilita la supervisión de su estado de forma proactiva. 

Las alarmas solo invocan acciones para cambios de estado sostenidos. Las alarmas de CloudWatch no invocan acciones simplemente porque se encuentran en un estado determinado, el estado debe haber cambiado y mantenido durante un número determinado de períodos.

Después de que una alarma invoca una acción debido a un cambio de estado, su comportamiento posterior depende del tipo de acción que haya asociado a la alarma. En el caso de las acciones de Auto Scaling de Amazon EC2, la alarma sigue invocando la acción durante cada período en el que la alarma permanece en el nuevo estado. En el caso de las notificaciones de Amazon SNS, no se invocan acciones adicionales.

Puede crear alarmas métricas y alarmas compuestas en CloudWatch. 

Una alarma métrica observa una sola métrica de CloudWatch o el resultado de una expresión matemática basada en métricas de CloudWatch. La alarma realiza una o varias acciones en función del valor de la métrica o expresión en relación con un umbral durante varios períodos de tiempo. La acción puede ser una acción de Amazon EC2, una acción de Amazon EC2 Auto Scaling o una notificación enviada a un tema de Amazon SNS.

Una alarma compuesta incluye una expresión de regla que tiene en cuenta los estados de alarma de otras alarmas que haya creado. La alarma compuesta pasa al estado ALARM solo si se cumplen todas las condiciones de la regla. Las alarmas especificadas en la expresión de regla de una alarma compuesta pueden incluir alarmas métricas y otras alarmas compuestas.