async function cargarPedidosEspeciales() {
  try {
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoEspecial/listar');
    if (!response.ok) throw new Error('Error al obtener pedidos especiales');
    const data = await response.json();

    if (!data.success) {
      console.error('Error API:', data.mensaje);
      return;
    }

    const pedidos = data.pedidos;
    const contenedor = document.querySelector('.columna-derecha .grid-comandas');
    contenedor.innerHTML = ''; // Limpiar contenido

    const hoy = new Date();

    pedidos.forEach(pedido => {
      const divComanda = document.createElement('div');
      divComanda.classList.add('comanda');

      // Calcular diferencia de días
      const fechaEntrega = new Date(pedido.fecha_entrega);
      const diffTime = fechaEntrega - hoy;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // redondea hacia arriba
// Asignar clase según días restantes
if (diffDays === 0) {
  divComanda.classList.add('entrega-hoy'); // borde y sombra rojo
} else if (diffDays === 1) {
  divComanda.classList.add('entrega-1dia'); // borde y sombra amarillo
} else {
  divComanda.classList.add('entrega-lejos'); // borde y sombra verde
}


      divComanda.innerHTML = `
        <header>
          <h2>Pedido #${pedido.id}</h2>
          <div class="info">
            <div>Cliente: ${pedido.nombre_cliente}</div>
            <div>Fecha Entrega: ${pedido.fecha_entrega}</div>
          </div>
        </header>
        <div class="productos">
          <div>${pedido.descripccion}</div>
        </div>
        <div class="total">Total: $${parseFloat(pedido.total).toFixed(2)}</div>
        <button class="btn-pagar">Marcar como Pagado</button>
      `;

      divComanda.querySelector('.btn-pagar').addEventListener('click', () => {
        marcarPagado(pedido.id);
      });

      contenedor.appendChild(divComanda);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

async function marcarPagado(idPedido) {
  try {
    const confirmar = await Swal.fire({
      title: '¿Marcar como pagado?',
      text: `¿Deseas marcar el pedido #${idPedido} como pagado?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmar.isConfirmed) return;

    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoEspecial/marcarPagado', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_pedido: idPedido })
    });

    const data = await response.json();

    if (data.success) {
      await Swal.fire('¡Éxito!', 'El pedido ha sido marcado como pagado.', 'success');
      cargarPedidosEspeciales(); // Actualiza la interfaz
    } else {
      Swal.fire('Error', data.mensaje || 'No se pudo actualizar el estado.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Error', 'Hubo un problema al conectar con el servidor.', 'error');
  }
}

let pedidosGeneralesGlobal = [];

async function cargarPedidosCompletos(filtroEstado = 'todos') {
  try {
     if (pedidosGeneralesGlobal.length === 0) {
      const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/listar');
      const data = await response.json();

      if (!data.success) {
        console.error(data.mensaje);
        return;
      }

      pedidosGeneralesGlobal = data.pedidos; // Guardamos la lista completa
    }

     const pedidosFiltrados = filtroEstado === 'todos'
      ? pedidosGeneralesGlobal
      : pedidosGeneralesGlobal.filter(p => p.estado_pedido === filtroEstado);
    const contenedor = document.querySelector('.columna-izquierda .grid-comandas');
    contenedor.innerHTML = '';

    pedidosFiltrados.forEach(pedido => {
      const div = document.createElement('div');
      div.classList.add('comanda');

      let productosHTML = '';
      pedido.productos.forEach(prod => {
        productosHTML += `
          <div>
            <span class="cantidad">${prod.cantidad}</span>
            ${prod.nombre} <span>$${prod.subtotal}</span>
          </div>
        `;
      });

      div.innerHTML = `
        <header>
          <h2>Pedido #${pedido.id_pedido}</h2>
          <div class="info">
            <div>Cliente: ${pedido.cliente.nombre}</div>
            <div>Teléfono: ${pedido.cliente.telefono}</div>
            <div>Fecha: ${pedido.fecha_pedido}</div>
          </div>
        </header>
        <div class="productos">${productosHTML}</div>
        <div class="total">Total: $${parseFloat(pedido.total).toFixed(2)}</div>
          <div class="estado-boton-container">
    <div class="estado ${pedido.estado_pedido}">${pedido.estado_pedido}</div>
    <button class="btn-cambiar-estado" data-id="${pedido.id_pedido}" data-estado="${pedido.estado_pedido}">Cambiar Estado</button>
  </div>

      `;

      contenedor.appendChild(div);

      // Botón cambiar estado
div.querySelector('.btn-cambiar-estado').addEventListener('click', async () => {
  const { value: nuevoEstado } = await Swal.fire({
    title: 'Cambiar estado',
    confirmButtonColor: '#2e7d32',
    input: 'select',
    inputOptions: {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    },
    inputValue: pedido.estado_pedido,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    inputPlaceholder: 'Selecciona un estado'
  });

  if (nuevoEstado) {
    try {
      const resp = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/cambiarEstado', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_pedido: pedido.id_pedido,
          nuevo_estado: nuevoEstado
        })
      });

      const data = await resp.json();

      if (data.success) {
         pedidosGeneralesGlobal = [];
        await Swal.fire('Actualizado', 'El estado ha sido cambiado.', 'success');
        cargarPedidosCompletos(estadoActual);
      } else {
        Swal.fire('Error', data.mensaje || 'No se pudo actualizar.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Fallo al conectar con el servidor.', 'error');
      console.error(error);
    }
  }

  
});

    });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
}



let estadoActual = 'todos'; // filtro por defecto

window.addEventListener('DOMContentLoaded', () => {
  cargarPedidosCompletos(estadoActual);
  cargarPedidosEspeciales();

  document.querySelectorAll('.botones-filtro button').forEach(boton => {
    boton.addEventListener('click', () => {
      // Quitar activo de todos los botones y ponerlo en el clickeado
      document.querySelectorAll('.botones-filtro button').forEach(b => b.classList.remove('activo'));
      boton.classList.add('activo');

      // Actualizar filtro actual y recargar pedidos
      estadoActual = boton.getAttribute('data-estado');
      cargarPedidosCompletos(estadoActual);
    });
  });
});