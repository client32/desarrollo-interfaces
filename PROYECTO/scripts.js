document.addEventListener('DOMContentLoaded', () => {
    const urlApi = 'https://products-foniuhqsba-uc.a.run.app/TVs';
    let productos = [];
    const carrito = [];

    const contenedorProductos = document.getElementById('products-grid');
    const botonCarrito = document.getElementById('cart-container');
    const contadorCarrito = document.getElementById('cart-count');
    const popupCarrito = document.getElementById('cart-popup');
    const botonCerrarPopupCarrito = document.getElementById('close-cart-popup');
    const contenedorItemsCarrito = document.getElementById('cart-items');
    const totalCarrito = document.getElementById('cart-total');
    const botonActualizarCarrito = document.getElementById('update-cart');
    const botonPagar = document.getElementById('checkout');
    const popupDetalleProducto = document.getElementById('product-detail-popup');
    const tituloDetalleProducto = document.getElementById('product-detail-title');
    const imagenDetalleProducto = document.getElementById('product-detail-image');
    const descripcionDetalleProducto = document.getElementById('product-detail-description');
    const precioDetalleProducto = document.getElementById('product-detail-price');
    const campoCantidad = document.getElementById('quantity');
    const botonAgregarCarritoDetalle = document.getElementById('add-to-cart-detail');
    const botonCerrarPopup = document.getElementById('close-popup');
    const mensajeAgregarCarrito = document.getElementById('add-to-cart-message');
    const botonAlternarVista = document.getElementById('view-toggle');

    // Variable para rastrear el estado de la cuadrícula (columna única o múltiple)
    let esColumnaUnica = false;

    // Obtener productos desde la API
    fetch(urlApi)
        .then(response => response.json())
        .then(data => {
            productos = data;
            renderizarProductos();
        })
        .catch(error => console.error('Error al obtener productos:', error));

    // Renderizar productos
    function renderizarProductos() {
        contenedorProductos.innerHTML = '';
        productos.forEach(producto => {
            const tarjetaProducto = document.createElement('div');
            tarjetaProducto.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-xl', 'transition-all');
            tarjetaProducto.innerHTML = `
                <img src="${producto.image}" alt="${producto.title}" class="w-full h-48 object-cover mb-4 rounded-md">
                <h3 class="font-semibold text-lg text-gray-800">${producto.title}</h3>
                <p class="text-gray-600 text-sm">Código: ${producto.id}</p>
                <p class="font-semibold text-xl text-blue-600">${producto.price}</p>
                <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" data-id="${producto.id}">Ver detalles</button>
            `;
            const botonDetalle = tarjetaProducto.querySelector('button');
            botonDetalle.addEventListener('click', () => mostrarDetalleProducto(producto));
            contenedorProductos.appendChild(tarjetaProducto);
        });
    }

    // Mostrar detalles del producto en el popup
    function mostrarDetalleProducto(producto) {
        tituloDetalleProducto.textContent = producto.title;
        imagenDetalleProducto.src = producto.image;
        descripcionDetalleProducto.textContent = producto.description;
        precioDetalleProducto.textContent = `${producto.price}`;
        campoCantidad.value = 1; // Reiniciar la cantidad a 1 por defecto
        tituloDetalleProducto.dataset.id = producto.id; // Guardar el ID del producto en el dato del título
        popupDetalleProducto.classList.remove('hidden');
    }

    // Cerrar el popup de detalles del producto
    botonCerrarPopup.addEventListener('click', () => {
        popupDetalleProducto.classList.add('hidden');
    });

    // Agregar al carrito desde el popup de detalles
    botonAgregarCarritoDetalle.addEventListener('click', () => {
        const cantidad = parseInt(campoCantidad.value);
        agregarAlCarrito(tituloDetalleProducto.textContent, imagenDetalleProducto.src, precioDetalleProducto.textContent, cantidad, tituloDetalleProducto.dataset.id);
        mensajeAgregarCarrito.classList.remove('hidden');
        setTimeout(() => mensajeAgregarCarrito.classList.add('hidden'), 3000);
    });

    // Agregar al carrito
    function agregarAlCarrito(nombreProducto, imagenProducto, precioProducto, cantidad, idProducto) {
        carrito.push({ name: nombreProducto, image: imagenProducto, price: precioProducto, quantity: cantidad, id: idProducto });
        actualizarVistaCarrito();
    }

    // Actualizar la visualización del carrito
    function actualizarVistaCarrito() {
        // Actualizar el conteo del carrito
        contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.quantity, 0);

        // Volver a renderizar el popup del carrito
        contenedorItemsCarrito.innerHTML = ''; // Limpiar los productos previos del carrito
        let total = 0;
        carrito.forEach(item => {
            const itemElemento = document.createElement('div');
            itemElemento.classList.add('cart-item', 'flex', 'justify-between', 'items-center', 'mb-4', 'border-b', 'pb-4');
            itemElemento.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover">
                    <span class="font-medium text-gray-800">${item.name}</span>  <!-- Mostrar el nombre del producto -->
                    <span class="ml-4 text-gray-500 text-sm">Código: ${item.id}</span>  <!-- Mostrar el código del producto -->
                </div>
                <div class="flex items-center space-x-2">
                    <input type="number" value="${item.quantity}" class="quantity p-2 border rounded-md w-16 text-center" data-name="${item.name}">
                    <button class="text-red-600 remove-item" data-name="${item.name}">&times;</button>
                </div>
                <span class="font-semibold text-gray-800">${item.price}</span>
            `;
            contenedorItemsCarrito.appendChild(itemElemento);
            total += parseFloat(item.price.replace('€', '').replace(',', '')) * item.quantity;
        });
        totalCarrito.textContent = `Total: ${total.toFixed(2)}`;
    }

    // Abrir el popup del carrito (solo cuando se haga clic en el ícono del carrito)
    botonCarrito.addEventListener('click', () => {
        mostrarPopupCarrito();
    });

    // Mostrar el popup del carrito
    function mostrarPopupCarrito() {
        actualizarVistaCarrito();
        popupCarrito.classList.remove('hidden');
    }

    // Cerrar el popup del carrito
    botonCerrarPopupCarrito.addEventListener('click', () => {
        popupCarrito.classList.add('hidden');
    });

    // Actualizar las cantidades del carrito
    botonActualizarCarrito.addEventListener('click', () => {
        const entradasCantidad = document.querySelectorAll('.quantity');
        entradasCantidad.forEach(input => {
            const nombreProducto = input.dataset.name;
            const nuevaCantidad = parseInt(input.value);
            const productoEnCarrito = carrito.find(item => item.name === nombreProducto);
            if (productoEnCarrito) {
                productoEnCarrito.quantity = nuevaCantidad;
            }
        });
        actualizarVistaCarrito(); // Volver a renderizar el carrito para reflejar los cambios
    });

    // Eliminar un producto del carrito
    contenedorItemsCarrito.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const nombreProducto = e.target.dataset.name;
            const index = carrito.findIndex(item => item.name === nombreProducto);
            if (index > -1) {
                carrito.splice(index, 1);
            }
            actualizarVistaCarrito(); // Volver a renderizar el carrito después de la eliminación
        }
    });

    // Placeholder para proceso de compra
    botonPagar.addEventListener('click', () => {
        alert('Proceso de compra no implementado');
    });

    // Alternar vista de productos (cuadrícula vs columna única)
    botonAlternarVista.addEventListener('click', () => {
        esColumnaUnica = !esColumnaUnica; // Alternar entre verdadero y falso
        if (esColumnaUnica) {
            contenedorProductos.classList.remove('grid-cols-2', 'md:grid-cols-3'); // Eliminar clases de columna múltiple
            contenedorProductos.classList.add('grid-cols-2'); // Agregar clase de columna única
        } else {
            contenedorProductos.classList.remove('grid-cols-2'); // Eliminar clase de columna única
            contenedorProductos.classList.add('grid-cols-2', 'md:grid-cols-3'); // Restaurar clases de columna múltiple
        }
    });
});
