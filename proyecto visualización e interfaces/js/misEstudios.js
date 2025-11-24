// misEstudios.js
document.addEventListener("DOMContentLoaded", () => {

  // --- Helpers ---
  const parseDate = (iso) => new Date(iso + "T00:00:00");
  const diffDays = (d) => Math.floor((Date.now() - d.getTime()) / (1000*60*60*24));

  // thresholds (días)
  const WARN_DAYS = 180; // 6 meses ~ 180 días
  const ALERT_DAYS = 365; // 1 año

  // elements
  const cards = Array.from(document.querySelectorAll(".card-estudio"));
  const modal = document.getElementById("modalDetalle");
  const closeModal = document.getElementById("closeModal");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalFecha = document.getElementById("modalFecha");
  const modalTipo = document.getElementById("modalTipo");
  const modalObservacion = document.getElementById("modalObservacion");
  const marcarRealizadoBtn = document.getElementById("marcarRealizado");
  const modalDescargar = document.getElementById("modalDescargar");
  const irTurnosBtn = document.getElementById("irTurnos");

  const filtroEstado = document.getElementById("filtroEstado");

  // carga estado guardado
  const storageKey = "misEstudiosEstado"; // guardará map id -> estado ('ok'|'warn'|'done')
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  }

  // función para actualizar clase según fecha
  function actualizarEstadoPorFecha(card) {
    const id = card.dataset.id;
    const iso = card.dataset.date;
    if (!iso) return;
    const d = parseDate(iso);
    const days = diffDays(d);

    // si ya lo marcó el usuario como 'done', respetar eso
    if (saved[id] === "done") {
      card.classList.remove("warn","ok");
      card.classList.add("done");
      card.querySelector(".estado").textContent = "✔ Realizado";
      return;
    }

    if (days >= ALERT_DAYS) {
      card.classList.remove("ok","done");
      card.classList.add("warn");
      card.querySelector(".estado").textContent = "⚠ Hace más de 1 año - Verificar";
      saved[id] = "warn";
    } else if (days >= WARN_DAYS) {
      card.classList.remove("warn","done");
      card.classList.add("warn");
      card.querySelector(".estado").textContent = "⚠ Recomendado repetir (6+ meses)";
      saved[id] = "warn";
    } else {
      card.classList.remove("warn","done");
      card.classList.add("ok");
      card.querySelector(".estado").textContent = "✔ Al día";
      saved[id] = "ok";
    }
  }

  // inicializar todos
  cards.forEach(card => {
    actualizarEstadoPorFecha(card);
  });
  saveState();

  // abrir modal con datos
  let activeCard = null;
  function openModal(card) {
    activeCard = card;
    const tipo = card.dataset.type || "Estudio";
    const iso = card.dataset.date;
    modalTitulo.textContent = card.querySelector("h3").textContent;
    modalFecha.textContent = iso ? ("Fecha registrada: " + iso) : "Fecha: no disponible";
    modalTipo.textContent = "Tipo: " + tipo;
    modalObservacion.textContent = "Observaciones: Este es un resumen simulado. Podés descargar un resumen o agendar un turno.";
    modal.classList.remove("hidden");
  }

  // attach click handlers: abrir detalle, descargar, agendar
  document.querySelectorAll(".btn-detail").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card-estudio");
      openModal(card);
    });
  });

  document.querySelectorAll(".btn-download").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card-estudio");
      descargarResumen(card);
    });
  });

  document.querySelectorAll(".btn-schedule").forEach(btn => {
    btn.addEventListener("click", (e) => {
      // redirigir a página de turnos
      window.location.href = "misTurnos.html";
    });
  });

  // modal actions
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  marcarRealizadoBtn.addEventListener("click", () => {
    if (!activeCard) return;
    const id = activeCard.dataset.id;
    saved[id] = "done";
    saveState();
    actualizarEstadoPorFecha(activeCard);
    modal.classList.add("hidden");
  });

  modalDescargar.addEventListener("click", () => {
    if (!activeCard) return;
    descargarResumen(activeCard);
  });

  irTurnosBtn.addEventListener("click", () => {
    window.location.href = "misTurnos.html";
  });

  // función para crear archivo resumen .txt (simulado)
  function descargarResumen(card) {
    const titulo = card.querySelector("h3").textContent;
    const fecha = card.dataset.date || "sin fecha";
    const estado = card.querySelector(".estado").textContent;
    const contenido = `Resumen del estudio: ${titulo}\nFecha: ${fecha}\nEstado: ${estado}\nGenerado: ${new Date().toLocaleString()}\n\nEste es un archivo generado localmente para la demostración.`;
    const blob = new Blob([contenido], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${titulo.replace(/\s+/g,'_')}_resumen.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // filtro simple por estado
  if (filtroEstado) {
    filtroEstado.addEventListener("change", () => {
      const val = filtroEstado.value; // "" | ok | warn
      cards.forEach(c => {
        if (!val) {
          c.style.display = "";
        } else {
          if (c.classList.contains(val)) c.style.display = "";
          else c.style.display = "none";
        }
      });
    });
  }

});