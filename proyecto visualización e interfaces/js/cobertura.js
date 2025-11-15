// cobertura.js (versión revisada)
// Permite acceso público a la comprobación de cobertura.
// Si existe socioActivo, prerellena datos y habilita funciones privadas.
// Autor: VidaMed - refactor por ChatGPT

document.addEventListener("DOMContentLoaded", () => {
  // ---------- elementos ----------
  const form = document.getElementById("formCobertura");
  const resultado = document.getElementById("resultado");
  const mapaWrap = document.getElementById("mapaWrap");
  const btnContact = document.getElementById("btnContact");
  const contactModal = document.getElementById("contactModal");
  const formContact = document.getElementById("formContact");
  const cancelContact = document.getElementById("cancelContact");
  const openCredAnchor = document.getElementById("openCred"); // puede o no existir en el DOM

  // ---------- sesión (no redirigimos) ----------
  const socio = JSON.parse(localStorage.getItem("socioActivo") || "null");
  const isLogged = !!socio; // true si hay sesión

  // Si hay socio, prerellenar contacto
  const cNombre = document.getElementById("c_nombre");
  const cEmail = document.getElementById("c_email");
  if (cNombre && socio) cNombre.value = socio.nombre || "";
  if (cEmail && socio) cEmail.value = socio.email || "";

  // ---------- mocks de negocio ----------
  const coberturaMock = {
    "Buenos Aires": { status: "available", message: "Cobertura nacional completa en la mayoría de las ciudades." },
    "Ciudad Autónoma de Buenos Aires": { status: "available", message: "Cobertura completa en CABA." },
    "Córdoba": { status: "partial", message: "Cobertura parcial: algunas localidades con restricción." },
    "Santa Fe": { status: "partial", message: "Cobertura parcial: verificar CP específico." },
    "Mendoza": { status: "partial", message: "Cobertura parcial: puede requerir evaluación." },
    "Formosa": { status: "none", message: "Actualmente no contamos con cobertura completa en esa provincia." },
    "Otra": { status: "none", message: "Zona fuera de cobertura directa. Podemos ofrecer alternativas." }
  };

  const prestadoresMock = [
    { name: "Clínica Central Buenos Aires", lat: -34.6037, lon: -58.3816, province: "Buenos Aires" },
    { name: "Centro Médico Norte", lat: -34.5215, lon: -58.7000, province: "Buenos Aires" },
    { name: "Sanatorio Premium CBA", lat: -31.4201, lon: -64.1888, province: "Córdoba" },
    { name: "Hospital Santa Fe", lat: -31.6236, lon: -60.7006, province: "Santa Fe" },
    { name: "Clínica Mendoza", lat: -32.8908, lon: -68.8272, province: "Mendoza" }
  ];

  // ---------- mapa (Leaflet) ----------
  let map = null;
  let markers = [];

  function initMap(lat = -34.6037, lon = -58.3816, zoom = 5) {
    try {
      if (map) {
        map.setView([lat, lon], zoom);
        return;
      }
      map = L.map('map', { zoomControl: true }).setView([lat, lon], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    } catch (err) {
      // si Leaflet no cargó correctamente, ocultamos el contenedor de mapa
      console.warn("Leaflet no disponible:", err);
      const m = document.getElementById("map");
      if (m) m.style.display = "none";
    }
  }

  function clearMarkers() {
    if (!map) return;
    markers.forEach(m => map.removeLayer(m));
    markers = [];
  }

  function addPrestadores(prov) {
    if (!map) initMap();
    if (!map) return;
    clearMarkers();
    const list = prestadoresMock.filter(p => p.province === prov);
    if (list.length === 0) {
      // show fallback markers
      const fallback = prestadoresMock.slice(0, 2);
      map.setView([fallback[0].lat, fallback[0].lon], 6);
      fallback.forEach(p => {
        const marker = L.marker([p.lat, p.lon]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.province}`);
        markers.push(marker);
      });
    } else {
      map.setView([list[0].lat, list[0].lon], 11);
      list.forEach(p => {
        const marker = L.marker([p.lat, p.lon]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.province}`);
        markers.push(marker);
      });
    }
  }

  // ---------- lógica de cobertura ----------
  function checkCoverage(provincia, localidad) {
    const key = coberturaMock[provincia] ? provincia : "Otra";
    const info = coberturaMock[key];
    // Simulación extra con CP terminación en 0 -> parcial
    if (key !== "Otra" && localidad && localidad.match(/\d{4,}/) && localidad.trim().endsWith("0")) {
      return { status: "partial", message: "Código postal sujeto a evaluación." };
    }
    return info;
  }

  function renderResult(status, provincia, localidad, message) {
    if (!resultado) return;
    resultado.classList.remove("hidden");
    if (mapaWrap) mapaWrap.classList.remove("hidden");

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

    // re-attach handler for 'openCred' after render (to enforce login check)
    const openCred = document.getElementById("openCred");
    if (openCred) {
      openCred.addEventListener("click", (e) => {
        if (!isLogged) {
          e.preventDefault();
          const go = confirm("Para ver tu credencial debés iniciar sesión. ¿Querés ir al área de socios?");
          if (go) window.location.href = "socios.html";
        } // if logged, anchor sigue a credencial.html
      });
    }

    // inicializar mapa y prestadores
    setTimeout(() => {
      initMap();
      addPrestadores(provincia);
    }, 180);
  }

  // ---------- handlers ----------
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const prov = document.getElementById("provincia")?.value;
      const loc = document.getElementById("localidad")?.value?.trim();
      if (!prov || !loc) {
        alert("Por favor completá provincia y localidad / código postal.");
        return;
      }
      const res = checkCoverage(prov, loc);
      renderResult(res.status, prov, loc, res.message);
      // scrollear al resultado
      setTimeout(() => {
        resultado?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    });
  }

  if (btnContact) {
    btnContact.addEventListener("click", () => {
      // mostramos el formulario de contacto (funciona también sin login)
      if (contactModal) {
        contactModal.classList.remove("hidden");
        contactModal.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  if (cancelContact) {
    cancelContact.addEventListener("click", () => {
      if (contactModal) contactModal.classList.add("hidden");
    });
  }

  if (formContact) {
    formContact.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("c_nombre")?.value?.trim();
      const email = document.getElementById("c_email")?.value?.trim();
      const tel = document.getElementById("c_tel")?.value?.trim();
      const msg = document.getElementById("c_msg")?.value?.trim();

      if (!nombre || !email) {
        alert("Completá nombre y email para que el asesor pueda contactarte.");
        return;
      }

      const reqs = JSON.parse(localStorage.getItem("coberturaRequests") || "[]");
      const newReq = {
        id: "req_" + Date.now(),
        nombre,
        email,
        telefono: tel || null,
        msg: msg || null,
        fecha: new Date().toISOString(),
        socio: socio?.email || null
      };
      reqs.push(newReq);
      localStorage.setItem("coberturaRequests", JSON.stringify(reqs, null, 2));

      alert("Solicitud enviada. Un asesor se comunicará a la brevedad.");
      if (contactModal) contactModal.classList.add("hidden");
    });
  }

  // Si ya existe un 'resultado' (por ejemplo guardado o recarga), no hacemos nada extra.
  // (Opcional) podríamos restaurar último resultado desde session/localStorage si se desea.

  // ---------- recomendación: habilitar botones privados ----------
  // Algunos botones (ver credencial, acciones de afiliación interna) deben pedir login:
  // - Ya implementamos check en openCred al renderizar resultado.
  // - Si tenés otros botones globales que requieren login, podés aplicar la misma lógica:
  //     document.querySelectorAll('.requires-login').forEach(btn => { ... })

}); // DOMContentLoaded