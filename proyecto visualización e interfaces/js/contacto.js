document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input, textarea");

  // 👉 Función para mostrar errores
  function mostrarError(campo, mensaje) {
    campo.classList.add("error");
    
    let error = campo.parentElement.querySelector(".error-msg");
    if (!error) {
      error = document.createElement("p");
      error.classList.add("error-msg");
      campo.parentElement.appendChild(error);
    }
    error.textContent = mensaje;
  }

  // 👉 Limpia los errores al escribir
  inputs.forEach(i => {
    i.addEventListener("input", () => {
      i.classList.remove("error");
      const error = i.parentElement.querySelector(".error-msg");
      if (error) error.remove();
    });
  });


  // 👉 Validación principal
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valido = true;

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const asunto = form.asunto.value.trim();
    const mensaje = form.mensaje.value.trim();

    // Nombre
    if (nombre.length < 3 || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(nombre)) {
      mostrarError(form.nombre, "Ingrese un nombre válido.");
      valido = false;
    }

    // Email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      mostrarError(form.email, "Ingrese un correo electrónico válido.");
      valido = false;
    }

    // Asunto
    if (asunto.length < 5) {
      mostrarError(form.asunto, "El asunto debe tener al menos 5 caracteres.");
      valido = false;
    }

    // Mensaje
    if (mensaje.length < 20) {
      mostrarError(form.mensaje, "El mensaje debe tener al menos 20 caracteres.");
      valido = false;
    }

    if (!valido) return;

    // 👉 Simulación de envío
    const boton = form.querySelector("button");
    boton.textContent = "Enviando...";
    boton.disabled = true;

    setTimeout(() => {
      alert("¡Mensaje enviado correctamente! Nuestro equipo te contactará pronto.");
      form.reset();
      boton.textContent = "Enviar mensaje";
      boton.disabled = false;
    }, 1500);
  });

});