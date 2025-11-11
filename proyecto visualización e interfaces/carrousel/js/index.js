document.querySelectorAll(".carrousel").forEach(carrousel => {
    //Selecciona todos los elementos del HTML que tengan la clase carrousel.
    //obtenemos ahora cada elemento que tenga la clase item
    //es una lista de elementos
    const items = carrousel.querySelectorAll('.carrousel__item');

    //estamos creando un array de tres elementos
    const buttonsHTML = Array.from(items, () => {
        //retornaremos un nuevo html string
        return `<span class="carrousel__button"></span>`
    });

    carrousel.insertAdjacentHTML("beforeend",`
        <div class="carrousel__nav">
        ${buttonsHTML.join("")}
        </div>
        `);
    
    const buttons = carrousel.querySelectorAll(".carrousel__button");

    buttons.forEach((button,index) =>{
    //recorremos cada botton con su elemento botón y su índice
    //button refiere al actual boton, index refiere 0,1,2
    button.addEventListener("click", () =>{
        //un select all the items
        items.forEach(item => item.classList.remove("carrousel__item__selected"));
        buttons.forEach(button => button.classList.remove("carrousel__button__selected"));

        items[index].classList.add("carrousel__item__selected");
        button.classList.add("carrousel__button__selected");
    })
})
//select the first item on page load
items[0].classList.add("carrousel__item__selected");
buttons[0].classList.add("carrousel__button__selected");
})
