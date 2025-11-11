// Usuarios preexistentes
const usuariosIniciales = [
  {
    nombre: "Juan Pérez",
    dni: "12345678",
    email: "juanperez@mail.com",
    password: "1234",
    plan: "Plan Esencial"
  },
  {
    nombre: "María López",
    dni: "87654321",
    email: "marialopez@mail.com",
    password: "abcd",
    plan: "Plan Plus"
  },
  {
    nombre: "Carlos Gómez",
    dni: "22334455",
    email: "carlosg@mail.com",
    password: "pass2024",
    plan: "Plan Premium"
  }
];

// Cargar usuarios iniciales si no hay ninguno
if (!localStorage.getItem("sociosVidaMedList")) {
  localStorage.setItem("sociosVidaMedList", JSON.stringify(usuariosIniciales));
}

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const usuarioInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  const lista = JSON.parse(localStorage.getItem("sociosVidaMedList") || "[]");

  const socio = lista.find(
    u => u.email === usuarioInput || u.dni === usuarioInput
  );

  if (!socio) {
    alert("Socio no encontrado.");
    return;
  }

  if (socio.password !== passwordInput) {
    alert("Contraseña incorrecta.");
    return;
  }

  localStorage.setItem("socioActivo", JSON.stringify(socio));

  alert(`Bienvenido, ${socio.nombre}!`);
  window.location.href = "socioHome.html";
});