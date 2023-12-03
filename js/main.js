// Funciones

// Nombres de los productos

function obtenerNombresProductos(productos) {
    const nombres = productos.map(producto => producto.nombre);
    return nombres.join(', ')
}

// Función para renderizar una tarjeta de producto y agregarla al DOM

function renderizarProductos(producto) {
    const contenedorColumna = document.createElement("div");
    contenedorColumna.classList.add("col-md-4");

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("card", "m-4");
    tarjeta.style.width = "18rem";

    const titulo = document.createElement("h3");
    titulo.classList.add("text-center");
    titulo.textContent = producto.nombre;

    const lista = document.createElement("ul");
    lista.classList.add("list-group", "list-group-flush");

    const categoriaItem = crearListItem("Categoría", producto.categoria);
    const stockItem = crearStockItem(producto);
    const precioItem = crearListItem("Precio", "$" + producto.precio);

    lista.append(categoriaItem, stockItem, precioItem);

    const botones = document.createElement("div");
    botones.classList.add("d-flex", "align-items-center");

    const botonQuitar = crearBotonQuitar(producto);

    botones.append(botonQuitar);

    tarjeta.append(titulo, lista, botones);
    contenedorColumna.append(tarjeta);

    return contenedorColumna;
}

function crearListItem(label, value) {
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    item.innerHTML = `<strong>${label}:</strong> ${value}`;
    return item;
}

function crearStockItem(producto) {
    const stockItem = document.createElement("li");
    stockItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    const label = document.createElement("span");
    label.innerHTML = "<strong>Stock:</strong>";

    const stockInput = document.createElement("input");
    stockInput.type = "number";
    stockInput.value = producto.stock;
    stockInput.classList.add("form-control", "m-1");
    stockInput.addEventListener("change", (event) => {
        const nuevoStock = parseInt(event.target.value);
        actualizarStock(producto, nuevoStock);
    });

    stockItem.append(label, stockInput);

    return stockItem;
}

function crearBotonQuitar(producto) {
    const botonQuitar = document.createElement("button");
    botonQuitar.classList.add("btn", "btn-info", "mt-2", "mb-2", "m-auto");
    botonQuitar.textContent = "Quitar del inventario";
    botonQuitar.addEventListener("click", () => {
        const contenedorColumna = botonQuitar.closest(".col-md-4");
        if (contenedorColumna) {
            contenedorColumna.remove();
            productos = productos.filter(prod => prod.nombre !== producto.nombre);
            guardarProductosEnLocalStorage();
        }
    });

    return botonQuitar;
}

// Función para agregar un producto al DOM

function agregarProductoAlDOM(producto) {
    const contenedorRow = document.querySelector(".contenedor.row");
    const columna = renderizarProductos(producto);
    contenedorRow.append(columna);
}

// Función para guardar los productos

function guardarProductosEnLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Función para obtener productos desde LocalStorage

function obtenerProductosDesdeLocalStorage() {
    const productosGuardados = localStorage.getItem("productos");
    return productosGuardados ? JSON.parse(productosGuardados) : [];
}

//Función para actualizar el stock

function actualizarStock(producto, nuevoStock) {
    producto.stock = nuevoStock;

    if (nuevoStock === 0) {

        // Eliminar el producto del array y actualizar localStorage

        productos = productos.filter(prod => prod.nombre !== producto.nombre);

        guardarProductosEnLocalStorage();

        // Eliminar el elemento del DOM

        const contenedorColumna = document.getElementById(producto.nombre);
        if (contenedorColumna) {
            contenedorColumna.remove();
        }
    } else {

        // Actualizar localStorage con el nuevo stock

        guardarProductosEnLocalStorage();
    }
}

// Constructor del objeto Producto

class Producto {
    constructor(nombre, categoria, stock, precio) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.stock = stock;
        this.precio = precio;
    }
}

// Creación de array de productos

let productos = [];

// Función para guardar los productos en localStorage

function guardarProductosEnLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Función para obtener productos desde LocalStorage

function obtenerProductosDesdeLocalStorage() {
    const productosGuardados = localStorage.getItem("productos");
    return productosGuardados ? JSON.parse(productosGuardados) : [];
}

// Lista inicial de productos en la consola

for (const producto of productos) {
    console.log(producto.nombre);
}

/*
/ Ejecución del programa
*/

// Agregar un nuevo producto

const agregarProducto = async () => {
    let respuesta = '';

    while (true) {
        respuesta = await Swal.fire({
            title: '¿Desea agregar un nuevo producto?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });

        if (respuesta.isConfirmed) {
            let nombre = '';
            let categoria = '';
            let stock = NaN;
            let precio = NaN;

            while (!nombre) {
                const { value: inputNombre } = await Swal.fire({
                    title: 'Ingrese el nombre del producto',
                    input: 'text',
                    inputPlaceholder: 'Nombre del producto',
                    inputValidator: (value) => {
                        if (!value) {
                            return '¡El nombre es requerido!';
                        }
                    }
                });
                nombre = inputNombre;
            }

            while (!categoria) {
                const { value: inputCategoria } = await Swal.fire({
                    title: 'Ingrese la categoría del producto',
                    input: 'text',
                    inputPlaceholder: 'Categoría del producto',
                    inputValidator: (value) => {
                        if (!value) {
                            return '¡La categoría es requerida!';
                        }
                    }
                });
                categoria = inputCategoria;
            }

            while (isNaN(stock) || stock < 0) {
                const { value: inputStock } = await Swal.fire({
                    title: 'Ingrese la cantidad de productos en stock',
                    input: 'number',
                    inputPlaceholder: 'Cantidad en stock',
                    inputValidator: (value) => {
                        if (isNaN(value) || value < 0) {
                            return '¡Ingrese un número válido y mayor o igual a cero!';
                        }
                    }
                });
                stock = parseFloat(inputStock);
            }

            while (isNaN(precio) || precio < 0) {
                const { value: inputPrecio } = await Swal.fire({
                    title: 'Ingrese el precio del producto',
                    input: 'number',
                    inputPlaceholder: 'Precio del producto',
                    inputValidator: (value) => {
                        if (isNaN(value) || value < 0) {
                            return '¡Ingrese un número válido y mayor o igual a cero!';
                        }
                    }
                });
                precio = parseFloat(inputPrecio);
            }

            const producto = new Producto(nombre, categoria, stock, precio);
            productos.push(producto);

            await Swal.fire({
                icon: 'success',
                title: '¡Hecho!',
                text: 'Producto agregado correctamente.',
            });

            // Actualizar el DOM con el nuevo producto
            agregarProductoAlDOM(producto);
        } else {
            break; // Cortar el bucle
        }
    }

    // Guardar productos en el almacenamiento local
    guardarProductosEnLocalStorage();
};

document.getElementById("btnIngresarProductos").addEventListener("click", agregarProducto);

// Crear las tarjetas de productos

const contenedorRow = document.createElement("div");
contenedorRow.classList.add("row");

// Agregar tarjetas al DOM

for (const producto of productos) {
    const columna = renderizarProductos(producto);
    contenedorRow.append(columna);
}

// Buscar el contenedor existente o crear uno nuevo

const contenedorPrincipal = document.querySelector(".contenedor") || document.createElement("div");
contenedorPrincipal.classList.add("contenedor", "row"); // Asegurarse de tener la clase "row"

// Agregar tarjetas al contenedor principal

for (const producto of productos) {
    const columna = renderizarProductos(producto);
    contenedorPrincipal.append(columna);
}

/**  
 * Modo Noche
 */

document.addEventListener("DOMContentLoaded", function () {
    const botonModoNocturno = document.getElementById("modoNocturno");
    const botonModoDiurno = document.getElementById("modoDiurno");
    const body = document.body;

    // Recuperar el modo actual desde localStorage

    const modoActual = localStorage.getItem("modo");

    // Aplicar el modo actual

    if (modoActual === "modo-nocturno") {
        body.classList.add("modo-nocturno");
    } else if (modoActual === "modo-diurno") {
        body.classList.add("modo-diurno");
    }

    botonModoNocturno.addEventListener("click", function () {
        body.classList.add("modo-nocturno");
        body.classList.remove("modo-diurno");

        // Guardar el modo actual en localStorage
        localStorage.setItem("modo", "modo-nocturno");
    });

    botonModoDiurno.addEventListener("click", function () {
        body.classList.add("modo-diurno");
        body.classList.remove("modo-nocturno");

        // Guardar el modo actual en localStorage
        localStorage.setItem("modo", "modo-diurno");
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        let cargaInicialRealizada = localStorage.getItem('cargaInicialRealizada');

        if (!cargaInicialRealizada) {
            const response = await fetch('https://hechersen.github.io/HernandezHectorInventarioOnline/productos.json');
            if (!response.ok) {
                throw new Error('Error al obtener los datos del servidor.');
            }
            const productosDesdeJSON = await response.json();

            // Crear instancias de Producto y agregarlos al array de productos existentes
            productosDesdeJSON.forEach(producto => {
                const nuevoProducto = new Producto(producto.nombre, producto.categoria, producto.stock, producto.precio);
                productos.push(nuevoProducto);
                // Agregar el producto al DOM
                agregarProductoAlDOM(nuevoProducto);
            });

            // Guardar los productos en localStorage
            guardarProductosEnLocalStorage();

            // Marcar la carga inicial como realizada
            localStorage.setItem('cargaInicialRealizada', 'true');
        } else {
            // Si la carga inicial ya se ha realizado, cargar los productos desde localStorage
            productos = obtenerProductosDesdeLocalStorage();
            // Renderizar los productos existentes en el DOM
            productos.forEach(producto => {
                agregarProductoAlDOM(producto);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        // Mensaje de error
    }    
    console.log(productos);
});

















