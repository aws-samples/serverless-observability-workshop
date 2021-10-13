---
title: "Publicando Métricas de forma assíncrona"
chapter: true
weight: 33
---

No exercício anterior, aprendemos como enviar métricas de forma síncrona usando o SDK da AWS. Porém, essa abordagem, por ser síncrona, acaba consumindo recursos de nossas funções Lambda em termos de latência adicional (em torno de 60ms por chamada de serviço) e consumo de memória, o que pode levar a execuções mais caras e lentas.

Para superar essa sobrecarga, podemos adotar uma estratégia assíncrona para criar essas métricas. Essa estratégia consiste em imprimir as métricas em um formato estruturado ou semiestruturado como logs para Amazon CloudWatch Logs e ter um mecanismo em segundo plano que processa essas entradas com base em um padrão de filtro que corresponde à mesma entrada que foi impressa.

Para entender como enviar métricas de forma assíncrona, usaremos o método `logMetric` fornecido em nossa biblioteca de utilitários. Vamos modificar a função GetItemById Lambda para entender esse novo comportamento.
