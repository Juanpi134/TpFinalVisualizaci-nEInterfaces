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

  // Botón cerrar sesión
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("socioActivo");
    window.location.href = "socios.html";
  });

  // Navegación hacia otras páginas del socio
  document.getElementById("btnTurnos").addEventListener("click", () => {
    window.location.href = "misTurnos.html";
  });

  document.getElementById("btnCredencial").addEventListener("click", () => {
    window.location.href = "credencial.html";
  });

  document.getElementById("btnProximoTurno").addEventListener("click", () => {
    window.location.href = "proximoTurno.html";
  });
});