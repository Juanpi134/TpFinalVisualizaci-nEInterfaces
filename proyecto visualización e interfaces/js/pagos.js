const modal = document.getElementById("modal");
const lista = document.getElementById("listaPagos");

function abrirModal() {
  modal.classList.remove("hidden");
}

function cerrarModal() {
  modal.classList.add("hidden");
}

function guardarPago() {
  const detalle = document.getElementById("detalle").value;
  const monto = document.getElementById("monto").value;

  if (!detalle || !monto) return;

  const hoy = new Date().toLocaleDateString("es-AR");

  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${hoy}</td>
    <td>${detalle}</td>
    <td>$${monto}</td>
    <td>PAGADO</td>
  `;

  lista.prepend(fila);

  cerrarModal();
}