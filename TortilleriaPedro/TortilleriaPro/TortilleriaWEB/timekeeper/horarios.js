let empleadoSeleccionado = null;
  let historial = {};
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
  
  const listaEmpleados = document.getElementById("listaEmpleados");
  const tablaHistorial = document.querySelector("#historyTable tbody");
 document.getElementById("btn-filtrar").addEventListener("click", (e) => {
  e.preventDefault();
  cargarHistorial();
});

document.getElementById("guardarCambios").addEventListener("click", (e) => {
  e.preventDefault();
  guardarCambios();
});

document.getElementById("btnEntrada").addEventListener("click", () => registerEvent("Entrada"));
  document.getElementById("btnInicioDescanso").addEventListener("click", () => registerEvent("Inicio Descanso"));
  document.getElementById("btnFinDescanso").addEventListener("click", () => registerEvent("Fin Descanso"));
  document.getElementById("btnSalida").addEventListener("click", () => registerEvent("Salida"));

  

  // Aquí mueve todas las funciones y variables que dependen del DOM
  // como seleccionarEmpleado, mostrarHistorial, cargarHistorial, etc.

  // Las siguientes variables deben declararse aquí dentro
  
  

  // ... pega aquí todas tus funciones ...




async function cargarUsuarios() {
  try {
    const res = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios");
    if (!res.ok) throw new Error("Error en la respuesta");
    const data = await res.json();
    const lista = document.getElementById("employeeList");
    lista.innerHTML = "";
    usuarios = data;

    data.forEach(usuario => {
      const li = document.createElement("li");
      li.textContent = `${usuario.id_usuario} - ${usuario.nombre}`;
      li.onclick = () => seleccionarEmpleado(usuario, li);
      lista.appendChild(li);  // ✅ Solo se agrega una vez
    });

  } catch (err) {
    console.error("Error al cargar usuarios:", err);
  }
}

 function obtenerSemanasDelMesActual() {
    const fechas = [];
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();

    // Primer día del mes
    let fechaInicio = new Date(año, mes, 1);

    // Ajustar al lunes más cercano (si no es lunes)
    const diaSemana = fechaInicio.getDay(); // domingo=0 ... sábado=6
    const diferenciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    fechaInicio.setDate(fechaInicio.getDate() + diferenciaLunes);

    // Generar semanas hasta que se pase el mes actual
    while (fechaInicio.getMonth() === mes || fechaInicio.getMonth() === mes + 1) {
      const inicioSemana = new Date(fechaInicio);
      const finSemana = new Date(fechaInicio);
      finSemana.setDate(finSemana.getDate() + 6);

      fechas.push({ inicio: inicioSemana, fin: finSemana });

      fechaInicio.setDate(fechaInicio.getDate() + 7);
      if (inicioSemana.getMonth() > mes) break; // Terminar si ya no es el mes actual
    }

    return fechas;
  }








function seleccionarEmpleado(usuario, elemento) {
  empleadoSeleccionado = usuario;
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("activo"));
  elemento.classList.add("activo");

  const title = document.getElementById("selectedEmployeeTitle");
  title.textContent = `Empleado seleccionado: ${usuario.nombre}`;
  cargarHistorial();
}



function cargarHistorial() {
  if (!empleadoSeleccionado) return;

  const mes = parseInt(document.getElementById("filterMonth").value.split("-")[1]);
  const semana = parseInt(document.getElementById("filterWeek").value);

  fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/asistencia/historial", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_usuario: empleadoSeleccionado.id_usuario,
      mes: mes || null,
      // no mandamos semana, se filtra después
    })
  })
    .then(res => res.json())
    .then(data => {
      let datosFiltrados = data;
      if (semana) {
        datosFiltrados = filtrarPorSemana(data, semana);
      }
      historial = datosFiltrados;
      mostrarHistorial(); // usa el historial filtrado
      
    })
    .catch(error => {
      console.error("Error al obtener historial:", error);
    });
}





function mostrarHistorial() {
  if (!empleadoSeleccionado) return;
  const registros = historial || [];
  tablaHistorial.innerHTML = "";

  registros.forEach(evento => {
    const tr = document.createElement("tr");
    tr.id = `fila-${evento.id_usuario}-${evento.fecha}`;

   tr.innerHTML = `
  <td><div class="circulo fecha">${evento.fecha}</div></td>
  <td><div class="circulo entrada">${evento.entrada || "-"}</div></td>
  <td><div class="circulo inicio_descanso">${evento.inicio_descanso || "-"}</div></td>
  <td><div class="circulo fin_descanso">${evento.fin_descanso || "-"}</div></td>
  <td><div class="circulo salida">${evento.salida || "-"}</div></td>
  <td><button  class="editar" onclick='abrirModalEdicion(${JSON.stringify(evento)})'>Editar</button></td>
`;


    tablaHistorial.appendChild(tr);
  });
}





function filtrarPorSemana(historial, semanaSeleccionada) {
  if (!semanaSeleccionada) return historial; // si no hay semana seleccionada, devuelve todo

  return historial.filter(evento => {
    const fecha = new Date(evento.fecha);
    const diaDelMes = fecha.getDate();
    const semanaDelMes = Math.ceil(diaDelMes / 7); // calcula la semana del mes

    return semanaDelMes === semanaSeleccionada;
  });
}

async function registerEvent(tipo) {
  if (!empleadoSeleccionado) {
    Swal.fire({
      icon: 'warning',
      title: 'Empleado no seleccionado',
      text: 'Selecciona un empleado antes de registrar un evento.'
    });
    return;
  }

  let fecha = document.getElementById("datePicker").value;
  if (!fecha) {
    fecha = new Date().toISOString().split("T")[0];
  }

  const hora = new Date().toTimeString().split(" ")[0];

  try {
    const res = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/asistencia/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        empleado_id: empleadoSeleccionado.id_usuario,
        tipo_evento: tipo,
        fecha: fecha,
        hora: hora
      })
    });

    if (!res.ok) throw new Error("Error al registrar evento");

    Swal.fire({
      icon: 'success',
      title: 'Evento registrado',
      text: `${tipo} guardado para ${empleadoSeleccionado.nombre}`
    });

   cargarHistorial();

       const semanas = obtenerSemanasDelMesActual();
    const seleccion = document.getElementById("selectSemana").selectedIndex;
    cargarResumenSemanal(semanas[seleccion].inicio, semanas[seleccion].fin);
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo registrar el evento. Intenta más tarde.'
    });
  }
}



async function guardarCambios() {
  const id_usuario = document.getElementById("modalIdUsuario").value;
  const fecha = document.getElementById("modalFecha").value;

  const entrada = document.getElementById("modalEntrada").value;
  const inicio = document.getElementById("modalInicio").value;
  const fin = document.getElementById("modalFin").value;
  const salida = document.getElementById("modalSalida").value;

  const eventos = [
    { tipo_evento: 'Entrada', hora: entrada },
    { tipo_evento: 'Inicio Descanso', hora: inicio },
    { tipo_evento: 'Fin Descanso', hora: fin },
    { tipo_evento: 'Salida', hora: salida }
  ];

  try {
    for (const evento of eventos) {
      // Solo actualiza si hay un valor de hora válido
      if (evento.hora) {
        const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/asistencia/editar', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_usuario,
            fecha,
            tipo_evento: evento.tipo_evento,
            hora: evento.hora
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al actualizar evento');
        }
      }
    }

    Swal.fire('¡Actualizado!', 'Los eventos han sido modificados correctamente.', 'success');
    document.getElementById("modalEdicion").style.display = "none";

    // Recarga la tabla de historial para mostrar cambios
    cargarHistorial();
    const semanas = obtenerSemanasDelMesActual();
const seleccion = document.getElementById("selectSemana").selectedIndex;
cargarResumenSemanal(semanas[seleccion].inicio, semanas[seleccion].fin);
    
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    Swal.fire('Error', error.message, 'error');
  }
}


  const selectSemana = document.getElementById("selectSemana");
  const resumenLabel = document.getElementById("fechaSemanaLabel");

  // Obtener semanas del mes actual (array de objetos con {inicio, fin})
function obtenerSemanasDelMesActual() {
  const fechas = [];
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();

  // Primer día del mes
  let fechaInicio = new Date(año, mes, 1);

  // Ajustar al lunes anterior o igual al primer día del mes (si no es lunes)
  const diaSemana = fechaInicio.getDay(); // domingo=0 ... sábado=6
  const diferenciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  fechaInicio.setDate(fechaInicio.getDate() + diferenciaLunes);

  // Generar semanas hasta que la semana empiece después del último día del mes
  const ultimoDiaMes = new Date(año, mes + 1, 0); // último día del mes actual

  while (fechaInicio <= ultimoDiaMes) {
    const inicioSemana = new Date(fechaInicio);
    const finSemana = new Date(fechaInicio);
    finSemana.setDate(finSemana.getDate() + 6);

    fechas.push({ inicio: inicioSemana, fin: finSemana });

    fechaInicio.setDate(fechaInicio.getDate() + 7);
  }

  return fechas;
}




  // Formatear fecha yyyy-mm-dd
  function formatearFecha(fecha) {
    return fecha.toISOString().slice(0, 10);
  }

  // Crear opciones para el select con las semanas
 function cargarOpcionesSemanas() {
  const semanas = obtenerSemanasDelMesActual();

  // Limpiar opciones previas
  selectSemana.innerHTML = "";

  if (semanas.length === 0) {
    console.warn("No se encontraron semanas para el mes actual");
    //resumenLabel.textContent = "No hay semanas disponibles";
    return;
  }

  semanas.forEach((semana, idx) => {
    const opcion = document.createElement("option");
    opcion.value = idx;
    opcion.textContent = `${formatearFecha(semana.inicio)} - ${formatearFecha(semana.fin)}`;
    selectSemana.appendChild(opcion);
  });

  // Seleccionar la semana actual (la que contiene hoy)
  const hoy = new Date();
  const indiceActual = semanas.findIndex(semana =>
    hoy >= semana.inicio && hoy <= semana.fin
  );

  selectSemana.selectedIndex = indiceActual !== -1 ? indiceActual : 0;

  cargarResumenSemanal(semanas[selectSemana.selectedIndex].inicio, semanas[selectSemana.selectedIndex].fin);
}



  // Cargar resumen según semana seleccionada
  async function cargarResumenSemanal(fechaInicio, fechaFin) {
    //resumenLabel.textContent = `${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;

    try {
      const res = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/asistencia/resumen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fecha_inicio: formatearFecha(fechaInicio),
          fecha_fin: formatearFecha(fechaFin)
        })
      });

      if (!res.ok) throw new Error("Error al cargar resumen semanal");

      const data = await res.json();

      const tbody = document.querySelector("#summaryTable tbody");
      tbody.innerHTML = "";

      data.forEach(emp => {
        const tr = document.createElement("tr");
        console.log(emp.dias_asistencia_confirmada)

       tr.innerHTML = `
  <td class="celda-nombre">${emp.nombre}</td>
  <td class="celda-num">${emp.dias_asistidos}</td>
  <td class="celda-salario">$${emp.salario_acumulado}</td>
   <td class="celda-num">
  
    ${emp.asistio_hoy > 0 ? '✅' : '❌'}
  </td>
`;

        tbody.appendChild(tr);
      });

    } catch (error) {
      console.error(error);
      alert("No se pudo cargar el resumen semanal.");
    }
  }

  // Evento cuando cambia la selección de semana
  selectSemana.addEventListener("change", () => {
    const semanas = obtenerSemanasDelMesActual();
    const seleccion = selectSemana.selectedIndex;
    cargarResumenSemanal(semanas[seleccion].inicio, semanas[seleccion].fin);
  });

  // Iniciar: cargar opciones y resumen por defecto
  cargarOpcionesSemanas();





});


async function registerEvent(tipo) {
  if (!empleadoSeleccionado) {
    Swal.fire({
      icon: 'warning',
      title: 'Empleado no seleccionado',
      text: 'Selecciona un empleado antes de registrar un evento.'
    });
    return;
  }

  let fecha = document.getElementById("datePicker").value;
  if (!fecha) {
    fecha = new Date().toISOString().split("T")[0];
  }

  const hora = new Date().toTimeString().split(" ")[0];

  try {
    const res = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/asistencia/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        empleado_id: empleadoSeleccionado.id_usuario,
        tipo_evento: tipo,
        fecha: fecha,
        hora: hora
      })
    });

    if (!res.ok) throw new Error("Error al registrar evento");

    Swal.fire({
      icon: 'success',
      title: 'Evento registrado',
      text: `${tipo} guardado para ${empleadoSeleccionado.nombre}`
    });

   cargarHistorial();
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo registrar el evento. Intenta más tarde.'
    });
  }
}

function abrirModalEdicion(registro) {
  // Mostrar el modal
  document.getElementById("modalEdicion").style.display = "block";

  // Guardar id_usuario y fecha para la actualización
  document.getElementById("modalIdUsuario").value = registro.id_usuario;
  document.getElementById("modalFecha").value = registro.fecha;

  // Rellenar los inputs con los datos (usar cadena vacía si es null)
  document.getElementById("modalEntrada").value = registro.entrada || "";
  document.getElementById("modalInicio").value = registro.inicio_descanso || "";
  document.getElementById("modalFin").value = registro.fin_descanso || "";
  document.getElementById("modalSalida").value = registro.salida || "";
}
function cerrarModalEdicion() {
  document.getElementById('modalEdicion').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
  // Referencias


  
});


