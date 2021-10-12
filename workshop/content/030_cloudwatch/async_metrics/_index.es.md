---
title: "Enviar métricas de forma asincrónica"
chapter: true
weight: 33
---

# Enviar métricas de forma asincrónica

En el ejercicio anterior, aprendimos a enviar métricas de forma sincrónica mediante el SDK de AWS. Sin embargo, ese enfoque, por ser sincrónico, acaba consumiendo recursos de nuestras funciones Lambda en términos de latencia adicional (alrededor de 60 ms por llamada de servicio) y consumo de memoria, lo que puede dar lugar a ejecuciones más caras y lentas. 

Para superar esta sobrecarga, podemos adoptar una estrategia asincrónica para crear estas métricas. Esta estrategia consiste en imprimir las métricas en un formato estructurado o semiestructurado como registros en Amazon CloudWatch Logs y disponer de un mecanismo de procesamiento en segundo plano de estas entradas en función de un patrón de filtro que coincida con la misma entrada que se imprimió.

Para entender cómo insertar métricas de forma asíncrona usaremos el método `logMetric` proporcionado en nuestra lib utils. Vamos a modificar la función Lambda getTembyId para comprender este nuevo comportamiento.