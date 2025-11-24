// js/login.js

// 🔹 Función para inicializar usuarios de ejemplo si no existen
function inicializarUsuarios() {
  if (!localStorage.getItem("sociosVidaMedList")) {
    const usuariosIniciales = [
      { id: 1, nombre: "Juan Pérez", dni: "12345678", email: "juanperez@mail.com", usuario: "juanperez", password: "1234", plan: "Plan Esencial" },
      { id: 2, nombre: "María López", dni: "87654321", email: "marialopez@mail.com", usuario: "marialopez", password: "abcd", plan: "Plan Plus" },
      { id: 3, nombre: "Carlos Gómez", dni: "22334455", email: "a", usuario: "carlosg", password: "a", plan: "Plan Premium" },
      
    ];
    localStorage.setItem("sociosVidaMedList", JSON.stringify(usuariosIniciales));
  }
}

// 🔹 Llamar al inicializador
inicializarUsuarios();

// 🔹 Manejar el envío del formulario
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const usuarioInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  if (!usuarioInput || !passwordInput) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Recuperar lista de socios desde localStorage
  const lista = JSON.parse(localStorage.getItem("sociosVidaMedList")) || [];

  // Buscar por email, usuario o DNI
  const socio = lista.find(
    u => u.email === usuarioInput || u.usuario === usuarioInput || u.dni === usuarioInput
  );

  if (!socio) {
    alert("❌ Socio no encontrado.");
    return;
  }

  if (socio.password !== passwordInput) {
    alert("🔒 Contraseña incorrecta.");
    return;
  }

  // 🔹 Guardar sesión activa
  localStorage.setItem("socioActivo", JSON.stringify({
    id: socio.id,
    nombre: socio.nombre,
    plan: socio.plan,
    email: socio.email,
    dni: socio.dni
  }));

  // 🔹 Redirigir al home del socio
  window.location.href = "socioHome.html";
});