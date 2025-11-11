document.addEventListener("DOMContentLoaded", () => {
  const socioActivo = JSON.parse(localStorage.getItem("socioActivo"));

  if (!socioActivo) {
    window.location.href = "socios.html";
    return;
  }

  document.getElementById("nombreUsuario").textContent = socioActivo.nombre;
  document.getElementById("nombreBienvenida").textContent = socioActivo.nombre;
  document.getElementById("planUsuario").textContent = socioActivo.plan;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("socioActivo");
    window.location.href = "socios.html";
  });
});