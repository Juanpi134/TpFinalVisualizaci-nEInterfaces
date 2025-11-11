document.addEventListener("DOMContentLoaded", () => {
  const socioActivo = JSON.parse(localStorage.getItem("socioActivo"));
  if (!socioActivo) return (window.location.href = "socios.html");

  document.getElementById("nombreSocio").textContent = socioActivo.nombre;
  document.getElementById("idSocio").textContent = socioActivo.id || "0001";
  document.getElementById("planSocio").textContent = socioActivo.plan;
});