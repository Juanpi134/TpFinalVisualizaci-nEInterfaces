document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tituloCategoria = urlParams.get('titulo');
    const subtituloEl = document.getElementById('subtitulo-cartilla');
    if (tituloCategoria && subtituloEl) {
        subtituloEl.textContent = `Listado de ${tituloCategoria}`;
    }
});