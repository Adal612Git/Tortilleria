// admin.js
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
 cargarKPIs();
  cards.forEach(card => {
    card.addEventListener("click", () => {
      // Elimina la clase 'selected' de todas las tarjetas
      cards.forEach(c => c.classList.remove("selected"));
      // Agrega la clase 'selected' a la tarjeta clickeada
      card.classList.add("selected");
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("adminAvatar");
  const modal = document.getElementById("avatarModal");
  const closeBtn = document.getElementById("closeModal");
  const avatarInput = document.getElementById("avatarInput");
  const modalPreview = document.getElementById("modalAvatarPreview");
  const removeBtn = document.getElementById("removeAvatar");

  // Abrir modal
  avatar.addEventListener("click", () => {
    modal.style.display = "flex";
    modalPreview.src = avatar.src;
  });

  // Cerrar modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cambiar imagen
  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        avatar.src = e.target.result;
        modalPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Eliminar imagen
  removeBtn.addEventListener("click", () => {
    avatar.src = "avatar_admin.png";
    modalPreview.src = "avatar_admin.png";
    avatarInput.value = "";
  });

  // Cerrar si clic fuera del modal
  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});


const hoy = new Date();
cargarPedidosRecientes();
cargarResumenSemanal(hoy, hoy);
function formatearFecha(fecha) {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
async function cargarResumenSemanal(fechaInicio, fechaFin) {
  try {
    const res = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/asistencia/resumen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha_inicio: formatearFecha(fechaInicio),
        fecha_fin: formatearFecha(fechaFin)
      })
    });

    if (!res.ok) throw new Error("Error al cargar resumen semanal");

    const data = await res.json();

   const tbody = document.querySelector("#tbodyEmpleados");
    tbody.innerHTML = "";

    data.forEach(emp => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${emp.nombre}</td>
        <td>${emp.asistio_hoy > 0 ? '<span class="check">✓</span>' : '<span class="cross">✗</span>'}</td>
        
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el resumen semanal.");
  }
}

async function cargarPedidosRecientes() {
  try {
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/pedidoCompleto/listar');
    const data = await response.json();

    if (!data.success) {
      console.error(data.mensaje);
      return;
    }

    const tablaBody = document.querySelector('#tablaPedidosRecientes tbody');
    tablaBody.innerHTML = ''; // Limpiar tabla antes de insertar nuevos datos

    data.pedidos.forEach(pedido => {
      const fila = document.createElement('tr');

      // Normalizar estado para clases
      let estadoClase = '';
      switch (pedido.estado_pedido.toLowerCase()) {
        case 'pendiente':
          estadoClase = 'pendiente';
          break;
        case 'en_proceso':
          estadoClase = 'curso';
          break;
        case 'entregado':
          estadoClase ='concretado';
          break;
        case 'cancelado':
          estadoClase = "cancelado";
          break;
        
          
        default:
          estadoClase = '';
      }

      fila.innerHTML = `
        <td>${pedido.id_pedido}</td>
        <td>${pedido.cliente?.nombre || 'Sin nombre'}</td>
        <td><span class="estado ${estadoClase}">${formatearEstado(pedido.estado_pedido)}</span></td>
        <td>$${parseFloat(pedido.total).toFixed(2)}</td>
      `;

      tablaBody.appendChild(fila);
    });

  } catch (error) {
    console.error('Error al cargar pedidos recientes:', error);
  }
}

// Utilidad para mostrar texto bonito
function formatearEstado(estado) {
  switch (estado) {
    case 'pendiente': return 'Pendiente';
    case 'en_proceso': return 'En curso';
    case 'entregado': return 'Concretado';
    case 'concretado': return 'Concretado';
    case 'cancelado': return 'Cancelado';
    default: return estado;
  }
}
cargarResumenComparativo();
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
   

  } catch (error) {
    console.error("Error:", error);
  }
}


function mostrarResumenComparativo(resumen) {
  // Mostrar valores numéricos
  document.getElementById("ventasMes").textContent = `$${parseFloat(resumen.total_mes_actual).toFixed(2)}`;
  document.getElementById("ventasMostrador").textContent = `$${parseFloat(resumen.total_mostrador_actual).toFixed(2)}`;
  document.getElementById("ventasRepartos").textContent = `$${parseFloat(resumen.total_reparto_actual).toFixed(2)}`;
  document.getElementById("numeroTotalVentas").textContent = resumen.numero_ventas_actual;

  // Comparar con mes anterior y mostrar íconos o colores
  compararYMostrar('ventasMes', parseFloat(resumen.total_mes_actual), parseFloat(resumen.total_mes_anterior),"mensajeComparacionVentasMesValor" );
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
