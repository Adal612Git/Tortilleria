const idCliente = sessionStorage.getItem("idcliente"); // Obtén dinámicamente el idCliente, por ejemplo, desde sesión o backend

console.log(idCliente)

let paginaActualPedidos = 1;
const limitePorPaginaPedidos = 10;

async function cargarPedidosPaginados(pagina = 1, filtros = {}) {
  const offset = (pagina - 1) * limitePorPaginaPedidos;

  // Incluir idCliente fijo en filtros
  const body = {
    limit: limitePorPaginaPedidos,
    offset: offset,
    idPedido: filtros.idPedido || '',
    fechaInicio: filtros.fechaInicio || '',
    fechaFin: filtros.fechaFin || '',
    idCliente: parseInt(idCliente)
  };

  console.log(body)

  try {
    const res = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/obtenerPedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log(data);
    if (!data.success) {
      alert('Error al cargar los pedidos');
      return;
    }

    mostrarPedidosEnTabla(data.data);
    actualizarPaginacionPedidos(data.total, pagina);

  } catch (error) {
    console.error(error);
  }
}

function mostrarPedidosEnTabla(pedidos) {
  const tbody = document.getElementById('tablaHistorial');
  tbody.innerHTML = ''; 

  pedidos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id_pedido}</td>
      <td>${new Date(p.fecha).toLocaleDateString()}</td>
      <td><div class="${p.estado.toLowerCase().replace(' ', '_')}">${p.estado}</div></td>
      <td>$${parseFloat(p.total).toFixed(2)}</td>
      <td><button class="btn-detalles-pedido" data-id="${p.id_pedido}" data-cliente="${p.nombre_cliente}" data-repartidor="${p.nombre_repartidor || ''}">Mostrar detalles</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-detalles-pedido').forEach(btn => {
    btn.addEventListener('click', e => {
      const idPedido = e.target.dataset.id;
      const nombreCliente = e.target.dataset.cliente;
      const nombreRepartidor = e.target.dataset.repartidor;
      abrirModalDetallesPedido(idPedido, nombreCliente, nombreRepartidor);
    });
  });
}

function actualizarPaginacionPedidos(totalRegistros, paginaActual) {
  const totalPaginas = Math.ceil(totalRegistros / limitePorPaginaPedidos);
  const pagContainer = document.getElementById('paginacionPedidos');
  pagContainer.innerHTML = '';

  const btnAnterior = document.createElement('button');
  btnAnterior.textContent = 'Anterior';
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.onclick = () => {
    if (paginaActual > 1) {
      cargarPedidosPaginados(paginaActual - 1);
    }
  };

  const btnSiguiente = document.createElement('button');
  btnSiguiente.textContent = 'Siguiente';
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.onclick = () => {
    if (paginaActual < totalPaginas) {
      cargarPedidosPaginados(paginaActual + 1);
    }
  };

  pagContainer.appendChild(btnAnterior);
  pagContainer.appendChild(document.createTextNode(` Página ${paginaActual} de ${totalPaginas} `));
  pagContainer.appendChild(btnSiguiente);
}

// Modal detalles pedido (igual que antes)
async function abrirModalDetallesPedido(idPedido, cliente, repartidor) {
  const modal = document.getElementById('modalDetallesPedido');
  const nombreClienteElem = document.getElementById('nombreCliente');
  const nombreRepartidorElem = document.getElementById('nombreRepartidor');
  const tbody = document.getElementById('detallePedidoBody');

  tbody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';
  nombreClienteElem.textContent = `Cliente: ${cliente}`;
  nombreRepartidorElem.textContent = `Repartidor: ${repartidor || 'Sin asignar'}`;
  modal.style.display = 'flex';

  try {
    const res = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/obtenerDetallesID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idPedido: idPedido })
    });

    const data = await res.json();

    if (!data.success || !data.detalles.length) {
      tbody.innerHTML = '<tr><td colspan="3">No hay detalles para este pedido.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    data.detalles.forEach(detalle => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${detalle.nombre_producto}</td>
        <td>${detalle.cantidad}</td>
        <td>$${parseFloat(detalle.subtotal).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="3">Error al cargar detalles.</td></tr>';
    console.error(error);
  }
}

// Cerrar modal detalles pedido
document.getElementById('modalCerrarPedido').addEventListener('click', () => {
  document.getElementById('modalDetallesPedido').style.display = 'none';
});

document.getElementById('modalDetallesPedido').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.style.display = 'none';
  }
});

const inputIdPedido = document.getElementById('buscarHistorial');
const inputFechaInicio = document.getElementById('fechaDesde');
const inputFechaFin = document.getElementById('fechaHasta');

function aplicarFiltrosPedidos() {
  const filtros = {
    idPedido: inputIdPedido.value.trim(),
    fechaInicio: inputFechaInicio.value,
    fechaFin: inputFechaFin.value
  };
  cargarPedidosPaginados(1, filtros);
}

inputIdPedido.addEventListener('input', aplicarFiltrosPedidos);
inputFechaInicio.addEventListener('change', aplicarFiltrosPedidos);
inputFechaFin.addEventListener('change', aplicarFiltrosPedidos);

// Inicializar carga
cargarPedidosPaginados(paginaActualPedidos);
