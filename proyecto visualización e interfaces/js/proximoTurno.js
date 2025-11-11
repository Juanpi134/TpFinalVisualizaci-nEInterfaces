document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".btn").addEventListener("click", () => {
    if (confirm("¿Desea cancelar el turno?")) {
      alert("Turno cancelado correctamente.");
      window.location.href = "misTurnos.html";
    }
  });
});