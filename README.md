# Quiz interactivo

Quiz de preguntas de desarrollo web (HTML, CSS, JavaScript y Git), hecho con HTML, CSS y JavaScript puro.

**Demo en vivo:** https://iimartin1.github.io/quiz-interactivo/

## Características
- Tres pantallas: inicio, preguntas y resultado
- Preguntas y opciones en orden aleatorio en cada partida
- Retroalimentación inmediata: la correcta en verde y la incorrecta en rojo
- Puntaje en vivo y barra de progreso
- Mensaje final según el porcentaje de aciertos
- Récord guardado en el navegador (localStorage)
- Se puede completar solo con el teclado
- Diseño responsive

## Tecnologías
- HTML5
- CSS3 (Flexbox)
- JavaScript (ES6)

## Lo que aprendí
- Manejar el estado de una app con variables (pregunta actual, puntaje, respondida)
- Controlar qué pantalla se ve con una sola función
- Separar los datos (preguntas) de la lógica
- Mezclar arreglos con el algoritmo Fisher-Yates sin perder la respuesta correcta
- Evitar respuestas dobles con un "candado" de estado
- Guardar y leer datos con localStorage de forma segura

## Cómo agregar preguntas
Añade un objeto al arreglo `PREGUNTAS` en `script.js`:

    {
      pregunta: "Tu pregunta",
      opciones: ["A", "B", "C", "D"],
      correcta: 0, // posición de la correcta, empezando en 0
    }