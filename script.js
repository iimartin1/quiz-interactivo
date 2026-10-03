// ===== 1. Datos: las preguntas viven aquí =====
// "correcta" es la posición (empezando en 0) de la opción correcta
const PREGUNTAS = [
  {
    pregunta: "¿Qué significa HTML?",
    opciones: [
      "Lenguaje de estilos",
      "Lenguaje de marcado de hipertexto",
      "Lenguaje de programación",
      "Base de datos",
    ],
    correcta: 1,
  },
  {
    pregunta: "¿Qué propiedad de CSS cambia el color del texto?",
    opciones: ["background", "font-style", "text-color", "color"],
    correcta: 3,
  },
  {
    pregunta: "¿Qué palabra clave declara una constante en JavaScript?",
    opciones: ["var", "let", "const", "static"],
    correcta: 2,
  },
  {
    pregunta: "¿Qué devuelve typeof \"hola\" en JavaScript?",
    opciones: ["string", "text", "char", "undefined"],
    correcta: 0,
  },
  {
    pregunta: "¿Qué comando de Git guarda tus cambios como un punto del historial?",
    opciones: ["git add", "git push", "git clone", "git commit"],
    correcta: 3,
  },
  {
    pregunta: "¿Qué método agrega un elemento al final de un arreglo?",
    opciones: ["push", "pop", "shift", "slice"],
    correcta: 0,
  },
  {
    pregunta: "¿Qué declaración CSS activa Flexbox en un contenedor?",
    opciones: ["position: flex", "display: flex", "layout: flex", "flex: container"],
    correcta: 1,
  },
  {
    pregunta: "¿Qué evento se dispara cuando el usuario hace clic en un botón?",
    opciones: ["press", "tap", "click", "hover"],
    correcta: 2,
  },
];

// ===== 2. Referencias al HTML =====
const pantallas = {
  inicio: document.getElementById("pantalla-inicio"),
  jugando: document.getElementById("pantalla-pregunta"),
  resultado: document.getElementById("pantalla-resultado"),
};

const botonComenzar = document.getElementById("comenzar");
const botonSiguiente = document.getElementById("siguiente");
const botonReiniciar = document.getElementById("reiniciar");

const numeroPregunta = document.getElementById("numero-pregunta");
const puntajeTexto = document.getElementById("puntaje");
const barra = document.getElementById("barra");
const contenedorBarra = document.querySelector(".progreso");
const preguntaTexto = document.getElementById("pregunta");
const contenedorOpciones = document.getElementById("opciones");
const retroalimentacion = document.getElementById("retroalimentacion");

const resultadoPuntaje = document.getElementById("resultado-puntaje");
const resultadoRecord = document.getElementById("resultado-record");
const resultadoMensaje = document.getElementById("resultado-mensaje");

// ===== 3. Estado del quiz =====
let preguntas;   // preguntas de esta partida, ya mezcladas
let indice;      // en qué pregunta vamos
let puntaje;     // aciertos acumulados
let respondida;  // true cuando ya se eligió una opción

// ===== 4. Funciones =====
// Fisher-Yates: mezcla una COPIA, sin modificar el original
function mezclar(arreglo) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Una sola función decide qué pantalla se ve
function mostrarPantalla(nombre) {
  Object.entries(pantallas).forEach(([clave, seccion]) => {
    seccion.classList.toggle("oculto", clave !== nombre);
  });
}

function prepararPreguntas() {
  return mezclar(PREGUNTAS).map((p) => {
    // Cada opción recuerda si es la correcta, así al mezclar no se pierde
    const opciones = p.opciones.map((texto, i) => ({
      texto,
      esCorrecta: i === p.correcta,
    }));
    return { pregunta: p.pregunta, opciones: mezclar(opciones) };
  });
}

function iniciarQuiz() {
  preguntas = prepararPreguntas();
  indice = 0;
  puntaje = 0;
  mostrarPantalla("jugando");
  mostrarPregunta();
}

function mostrarPregunta() {
  const actual = preguntas[indice];
  const total = preguntas.length;
  respondida = false;

  numeroPregunta.textContent = `Pregunta ${indice + 1} de ${total}`;
  puntajeTexto.textContent = puntaje;
  preguntaTexto.textContent = actual.pregunta;
  retroalimentacion.textContent = "";

  const porcentaje = Math.round(((indice + 1) / total) * 100);
  barra.style.width = `${porcentaje}%`;
  contenedorBarra.setAttribute("aria-valuemin", "0");
  contenedorBarra.setAttribute("aria-valuemax", "100");
  contenedorBarra.setAttribute("aria-valuenow", porcentaje);

  // Dibujamos las opciones desde cero
  contenedorOpciones.innerHTML = "";
  actual.opciones.forEach((opcion, i) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = opcion.texto;
    boton.dataset.indice = i;
    contenedorOpciones.appendChild(boton);
  });

  botonSiguiente.textContent = indice === total - 1 ? "Ver resultado" : "Siguiente";
  botonSiguiente.classList.add("oculto");
}

function responder(botonElegido) {
  if (respondida) return; // protege contra respuestas dobles
  respondida = true;

  const actual = preguntas[indice];
  const elegida = actual.opciones[Number(botonElegido.dataset.indice)];

  // Bloqueamos todas y resaltamos la correcta
  contenedorOpciones.querySelectorAll(".opcion").forEach((boton, i) => {
    boton.disabled = true;
    if (actual.opciones[i].esCorrecta) boton.classList.add("correcta");
  });

  if (elegida.esCorrecta) {
    puntaje++;
    retroalimentacion.textContent = "¡Correcto!";
  } else {
    botonElegido.classList.add("incorrecta");
    retroalimentacion.textContent = "Incorrecto. La respuesta correcta está en verde.";
  }

  puntajeTexto.textContent = puntaje;
  botonSiguiente.classList.remove("oculto");
  botonSiguiente.focus();
}

function siguientePregunta() {
  indice++;
  if (indice < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
}

function mensajeFinal(porcentaje) {
  if (porcentaje === 100) return "¡Perfecto! Respondiste todo bien.";
  if (porcentaje >= 80) return "¡Muy bien! Dominas lo básico.";
  if (porcentaje >= 50) return "Vas por buen camino. Repasa y vuelve a intentarlo.";
  return "Te toca repasar un poco. ¡Inténtalo otra vez!";
}

function mostrarResultado() {
  const total = preguntas.length;
  const porcentaje = Math.round((puntaje / total) * 100);
  let mejorPuntaje = null;

  try {
    const puntajeGuardado = localStorage.getItem("mejorPuntaje");
    if (puntajeGuardado !== null) {
      const valorGuardado = Number(puntajeGuardado);
      if (Number.isInteger(valorGuardado) && valorGuardado >= 0) {
        mejorPuntaje = valorGuardado;
      }
    }
  } catch (error) {
    console.warn("No se pudo leer el mejor puntaje guardado.", error);
  }

  if (mejorPuntaje === null || puntaje > mejorPuntaje) {
    mejorPuntaje = puntaje;
    try {
      localStorage.setItem("mejorPuntaje", String(mejorPuntaje));
    } catch (error) {
      console.warn("No se pudo guardar el mejor puntaje.", error);
    }
  }

  resultadoPuntaje.textContent = `${puntaje} / ${total}`;
  resultadoRecord.textContent = `Tu récord: ${mejorPuntaje} / ${total}`;
  resultadoMensaje.textContent = `${mensajeFinal(porcentaje)} (${porcentaje}%)`;
  mostrarPantalla("resultado");
  botonReiniciar.focus();
}

// ===== 5. Eventos =====
botonComenzar.addEventListener("click", iniciarQuiz);
botonSiguiente.addEventListener("click", siguientePregunta);
botonReiniciar.addEventListener("click", iniciarQuiz);

// Un solo escuchador para todas las opciones (event delegation)
contenedorOpciones.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".opcion");
  if (boton) responder(boton);
});

// ===== 6. Al abrir la página =====
mostrarPantalla("inicio");