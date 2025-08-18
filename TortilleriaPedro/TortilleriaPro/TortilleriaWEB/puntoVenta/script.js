document.addEventListener("DOMContentLoaded", () => {
  cargarMenu();

  const idusuario=   sessionStorage.getItem("idusuario");
  const idsucursal =   sessionStorage.getItem("idsucursal");
  const modal = document.getElementById("modalCantidad");
  const modalpediodEspecial = document.getElementById('modalPedidoEspecial');
   const btnAbrir = document.getElementById('btnPedidoEspecial');
     const btncerrar = document.getElementById('btnCancelarPedidoEspecial');
  let productoSeleccionado = null;
  const inputMonto = document.getElementById("montoEntregado");
const cambioP = document.getElementById("cambio");
const btnFinalizar = document.getElementById("btnFinalizarVenta");


  const rango =   sessionStorage.getItem("rangoUsuario");

  if(rango === "cliente"){
    document.getElementById('btnPedidoEspecial').style.display = 'none';
     if (inputMonto) inputMonto.style.display = "none";  // Ocultar input monto
  if (cambioP) cambioP.style.display = "none"; 

  }

  // btnAbrir.addEventListener('click', () => {
  //     modalpediodEspecial.classList.remove('oculto');
  //   });

  //   btncerrar.addEventListener('click', () => {
  //     modalpediodEspecial.classList.add('oculto');
  //   });




  document.getElementById("btnPedidoEspecial").addEventListener("click", mostrarModalPedido);
  document.getElementById("btnCancelarPedidoEspecial").addEventListener("click", ocultarModalPedido);
  document.getElementById("btnEnviarPedidoEspecial").addEventListener("click", manejarEnvioPedido);


function mostrarModalPedido() {
  document.getElementById("modalPedidoEspecial").classList.remove("oculto");
}

function ocultarModalPedido() {
  document.getElementById("modalPedidoEspecial").classList.add("oculto");
}

function obtenerDatosPedido() {
  const nombre = document.getElementById("nombreClienteEspecial").value.trim();
  const descripcion = document.getElementById("descripcionPedidoEspecial").value.trim();
  const fecha = document.getElementById("fechaRecogidaEspecial").value;
  const total = parseFloat(document.getElementById("totalPedidoEspecial").value);

  return { nombre, descripcion, fecha, total };
}

async function enviarPedidoEspecial(datos) {
  const respuesta = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoEspecial/crear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre_cliente: datos.nombre,
      fecha_entrega: datos.fecha,
      descripcion: datos.descripcion,
      total: datos.total
    })
  });

  return await respuesta.json();
}

async function manejarEnvioPedido() {
  const datos = obtenerDatosPedido();

  if (!datos.nombre || !datos.descripcion || !datos.fecha || isNaN(datos.total)) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Todos los campos son obligatorios.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  try {
    const resultado = await enviarPedidoEspecial(datos);

    if (resultado.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Pedido especial guardado con éxito.',
        confirmButtonColor: '#3085d6'
      });
      ocultarModalPedido();
      limpiarCamposPedido();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar el pedido.',
        confirmButtonColor: '#d33'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: error.message,
      confirmButtonColor: '#d33'
    });
  }
}

function limpiarCamposPedido() {
  document.getElementById("nombreClienteEspecial").value = "";
  document.getElementById("descripcionPedidoEspecial").value = "";
  document.getElementById("fechaRecogidaEspecial").value = "";
  document.getElementById("totalPedidoEspecial").value = "";
}



  async function cargarMenu() {
    const contenedor = document.getElementById("menu-list");

    try {
      const respuesta = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/productos");
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);

      const productos = await respuesta.json();

      productos.forEach(p => {
        const producto = {
          id: p.id_producto,
          nombre: p.nombre,
          precio: parseFloat(p.precio),
          unidad: p.unidad || "pieza",
          stock: p.stock,
          controla_stock: p.controla_stock === "1" || p.controla_stock === 1 || p.controla_stock === true

        };

        const card = document.createElement("div");
        card.classList.add("menu-card");
        card.innerHTML = `
          <div class="menu-img-container">
            <img src="../${p.imagen}" alt="${p.nombre}" />
          </div>
          <h4>${p.nombre}</h4>
          <p>${p.descripcion ?? "Sin descripción."}</p>
          <span>$${producto.precio.toFixed(2)}</span>
          <a href="#pedidos" class="btn-menu">Pedir</a>
        `;

        card.querySelector(".btn-menu").addEventListener("click", () => {
          agregarASeleccionadosConCantidad(producto);
        });

        contenedor.appendChild(card);
      });

    } catch (error) {
      console.error("Error al cargar productos:", error);
      contenedor.innerHTML = "<p style='color:red'>No se pudieron cargar los productos.</p>";
    }
  }

  function agregarASeleccionadosConCantidad(producto) {
    productoSeleccionado = producto;

    const nombre = document.getElementById("modalNombreProducto");
    const cantidadInput = document.getElementById("cantidadInput");
    const montoInput = document.getElementById("montoInput");
    const cantidadCalculada = document.getElementById("cantidadCalculada");

    nombre.textContent = producto.nombre;
    cantidadInput.value = "1";
    montoInput.value = "";
    cantidadCalculada.textContent = "";

    modal.classList.remove("oculto");

    cantidadInput.oninput = () => {
      const cantidad = parseFloat(cantidadInput.value);
      if (!isNaN(cantidad)) {
        const precioTotal = cantidad * producto.precio;
        cantidadCalculada.textContent = `Total: $${precioTotal.toFixed(2)}`;
        montoInput.value = "";
      } else {
        cantidadCalculada.textContent = "";
      }
    };

    montoInput.oninput = () => {
      const monto = parseFloat(montoInput.value);
      if (!isNaN(monto)) {
        const cantidad = monto / producto.precio;
        cantidadInput.value = cantidad.toFixed(2);
        cantidadCalculada.textContent = `Equivalente: ${cantidad.toFixed(2)} ${producto.unidad}`;
      } else {
        cantidadCalculada.textContent = "";
      }
    };
  }

  const btnAgregar = document.getElementById("btnAgregarCantidad");
  const btnCancelar = document.getElementById("btnCancelarCantidad");
  const listaSeleccionados = document.getElementById("zonaSeleccionados");
  const cantidadInput = document.getElementById("cantidadInput");

  btnAgregar.addEventListener("click", () => {
    const cantidad = parseFloat(cantidadInput.value);
    if (isNaN(cantidad) || cantidad <= 0) {
       Swal.fire({
    icon: "warning",
    title: "Cantidad inválida",
    text: "Ingresa una cantidad válida."
  });
      return;
    }
    console.log(productoSeleccionado)

  const controlaStock = Number(productoSeleccionado.controla_stock);
  const stock = Number(productoSeleccionado.stock);
  if (controlaStock === 1 && cantidad > stock) {
  cerrarModalCantidad();
  Swal.fire({
    icon: "warning",
    title: "Stock insuficiente",
    text: `Solo hay ${stock} disponibles.`
  });
  return;
}


    const total = cantidad * productoSeleccionado.precio;

    // Buscar producto en carrito
    const itemExistente = listaSeleccionados.querySelector(`.carrito-item[data-id="${productoSeleccionado.id}"]`);

    if (itemExistente) {
      const cantidadSpan = itemExistente.querySelector(".item-cantidad");
      const totalSpan = itemExistente.querySelector(".item-precio");
      


      const cantidadAnterior = parseFloat(cantidadSpan.dataset.valorCantidad) || 0;
      const nuevaCantidad = cantidadAnterior + cantidad;



console.log("controla_stock:", controlaStock, "stock:", stock, "nuevaCantidad:", nuevaCantidad);

if (controlaStock === 1 && nuevaCantidad > stock) {
  cerrarModalCantidad();
  Swal.fire({
    icon: "warning",
    title: "Stock insuficiente",
    text: `Solo hay ${stock} disponibles para agregar.`
  });
  return;
}

      const nuevoTotal = nuevaCantidad * productoSeleccionado.precio;

      cantidadSpan.textContent = `${nuevaCantidad.toFixed(2)} ${productoSeleccionado.unidad}`;
      cantidadSpan.dataset.valorCantidad = nuevaCantidad.toString();
      totalSpan.textContent = `$${nuevoTotal.toFixed(2)}`;
    } else {
      const item = document.createElement("div");
      item.className = "carrito-item";
      item.dataset.id = productoSeleccionado.id;
      item.innerHTML = `
        <div class="item-seleccionado">
          <span class="item-nombre">${productoSeleccionado.nombre}</span>
          <span class="item-cantidad" data-valor-cantidad="${cantidad}"><strong>${cantidad.toFixed(2)}</strong> ${productoSeleccionado.unidad}</span>
          <span class="item-precio">$${total.toFixed(2)}</span>
           <button id="btn-eliminar" class="btn-eliminar">x</button>
        </div>
      `;
      listaSeleccionados.appendChild(item);
    }

    modal.classList.add("oculto");
    actualizarResumenPago();
  });

  btnCancelar.addEventListener("click", cerrarModalCantidad);

  function cerrarModalCantidad() {
    modal.classList.add("oculto");
    cantidadInput.value = "";
    document.getElementById("montoInput").value = "";
    document.getElementById("cantidadCalculada").textContent = "";
  }


  async function enviarPedidoDesdeCliente(carrito, total, idSucursal, idCliente) {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito vacío",
      text: "No hay productos en el carrito"
    });
    return;
  }

  const detalles = carrito.map(p => ({
    id_producto: p.id,
    cantidad: p.cantidad,
    subtotal: p.precio * p.cantidad
  }));

  const pedido = {
    id_sucursal: parseInt(idSucursal),
    id_cliente: parseInt(idCliente),
    total: parseFloat(total),
    detalles: detalles,
    estado: "Pendiente"
  };

 console.log("JSON enviado:", JSON.stringify(pedido, null, 2));


  try {
    const response = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/crearPedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al registrar el pedido");
    }

    const data = await response.json();

    Swal.fire({
      icon: "success",
      title: "Pedido registrado",
      text: `ID de pedido: ${data.id_pedido}`,
      confirmButtonText: "Aceptar"
    }).then(() => {
  location.reload();
});

    
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al registrar pedido",
      text: error.message || "Ocurrió un error inesperado"
    });
  }
}


function actualizarResumenPago() {
  let resumen = document.getElementById("resumenPago");
  if (resumen) resumen.remove();

  const carritoItems = listaSeleccionados.querySelectorAll(".carrito-item");
  if (carritoItems.length === 0) {
    listaSeleccionados.innerHTML = "<h2>Seleccionados</h2><p>No hay productos seleccionados.</p>";

    const inputMonto = document.getElementById("montoEntregado");
    const cambioP = document.getElementById("cambio");
    const btnFinalizar = document.getElementById("btnFinalizarVenta");

    if (inputMonto) inputMonto.value = "";
    if (cambioP) cambioP.textContent = "";
    if (btnFinalizar) btnFinalizar.disabled = true;
    if (resumen) resumen.remove();

    return;
  }

  let total = 0;
  carritoItems.forEach(item => {
    const precioText = item.querySelector(".item-precio").textContent;
    const precio = parseFloat(precioText.replace("$", "")) || 0;
    total += precio;
  });

  resumen = document.createElement("div");
  resumen.id = "resumenPago";
  resumen.style.marginTop = "1rem";
  resumen.innerHTML = `
    <hr />
    <strong>Total a pagar: $<span id="totalPagar">${total.toFixed(2)}</span></strong>
    <div id="campoMontoEntregado" style="margin-top: 0.5rem;">
      <label for="montoEntregado">Monto entregado por cliente:</label>
      <input type="number" id="montoEntregado" min="0" step="0.01" placeholder="Ej. 100.00" />
    </div>
    <p id="cambio" style="font-weight: bold; margin-top: 0.5rem;"></p>
    <button id="btnFinalizarVenta" disabled>Finalizar Venta</button>
  `;
  listaSeleccionados.appendChild(resumen);

  const inputMonto = document.getElementById("montoEntregado");
  const cambioP = document.getElementById("cambio");
  const btnFinalizar = document.getElementById("btnFinalizarVenta");
  const rango = sessionStorage.getItem("rangoUsuario");

  if (rango === "cliente") {
    if (inputMonto) inputMonto.style.display = "none";
    if (cambioP) cambioP.style.display = "none";
    document.getElementById("campoMontoEntregado").style.display = "none";
    btnFinalizar.disabled = false;
    btnFinalizar.textContent = "Enviar Pedido";
  } else {
    if (inputMonto) inputMonto.style.display = "block";
    if (cambioP) cambioP.style.display = "block";
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = "Finalizar Venta";

    inputMonto.oninput = () => {
      const monto = parseFloat(inputMonto.value);
      if (isNaN(monto) || monto < total) {
        cambioP.textContent = "Monto insuficiente para cubrir el total.";
        cambioP.style.color = "red";
        btnFinalizar.disabled = true;
      } else {
        const cambio = monto - total;
        cambioP.textContent = `Cambio a regresar: $${cambio.toFixed(2)}`;
        cambioP.style.color = "green";
        btnFinalizar.disabled = false;
      }
    };
  }

  btnFinalizar.onclick = () => {
    const carrito = [];
    listaSeleccionados.querySelectorAll(".carrito-item").forEach(item => {
      const id = parseInt(item.dataset.id);
      const cantidadSpan = item.querySelector(".item-cantidad");
      const cantidad = parseFloat(cantidadSpan.dataset.valorCantidad) || 0;
      const precioSpan = item.querySelector(".item-precio");
      const precio = parseFloat(precioSpan.textContent.replace("$", ""));
      const precioUnitario = precio / cantidad;

      carrito.push({
        id,
        cantidad,
        precio: precioUnitario
      });
    });

    const idSucursal = sessionStorage.getItem("idsucursal");
    const idUsuario = sessionStorage.getItem("idusuario");
    const idCliente = sessionStorage.getItem("idcliente");
    console.log(idCliente)

    if (rango === "cliente") {
      enviarPedidoDesdeCliente(carrito, total, idSucursal, idCliente);
    } else {
      enviarVenta(carrito, total, idSucursal, idUsuario);
    }
  };
}


  async function enviarVenta(carrito, total, idSucursal, idUsuario) {
    if (carrito.length === 0) {
        Swal.fire({
    icon: "info",
    title: "Carrito vacío",
    text: "No hay productos en el carrito"
  });
      return;
    }

    const detalles = carrito.map(p => ({
      id_producto: p.id,
      cantidad: p.cantidad,
      subtotal: p.precio * p.cantidad
    }));

    const venta = {
      id_sucursal: parseInt(idSucursal),
      id_usuario: parseInt(idUsuario),
      total: parseFloat(total),
      detalles: detalles,
      tipo:"Mostrador",
      // si quieres enviar el monto entregado
    };

    console.log("JSON enviado empleado:", JSON.stringify(venta, null, 2));

    try {
      const response = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/venta/insertarVenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido al registrar la venta");
      }
      console.log(venta);

      const data = await response.json();
      Swal.fire({
  icon: "success",
  title: "Venta registrada",
  text: `ID de venta: ${data.id_venta}`,
  confirmButtonText: "Aceptar"
}).then(() => {
  location.reload();
});
     
      // Limpiar carrito y resumen
      listaSeleccionados.innerHTML = "<h2>Seleccionados</h2><p>No hay productos seleccionados.</p>";
    } catch (error) {
      Swal.fire({
  icon: "error",
  title: "Error al registrar venta",
  text: error.message || "Ocurrió un error inesperado"
});
      
      console.log(venta);
    }
  }

  function vaciarCarrito() {
  // 1. Eliminar productos del array (si tienes uno)
  location.reload();
  }

document.getElementById("vaciarcarrito").addEventListener("click",vaciarCarrito)

 document.getElementById("zonaSeleccionados").addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const item = e.target.closest(".carrito-item");
      if (item) {
        item.remove();
        actualizarResumenPago(); // Actualiza total después de eliminar
      }
    }
  });

});



