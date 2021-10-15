+++
title = "(Monitoreo sintético) Synthetic Canaries"
chapter = true
weight = 40
+++

# (Monitoreo sintético) Synthetic Canaries

Puedes utilizar Amazon CloudWatch Synthetics para crear "canaries", secuencias de comandos configurables que se ejecutan según un cronograma, para supervisar sus puntos de conexión y API. "Canaries" sigue las mismas rutas y realiza las mismas acciones que un cliente, lo que te permite verificar continuamente la experiencia del cliente incluso cuando no tienes tráfico de clientes en tus aplicaciones. Al usar "canaries", puedes descubrir problemas antes que tus clientes.

"Canaries" son scritps de Node.js. Crean funciones Lambda en tu cuenta que utilizan Node.js como marco de trabajo. "Canaries" puede utilizar la biblioteca Node.js de Puppeteer Node.js para realizar funciones en sus aplicaciones. "Canaries" trabaja sobre protocolos HTTP y HTTPS.

"Canaries" comprueba la disponibilidad y la latencia de los endpoints, y puede almacenar datos de tiempo de carga y capturas de pantalla de la interfaz de usuario. Supervisan las API de REST, las URL y el contenido del sitio web, y pueden comprobar si hay cambios no autorizados de phishing, inyección de código y secuencias de comandos entre sitios.

Para un video de demostración de "canaries", consulta [Amazon CloudWatch Synthetics Demo video](https://www.youtube.com/watch?v=hF3NM9j-u7I).
