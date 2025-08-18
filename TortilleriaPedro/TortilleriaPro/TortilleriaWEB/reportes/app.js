
let paginaActual = 1;
const limitePorPagina = 10;

let paginaActualPedidos = 1;
const limitePorPaginaPedidos = 10;

async function cargarVentasPaginadas(pagina = 1, filtros = {}) {
  const offset = (pagina - 1) * limitePorPagina;

  // Construir el objeto con filtros y paginación
  const body = {
    limit: limitePorPagina,
    offset: offset,
    idVenta: filtros.idVenta || '',
    fechaInicio: filtros.fechaInicio || '',
    fechaFin: filtros.fechaFin || ''
  };

  try {
    const res = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/venta/cargarVentas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!data.success) {
      alert('Error al cargar las ventas');
      return;
    }

    mostrarVentasEnTabla(data.data);
    actualizarPaginacion(data.total, pagina);

  } catch (error) {
    console.error(error);
  }
}

async function cargarPedidosPaginados(pagina = 1, filtros = {}) {
  const offset = (pagina - 1) * limitePorPaginaPedidos;

  // Construir el objeto con filtros y paginación
  const body = {
    limit: limitePorPaginaPedidos,
    offset: offset,
    idPedido: filtros.idPedido || '',
    fechaInicio: filtros.fechaInicio || '',
    fechaFin: filtros.fechaFin || ''
  };

  try {
    const res = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/obtenerPedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

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
  const tbody = document.getElementById('tablaPedidosBody');
  tbody.innerHTML = ''; // limpiar

  pedidos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id_pedido}</td>
      <td>${new Date(p.fecha).toLocaleDateString()}</td>
      <td> <div class="${p.estado.toLowerCase().replace(' ', '_')}">${p.estado}</div></td>
      <td>$${parseFloat(p.total).toFixed(2)}</td>
        <td><button class="btn-detalles-pedido" 
              data-id="${p.id_pedido}" 
              data-cliente="${p.nombre_cliente}" 
              data-repartidor="${p.nombre_repartidor || ''}">
              Mostrar detalles
      </button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-detalles-pedido').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idPedido = e.target.dataset.id;
      const nombreCliente = e.target.dataset.cliente;
      const nombreRepartidor = e.target.dataset.repartidor;
      abrirModalDetallesPedido(idPedido,nombreCliente,nombreRepartidor); // función que abrirá modal de detalles pedido
    });
  });
}

function actualizarPaginacionPedidos(totalRegistros, paginaActual) {
  const totalPaginas = Math.ceil(totalRegistros / limitePorPagina);
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

function mostrarVentasEnTabla(ventas) {
  const tbody = document.getElementById('tablaVentasBody');
  tbody.innerHTML = ''; // limpiar
  ventas.forEach(v => {
    const tr = document.createElement('tr');
        

    tr.innerHTML = `
      <td>${v.id_venta}</td>
      <td>${new Date(v.fecha).toLocaleDateString()}</td>
      <td> <div class="${v.tipo_venta.toLowerCase()}"> ${v.tipo_venta}</div></td>
      <td>$${parseFloat(v.total).toFixed(2)}</td>
      <td><button class="btn-detalles" data-id="${v.id_venta}">Mostrar detalles</button></td>
    `;
    tbody.appendChild(tr);
  });

document.querySelectorAll('.btn-detalles').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const idVenta = e.target.dataset.id;
    abrirModalDetalles(idVenta);
  });
});
  
}

function actualizarPaginacion(totalRegistros, paginaActual) {
  const totalPaginas = Math.ceil(totalRegistros / limitePorPagina);
  const pagContainer = document.getElementById('paginacionVentas');
  pagContainer.innerHTML = `Página ${paginaActual} de ${totalPaginas}`;

  const btnAnterior = document.createElement('button');
  btnAnterior.textContent = 'Anterior';
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.onclick = () => {
    if (paginaActual > 1) {
      cargarVentasPaginadas(paginaActual - 1);
    }
  };

  const btnSiguiente = document.createElement('button');
  btnSiguiente.textContent = 'Siguiente';
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.onclick = () => {
    if (paginaActual < totalPaginas) {
      cargarVentasPaginadas(paginaActual + 1);
    }
  };

  // Limpiar antes de añadir
  pagContainer.innerHTML = '';
  pagContainer.appendChild(btnAnterior);
  pagContainer.appendChild(document.createTextNode(` Página ${paginaActual} de ${totalPaginas} `));
  pagContainer.appendChild(btnSiguiente);
}

// Llama inicialmente
cargarVentasPaginadas(1);
cargarPedidosPaginados(1);

const inputIdVenta = document.getElementById('buscarVentasId');
const inputFechaInicio = document.getElementById('fechaInicioVentas');
const inputFechaFin = document.getElementById('fechaFinVentas');

function aplicarFiltros() {
  const filtros = {
    idVenta: inputIdVenta.value.trim(),
    fechaInicio: inputFechaInicio.value,
    fechaFin: inputFechaFin.value,
  };
  cargarVentasPaginadas(1, filtros);
}

// Escuchar eventos 'input' para que se dispare la búsqueda al escribir o cambiar fecha
inputIdVenta.addEventListener('input', aplicarFiltros);
inputFechaInicio.addEventListener('change', aplicarFiltros);
inputFechaFin.addEventListener('change', aplicarFiltros);

const inputIdPedido = document.getElementById('buscarPedidosId');
const inputFechaInicioPedido = document.getElementById('fechaInicioPedidos');
const inputFechaFinPedido = document.getElementById('fechaFinPedidos');
function aplicarFiltrosPedidos() {
  const filtros = {
    idPedido: inputIdPedido.value.trim(),
    fechaInicio: inputFechaInicioPedido.value,
    fechaFin: inputFechaFinPedido.value,
  };
  cargarPedidosPaginados(1, filtros);
}

// Event listeners para filtros de pedidos
inputIdPedido.addEventListener('input', aplicarFiltrosPedidos);
inputFechaInicioPedido.addEventListener('change', aplicarFiltrosPedidos);
inputFechaFinPedido.addEventListener('change', aplicarFiltrosPedidos);


document.getElementById('modalCerrar').addEventListener('click', () => {
  document.getElementById('modalDetalles').style.display = 'none';
});

// También opcionalmente cerrar si haces click fuera del contenido:
document.getElementById('modalDetalles').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.style.display = 'none';
  }
});


async function abrirModalDetalles(idVenta) {
  const modal = document.getElementById('modalDetalles');
  const tbody = document.getElementById('detalleVentaBody');
  tbody.innerHTML = 'Cargando...';

  // Mostrar modal
  modal.style.display = 'flex';

  try {
    const res = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/venta/obtenerDetallesID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( idVenta )  // enviar el idVenta en el body
    });

    if (!res.ok) throw new Error('Error al cargar detalles');

    const data = await res.json();

    if (!data.success) {
      tbody.innerHTML = '<tr><td colspan="3">No hay detalles</td></tr>';
      return;
    }

    const detalles = data.detalles;
    if (detalles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">No hay detalles</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    detalles.forEach(detalle => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${detalle.nombre_producto}</td>
        <td>${detalle.cantidad}</td>
        <td>$${parseFloat(detalle.subtotal).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="3">Error al cargar detalles</td></tr>`;
    console.error(error);
  }
}

// Abrir modal y cargar detalles del pedido
async function abrirModalDetallesPedido(idPedido,cliente,repartidor) {
  const modal = document.getElementById('modalDetallesPedido');
    const nombreClienteElem = document.getElementById('nombreCliente');
  const nombreRepartidorElem = document.getElementById('nombreRepartidor');
  const tbody = document.getElementById('detallePedidoBody');
    if (!tbody) {
    console.error('No se encontró tbody con id detallePedidoBodyPedido');
    return;
  }
  tbody.innerHTML = '<tr><td colspan="3">Cargando...</td></tr>';
nombreClienteElem.textContent = `Cliente: ${cliente}`;
nombreRepartidorElem.textContent = `Repartidor: ${repartidor || 'Sin asignar'}`;
  modal.style.display = 'flex';


  try {
    const res = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/obtenerDetallesID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idPedido: idPedido } ) // Enviar el idPedido en el body como objeto
    });

    if (!res.ok) throw new Error('Error al cargar detalles');

    const data = await res.json();
 console.log(data)
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

// Cerrar modal al hacer click en el botón cerrar
document.getElementById('modalCerrarPedido').addEventListener('click', () => {
  document.getElementById('modalDetallesPedido').style.display = 'none';
});
cargarResumenComparativo();
// Cerrar modal si se hace click fuera del contenido
document.getElementById('modalDetallesPedido').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.style.display = 'none';
  }
});
async function cargarResumenComparativo(mes = null) {
  if (!mes) {
    const hoy = new Date();
    mes = hoy.toISOString().slice(0,7); // 'YYYY-MM'
  }

  console.log(mes)

  try {
    const res = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/venta/resumen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mes: mes })
    });

    if (!res.ok) throw new Error("Error al obtener resumen comparativo");

    const data = await res.json();
    console.log(data)
    if (!data.success) {
      console.error("Error API:", data.message);
      return;
    }

    mostrarResumenComparativo(data.resumen);
     graficarDiferenciaVentas(data.resumen);

    graficarComparativaPedidosVentas(data.resumen);

  } catch (error) {
    console.error("Error:", error);
  }
}


function mostrarResumenComparativo(resumen) {
  // Mostrar valores numéricos
  document.getElementById("ventasMesValor").textContent = `$${parseFloat(resumen.total_mes_actual).toFixed(2)}`;
  document.getElementById("ventasMostrador").textContent = `$${parseFloat(resumen.total_mostrador_actual).toFixed(2)}`;
  document.getElementById("ventasRepartos").textContent = `$${parseFloat(resumen.total_reparto_actual).toFixed(2)}`;
  document.getElementById("numeroTotalVentas").textContent = resumen.numero_ventas_actual;

  // Comparar con mes anterior y mostrar íconos o colores
  compararYMostrar('ventasMesValor', parseFloat(resumen.total_mes_actual), parseFloat(resumen.total_mes_anterior),"mensajeComparacionVentasMesValor" );
  compararYMostrar('ventasMostrador', parseFloat(resumen.total_mostrador_actual), parseFloat(resumen.total_mostrador_anterior),"mensajeComparacionVentasMostrador");
  compararYMostrar('ventasRepartos', parseFloat(resumen.total_reparto_actual), parseFloat(resumen.total_reparto_anterior),"mensajeComparacionVentasRepartos");
  compararYMostrar('numeroTotalVentas', parseFloat(resumen.numero_ventas_actual), parseFloat(resumen.numero_ventas_anterior),"mensajeComparacionNumeroTotalVentas");
}

function compararYMostrar(idElemento, valorActual, valorAnterior, idMensaje) {
  const elem = document.getElementById(idElemento);
  const mensajeElem = document.getElementById(idMensaje);

  if (valorActual > valorAnterior) {
    elem.style.color = 'green';
    elem.title = `Mejor que el mes anterior (${valorAnterior}) ↑`;
    mensajeElem.textContent = 'Mejor que el mes anterior ↑';
    mensajeElem.style.color = 'green';
  } else if (valorActual < valorAnterior) {
    elem.style.color = 'red';
    elem.title = `Peor que el mes anterior (${valorAnterior}) ↓`;
    mensajeElem.textContent = 'Peor que el mes anterior ↓';
    mensajeElem.style.color = 'red';
  } else {
    elem.style.color = 'black';
    elem.title = `Igual que el mes anterior (${valorAnterior})`;
    mensajeElem.textContent = 'Igual que el mes anterior';
    mensajeElem.style.color = 'black';
  }
}


function graficarDiferenciaVentas(resumen) {
  // resumen tiene los datos con estructura similar a:
  // resumen.total_mes_actual, resumen.total_mes_anterior, etc.

  const ctx = document.getElementById('graficoVentas').getContext('2d');

  // Si ya existe la gráfica, destrúyela para no crear múltiples instancias
  if(window.graficaVentas) {
    window.graficaVentas.destroy();
  }

  window.graficaVentas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mes Anterior', 'Mes Actual'],
      datasets: [{
        label: 'Ventas Totales',
        data: [parseFloat(resumen.total_mes_anterior), parseFloat(resumen.total_mes_actual)],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)', // rojo para mes anterior
          'rgba(54, 162, 235, 0.7)'  // azul para mes actual
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            // Formatear con signo peso y con miles
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}



function graficarComparativaPedidosVentas(resumen) {
  const ctx = document.getElementById('graficaComparativa').getContext('2d');
  
  if(window.graficaComparativaInstance) window.graficaComparativaInstance.destroy();
  
  window.graficaComparativaInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mes Actual', 'Mes Anteriror'],
      datasets: [
        {
          label: 'Cantidad de Pedidos',
          data: [resumen.numero_ventas_actual,resumen.numero_ventas_anterior],
          backgroundColor: ['rgba(75, 192, 192, 0.7)',
           'rgba(204, 66, 142, 0.7)']
        }
       
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          // Opcional: para que los valores grandes y pequeños convivan mejor puedes usar dos ejes Y (avísame si quieres)
        }
      }
    }
  });
}






