const TIEMPO_TRANSICION_BASE = 1000;
const TIEMPO_TRANSICION_CAMBIO_ESTILO = 500;
const MENSAJE_FRACASO = document.querySelector("#mensaje-fracaso");
const MENSAJE_EXITO = document.querySelector("#mensaje-exito");
const BOTON_EMPEZAR = document.querySelector("#boton-empezar");
const BOTON_REINICIAR = document.querySelector("#boton-resetear");
const TABLERO_JUEGO = document.querySelector("#tablero-juego");
const INDICADOR_ESTADO_JUEGO = document.querySelector("#estado-juego");
const CARTEL_RONDA = document.querySelector("#cartel-ronda");
const CARTEL_TURNO_MAQUINA = document.querySelector("#cartel-turno-maquina");
const CARTEL_TURNO_USUARIO = document.querySelector("#cartel-turno-usuario");
const ID_JUGADOR_MAQUINA = 0;
const ID_JUGADOR_USUARIO = 1;

function mostrarElemento(elemento) {
  elemento.classList.remove("d-none");
}

function ocultarElemento(elemento) {
  elemento.classList.add("d-none");
}

function encenderCartel(cartel) {
  cartel.style.opacity = 1;
}

function apagarCartel(cartel) {
  cartel.style.opacity = 0.5;
}

function parpadearCartel(valor, index = 0) {
  let comienzoTransicion = index * TIEMPO_TRANSICION_BASE;
  let cartelSeleccionado = document.querySelector(`#cartel-tablero-${valor}`);

  setTimeout(function () {
    encenderCartel(cartelSeleccionado);
  }, comienzoTransicion);

  setTimeout(function () {
    apagarCartel(cartelSeleccionado);
  }, comienzoTransicion + TIEMPO_TRANSICION_CAMBIO_ESTILO);
}

function actualizarCartelTurno(jugador) {
  if (jugador === ID_JUGADOR_MAQUINA) {
    encenderCartel(CARTEL_TURNO_MAQUINA);
    apagarCartel(CARTEL_TURNO_USUARIO);
  } else if (jugador === ID_JUGADOR_USUARIO) {
    encenderCartel(CARTEL_TURNO_USUARIO);
    apagarCartel(CARTEL_TURNO_MAQUINA);
  }
}

function mostrarCartelExito() {
  mostrarElemento(MENSAJE_EXITO);

  setTimeout(function () {
    ocultarElemento(MENSAJE_EXITO);
  }, TIEMPO_TRANSICION_BASE);
}

function actualizarCartelRonda(i) {
  let rondaActual = (CARTEL_RONDA.innerHTML = `Ronda ${i}`);
  return rondaActual;
}

function verificarRondaSuperada(numeroJugadasUsuario, numeroJugadasMaquina) {
  return numeroJugadasUsuario === numeroJugadasMaquina;
}

function manejarEmpezarJuego() {
  BOTON_EMPEZAR.onclick = function () {
    ocultarElemento(BOTON_EMPEZAR);
    mostrarElemento(TABLERO_JUEGO);
    mostrarElemento(INDICADOR_ESTADO_JUEGO);
    manejarRonda([], 1);
  };
}

function resetearJuego() {
  BOTON_REINICIAR.onclick = function () {
    ocultarElemento(MENSAJE_FRACASO);
    ocultarElemento(BOTON_REINICIAR);
    manejarRonda([], 1);
  };
}

function terminarJuego() {
  bloquearJugadaUsuario();
  mostrarElemento(MENSAJE_FRACASO);
  mostrarElemento(BOTON_REINICIAR);
  resetearJuego();
}

function jugadaMaquina(jugadasMaquina) {
  let siguienteJugada = Math.floor(Math.random() * 4) + 1;

  jugadasMaquina.push(siguienteJugada);

  jugadasMaquina.forEach(parpadearCartel);
}

function ejecutarSiguienteRonda(jugadasMaquina, numeroRonda) {
  numeroRonda = numeroRonda + 1;

  manejarRonda(jugadasMaquina, numeroRonda);
}

function bloquearJugadaUsuario() {
  TABLERO_JUEGO.onclick = function () {};
}

function desbloquearJugadaUsuario(jugadasMaquina, numeroRonda) {
  let i = 0;

  TABLERO_JUEGO.onclick = function (e) {
    cartelPulsado = Number(e.target.id.split("-")[2]);

    parpadearCartel(cartelPulsado, 0);

    if (cartelPulsado !== jugadasMaquina[i]) {
      terminarJuego();
      return;
    }

    i++;

    if (verificarRondaSuperada(i, jugadasMaquina.length)) {
      mostrarCartelExito();
      ejecutarSiguienteRonda(jugadasMaquina, numeroRonda);
      return;
    }
  };
}

function manejarRonda(jugadasMaquina, numeroRonda) {
  bloquearJugadaUsuario();

  actualizarCartelRonda(numeroRonda);

  actualizarCartelTurno(ID_JUGADOR_MAQUINA);

  setTimeout(function () {
    jugadaMaquina(jugadasMaquina);

    let cantidadJugadasMaquina = jugadasMaquina.length;

    setTimeout(
      actualizarCartelTurno,
      cantidadJugadasMaquina * TIEMPO_TRANSICION_BASE,
      ID_JUGADOR_USUARIO
    );

    setTimeout(
      desbloquearJugadaUsuario,
      cantidadJugadasMaquina * TIEMPO_TRANSICION_BASE,
      jugadasMaquina,
      numeroRonda
    );
  }, TIEMPO_TRANSICION_BASE);
}

manejarEmpezarJuego();
