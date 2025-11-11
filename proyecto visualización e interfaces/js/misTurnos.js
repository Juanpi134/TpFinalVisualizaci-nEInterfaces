document.addEventListener("DOMContentLoaded", () => {
  const socioActivo = JSON.parse(localStorage.getItem("socioActivo"));
  if (!socioActivo) return (window.location.href = "socios.html");

  document.getElementById("nombreUsuario").textContent = socioActivo.nombre;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("socioActivo");
    window.location.href = "socios.html";
  });

  // Simulación de turnos
  const turnos = [
    { fecha: "2025-11-12", hora: "10:30", profesional: "Dr. Fernández", especialidad: "Clínica Médica", estado: "Próximo" },
    { fecha: "2025-10-18", hora: "15:00", profesional: "Dra. López", especialidad: "Dermatología", estado: "Completado" },
  ];

  const contenedor = document.getElementById("turnosContainer");
  turnos.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("turno-card");
    div.innerHTML = `
      <h3>${t.profesional}</h3>
      <p><strong>Especialidad:</strong> ${t.especialidad}</p>
      <p><strong>Fecha:</strong> ${t.fecha} - ${t.hora}</p>
      <p><strong>Estado:</strong> ${t.estado}</p>
    `;
    contenedor.appendChild(div);
  });
});