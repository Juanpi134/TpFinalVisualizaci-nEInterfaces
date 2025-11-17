document.addEventListener("DOMContentLoaded", () => {
  const socioActivo = JSON.parse(localStorage.getItem("socioActivo"));

  // Si no hay sesión activa → volver al login
  if (!socioActivo) {
    window.location.href = "socios.html";
    return;
  }

  // Mostrar datos del socio activo
  document.getElementById("nombreUsuario").textContent = socioActivo.nombre;
  document.getElementById("nombreBienvenida").textContent = socioActivo.nombre;
  document.getElementById("planUsuario").textContent = socioActivo.plan;
});

function cerrarSesion() {
  window.location.href = "index.html";
}