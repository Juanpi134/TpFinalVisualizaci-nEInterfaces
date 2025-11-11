// Datos simulados de prestadores
const prestadores = [
  { nombre: "Dra. Laura Pérez", especialidad: "Pediatría", localidad: "Córdoba Capital" },
  { nombre: "Dr. Martín Gómez", especialidad: "Cardiología", localidad: "Villa María" },
  { nombre: "Clínica Salud Total", especialidad: "Clínica general", localidad: "Rosario" },
  { nombre: "Dr. Juan López", especialidad: "Traumatología", localidad: "Córdoba Capital" },
  { nombre: "Centro Médico Norte", especialidad: "Diagnóstico por imagen", localidad: "Buenos Aires" },
  { nombre: "Dra. Ana Morales", especialidad: "Dermatología", localidad: "Mendoza" },
  { nombre: "Hospital Central Vida", especialidad: "Emergencias", localidad: "San Luis" }
];

const listaPrestadores = document.getElementById('listaPrestadores');
const busqueda = document.getElementById('busqueda');

// Función para mostrar prestadores
function mostrarPrestadores(lista) {
  listaPrestadores.innerHTML = '';

  if (lista.length === 0) {
    listaPrestadores.innerHTML = '<p class="sin-resultados">No se encontraron prestadores.</p>';
    return;
  }

  lista.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('prestador-card');
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p><strong>Especialidad:</strong> ${p.especialidad}</p>
      <p><strong>Localidad:</strong> ${p.localidad}</p>
    `;
    listaPrestadores.appendChild(card);
  });
}

// Mostrar todos al inicio
mostrarPrestadores(prestadores);

// Filtro en tiempo real
busqueda.addEventListener('input', () => {
  const texto = busqueda.value.toLowerCase();
  const filtrados = prestadores.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.especialidad.toLowerCase().includes(texto) ||
    p.localidad.toLowerCase().includes(texto)
  );
  mostrarPrestadores(filtrados);
});