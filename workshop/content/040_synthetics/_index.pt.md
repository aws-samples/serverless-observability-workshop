+++
title = "Canários Sintéticos"
chapter = true
weight = 40
+++

Você pode usar o Amazon CloudWatch Synthetics para criar canários, scripts configuráveis que são executados de forma agendada, para monitorar seus endpoints e APIs. Os canários seguem as mesmas rotas e executam as mesmas ações que um cliente, o que possibilita  você verificar continuamente a experiência do cliente, mesmo quando não há tráfego de cliente em seus aplicativos. Usando canários, você pode descobrir problemas antes que seus clientes o façam.

Canários são scripts Node.js. Eles criam funções Lambda em sua conta que usam Node.js como estrutura. Canários podem usar a biblioteca Puppeteer Node.js para executar funções em seus aplicativos. Canários funcionam em protocolos HTTP e HTTPS.

Canários verificam a disponibilidade e latência de seus endpoints e podem armazenar dados de tempo de carregamento e capturas de tela. Eles monitoram suas APIs REST, URLs e conteúdo do site e podem verificar se há mudanças não autorizadas de phishing, injeção de código e script entre sites.

Para um vídeo de demonstração dos canários, consulte o [Amazon CloudWatch Synthetics Demo video](https://www.youtube.com/watch?v=hF3NM9j-u7I).
