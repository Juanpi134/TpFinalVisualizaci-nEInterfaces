let index = 0;
const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

function mostrarSlide(i) {
  slides.forEach((slide, idx) => {
    slide.classList.remove("active");
    if (idx === i) slide.classList.add("active");
  });
}

next.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  mostrarSlide(index);
});

prev.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  mostrarSlide(index);
});

// Cambio automático
setInterval(() => {
  index = (index + 1) % slides.length;
  mostrarSlide(index);
}, 6000);