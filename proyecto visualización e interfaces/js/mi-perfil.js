document.addEventListener("DOMContentLoaded", () => {
  const socioActivo = JSON.parse(localStorage.getItem("socioActivo"));

  document.getElementById("nombre").value = socioActivo.nombre;
  document.getElementById("dni").value = socioActivo.dni;
  document.getElementById("email").value = socioActivo.email;
  document.getElementById("plan").textContent = socioActivo.plan;
  document.getElementById("telefono").value = socioActivo.telefono;
  document.getElementById("direccion").value = socioActivo.direccion;
  document.getElementById("localidad").value = socioActivo.localidad;
});