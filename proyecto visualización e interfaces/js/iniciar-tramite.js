function mostrarPaso(num) {
  // Ocultar todos los pasos
  document.getElementById("paso1").classList.add("d-none");
  document.getElementById("paso2").classList.add("d-none");
  document.getElementById("paso3").classList.add("d-none");

  // Mostrar el paso actual
  document.getElementById("paso" + num).classList.remove("d-none");

  // Actualizar barra de pasos
  setStep(num);
}

function setStep(stepNumber) {
  document.querySelectorAll(".step-item").forEach(step => {
    const number = parseInt(step.dataset.step);

    if (number === stepNumber) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

// Inicializa el paso 1
mostrarPaso(1);