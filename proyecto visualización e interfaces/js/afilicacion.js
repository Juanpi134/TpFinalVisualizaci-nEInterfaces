document.getElementById('formAfiliacion').addEventListener('submit', function(e) {
  e.preventDefault();

  const nuevoSocio = {
    id: `socio_${Date.now()}`,
    nombre: document.getElementById('nombre').value,
    dni: document.getElementById('dni').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    usuario: document.getElementById('usuario').value,
    password: document.getElementById('password').value,
    plan: document.querySelector('input[name="plan"]:checked').value,
    creado: new Date().toISOString()
  };

  // leer array existente
  const lista = JSON.parse(localStorage.getItem('sociosVidaMedList') || '[]');
  lista.push(nuevoSocio);
  localStorage.setItem('sociosVidaMedList', JSON.stringify(lista, null, 2));

  alert('Afiliación completada correctamente. Ahora podés ingresar con tu usuario.');
  window.location.href = 'socios.html';
});



function prefillRandomAffiliate(){
  const lista = JSON.parse(localStorage.getItem('sociosVidaMedList') || '[]');
  if (!lista.length) return alert('No hay socios en localStorage. Ejecutá el seed primero.');
  const r = lista[Math.floor(Math.random() * lista.length)];
  document.getElementById('nombre').value = r.nombre || '';
  document.getElementById('dni').value = r.dni || '';
  document.getElementById('email').value = r.email || '';
  document.getElementById('telefono').value = r.telefono || '';
  document.getElementById('usuario').value = r.usuario || '';
  document.getElementById('password').value = r.password || '';
  // elegir plan radio si existe
  const planInput = document.querySelector(`input[name="plan"][value="${r.plan}"]`);
  if(planInput) planInput.checked = true;
}