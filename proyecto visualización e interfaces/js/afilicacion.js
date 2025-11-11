document.getElementById('formAfiliacion').addEventListener('submit', function(e) {
  e.preventDefault();

  const nuevoSocio = {
    nombre: document.getElementById('nombre').value,
    dni: document.getElementById('dni').value,
    email: document.getElementById('email').value,
    usuario: document.getElementById('usuario').value,
    password: document.getElementById('password').value,
    plan: document.querySelector('input[name="plan"]:checked').value
  };

  // Guardamos en localStorage (simula registro)
  localStorage.setItem('socioVidaMed', JSON.stringify(nuevoSocio));

  alert('Afiliación completada correctamente. Ahora podés ingresar con tu usuario.');
  window.location.href = 'socios.html';
});