---
title: "Pushing Metrics Synchronously"
chapter: true
title: "Enviando métricas de forma sincrónica"
chapter: true
weight: 32
---

# Enviando métricas de forma sincrónica

Es hora de llevar nuestras primeras métricas a CloudWatch. Comencemos por empujarlos sincrónicamente usando el método `putMetric` proporcionado en nuestra lib utils. Vamos a modificar las funciones de PutItem Lambda para comprender sus comportamientos.
