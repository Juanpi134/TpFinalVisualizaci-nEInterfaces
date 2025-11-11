// js/login.js
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const usuarioInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  const lista = JSON.parse(localStorage.getItem("sociosVidaMedList") || "[]");
  const socio = lista.find(
    u => u.email === usuarioInput || u.usuario === usuarioInput || u.dni === usuarioInput
  );

  if (!socio) {
    alert("Socio no encontrado.");
    return;
  }
  if (socio.password !== passwordInput) {
    alert("Contraseña incorrecta.");
    return;
  }

  // Guardar sesión (simulación)
  localStorage.setItem("socioActivo", JSON.stringify({
    id: socio.id,
    nombre: socio.nombre,
    plan: socio.plan,
    email: socio.email
  }));

  // Redirigir al panel / home del socio
  window.location.href = "socioHome.html";
});