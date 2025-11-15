// cobertura.js
// Manejo de la lógica de "cobertura" + mapa + contacto
document.addEventListener("DOMContentLoaded", () => {
  // Elementos
  const form = document.getElementById("formCobertura");
  const resultado = document.getElementById("resultado");
  const mapaWrap = document.getElementById("mapaWrap");
  const btnContact = document.getElementById("btnContact");
  const contactModal = document.getElementById("contactModal");
  const formContact = document.getElementById("formContact");
  const cancelContact = document.getElementById("cancelContact");

  // Verificar sesión (socioActivo). Si no hay, redirigir a login (socios.html)
  const socio = JSON.parse(localStorage.getItem("socioActivo") || "null");
  if (!socio) {
    // opcional: podés mostrar un modal, pero aquí redirigimos
    window.location.href = "socios.html";
    return;
  }

  // Prefill contacto con datos del socio (si existen)
  const cNombre = document.getElementById("c_nombre");
  const cEmail = document.getElementById("c_email");
  if (cNombre) cNombre.value = socio.nombre || "";
  if (cEmail) cEmail.value = socio.email || "";

  // Datos simulados de cobertura por provincia/localidad
  // status: "available" | "partial" | "none"
  const coberturaMock = {
    "Buenos Aires": { status: "available", message: "Cobertura nacional completa en la mayoría de las ciudades." },
    "Ciudad Autónoma de Buenos Aires": { status: "available", message: "Cobertura completa en CABA." },
    "Córdoba": { status: "partial", message: "Cobertura parcial: algunas localidades con restricción." },
    "Santa Fe": { status: "partial", message: "Cobertura parcial: verificar CP específico." },
    "Mendoza": { status: "partial", message: "Cobertura parcial: puede requerir evaluación." },
    "Formosa": { status: "none", message: "Actualmente no contamos con cobertura completa en esa provincia." },
    "Otra": { status: "none", message: "Zona fuera de cobertura directa. Podemos ofrecer alternativas." }
  };

  // Prestadores simulados (lat,lng) por provincia/localidad (ejemplos)
  const prestadoresMock = [
    { name: "Clínica Central Buenos Aires", lat: -34.6037, lon: -58.3816, province: "Buenos Aires" },
    { name: "Centro Médico Norte", lat: -34.5215, lon: -58.7000, province: "Buenos Aires" },
    { name: "Sanatorio Premium CBA", lat: -31.4201, lon: -64.1888, province: "Córdoba" },
    { name: "Hospital Santa Fe", lat: -31.6236, lon: -60.7006, province: "Santa Fe" },
    { name: "Clínica Mendoza", lat: -32.8908, lon: -68.8272, province: "Mendoza" }
  ];

  // Inicializar mapa (sin centrado) solo cuando haga falta
  let map, markers = [];

  function initMap(lat = -34.6037, lon = -58.3816, zoom = 5) {
    if (map) {
      map.setView([lat, lon], zoom);
      return;
    }
    map = L.map('map', { zoomControl: true }).setView([lat, lon], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  function addPrestadores(prov, qLocal) {
    if (!map) initMap();
    clearMarkers();
    const list = prestadoresMock.filter(p => p.province === prov);
    if (list.length === 0) {
      // agregar algunos cercanos genéricos
      const fallback = prestadoresMock.slice(0, 2);
      fallback.forEach(p => {
        const marker = L.marker([p.lat, p.lon]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.province}`);
        markers.push(marker);
      });
    } else {
      // centrar al primero y agregar todos
      map.setView([list[0].lat, list[0].lon], 11);
      list.forEach(p => {
        const marker = L.marker([p.lat, p.lon]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.province}`);
        markers.push(marker);
      });
    }
  }

  // Lógica para determinar disponibilidad (simulada)
  function checkCoverage(provincia, localidad) {
    const key = coberturaMock[provincia] ? provincia : "Otra";
    const info = coberturaMock[key];
    // Extra: si localidad incluye número de CP y termina en 0 -> parcial (simulación)
    const lc = (localidad || "").toLowerCase();
    if (key !== "Otra" && lc.match(/\d{4,}/)) {
      // si CP terminado en 0 => parcial (sim)
      if (localidad.trim().endsWith("0")) {
        return { status: "partial", message: "Código postal sujeto a evaluación." };
      }
    }
    return info;
  }

  // Render de resultado
  function renderResult(status, provincia, localidad, message) {
    resultado.classList.remove("hidden");
    mapaWrap.classList.remove("hidden");

    const badgeClass = status === "available" ? "available" : status === "partial" ? "partial" : "none";
    const badgeText = status === "available" ? "Cobertura disponible" : status === "partial" ? "Cobertura parcial" : "Sin cobertura";

    resultado.innerHTML = `
      <div class="status">
        <div>
          <h2>${badgeText}</h2>
          <p style="color:var(--gris); margin-top:6px;">Provincia: <strong>${provincia}</strong> · Localidad: <strong>${localidad}</strong></p>
          <p style="margin-top:8px; color:var(--gris);">${message}</p>
        </div>
        <div>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
      </div>

      <div class="result-block">
        <div class="left">
          <h3>Compatibilidad por plan</h3>
          <div class="plans">
            <div class="plan-card">
              <h4>Plan Esencial</h4>
              <p>${status === "available" ? "Cobertura base" : status === "partial" ? "Cobertura limitada" : "No disponible"}</p>
            </div>
            <div class="plan-card">
              <h4>Plan Plus</h4>
              <p>${status === "available" ? "Cobertura ampliada" : status === "partial" ? "Cobertura parcial con evaluación" : "No disponible"}</p>
            </div>
            <div class="plan-card">
              <h4>Plan Premium</h4>
              <p>${status === "available" ? "Cobertura completa + prioridad" : status === "partial" ? "Consultar" : "No disponible"}</p>
            </div>
          </div>

          <div style="margin-top:14px;">
            <a href="afiliacion.html" class="btn btn-outline">Iniciar afiliación</a>
            <a href="planes.html" class="btn btn-primary">Ver planes</a>
          </div>
        </div>

        <div class="right">
          <div class="panel">
            <h4>Resumen rápido</h4>
            <p style="color:var(--gris); margin:6px 0 12px;">${message}</p>
            <p style="font-weight:700;">Sugerencia: ${status === "available" ? "Podés afiliarte o consultar al asesor." : status === "partial" ? "Solicitá verificación técnica." : "Solicitá contacto para alternativas."}</p>
            <div style="margin-top:12px;">
              <a id="openCred" href="credencial.html" class="btn btn-outline">Ver credencial</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inicializar mapa con prestadores según la provincia
    setTimeout(() => {
      initMap(); // crea si no existe
      addPrestadores(provincia, localidad);
    }, 200);

  }

  // Form submit
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const prov = document.getElementById("provincia").value;
    const loc = document.getElementById("localidad").value.trim();
    if (!prov || !loc) return alert("Completá provincia y localidad/CP.");

    const res = checkCoverage(prov, loc);
    renderResult(res.status, prov, loc, res.message);
    window.scrollTo({ top: resultado.offsetTop - 30, behavior: "smooth" });
  });

  // Contact modal open
  btnContact.addEventListener("click", () => {
    contactModal.classList.remove("hidden");
    contactModal.scrollIntoView({ behavior: "smooth" });
  });

  cancelContact.addEventListener("click", () => {
    contactModal.classList.add("hidden");
  });

  // Submit contact form -> guarda en localStorage (simulación de envío)
  formContact.addEventListener("submit", (e) => {
    e.preventDefault();
    const reqs = JSON.parse(localStorage.getItem("coberturaRequests") || "[]");
    const newReq = {
      id: "req_" + Date.now(),
      nombre: document.getElementById("c_nombre").value.trim(),
      email: document.getElementById("c_email").value.trim(),
      telefono: document.getElementById("c_tel").value.trim(),
      msg: document.getElementById("c_msg").value.trim(),
      fecha: new Date().toISOString(),
      socio: socio && socio.email ? socio.email : null
    };
    reqs.push(newReq);
    localStorage.setItem("coberturaRequests", JSON.stringify(reqs, null, 2));
    alert("Solicitud enviada. Un asesor se comunicará a la brevedad.");
    contactModal.classList.add("hidden");
  });

}); // DOMContentLoaded
