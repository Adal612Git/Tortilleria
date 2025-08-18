const empleados = ["Juan", "Ana", "Pedro", "Laura"];
const employeeList = document.getElementById("employeeList");
const selectedEmployeeText = document.getElementById("selectedEmployee");
const datePicker = document.getElementById("datePicker");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");
let selectedEmployee = null;

datePicker.max = new Date().toISOString().split("T")[0];

empleados.forEach(nombre => {
  const li = document.createElement("li");
  li.textContent = nombre;
  li.onclick = () => selectEmployee(nombre);
  employeeList.appendChild(li);
});

function selectEmployee(nombre) {
  selectedEmployee = nombre;
  selectedEmployeeText.textContent = `Empleado: ${nombre}`;
}

function showAlert(msg) {
  alertMessage.textContent = msg;
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
}

function registerEvent(tipo) {
  const fecha = datePicker.value;
  if (!selectedEmployee || !fecha) {
    showAlert("Selecciona un empleado y una fecha.");
    return;
  }

  const hoy = new Date().toISOString().split("T")[0];
  if (fecha > hoy) {
    showAlert("No se puede registrar fechas futuras.");
    return;
  }

  const hora = new Date().toLocaleTimeString();
  const key = `registros_${selectedEmployee}`;
  const registros = JSON.parse(localStorage.getItem(key)) || {};
  if (!registros[fecha]) registros[fecha] = {};

  if (registros[fecha][tipo]) {
    showAlert(`Ya se registró ${tipo} en esta fecha.`);
    return;
  }

  registros[fecha][tipo] = hora;
  localStorage.setItem(key, JSON.stringify(registros));
  showAlert(`${tipo} registrado correctamente a las ${hora}`);
}

function showHistory() {
  const empleado = selectedEmployee;
  const mes = parseInt(document.getElementById("monthSelect").value);
  const semana = parseInt(document.getElementById("weekSelect").value);
  const output = document.getElementById("historyOutput");
  output.innerHTML = "";

  if (!empleado || isNaN(mes) || isNaN(semana)) {
    output.textContent = "Selecciona empleado, mes y semana.";
    return;
  }

  const key = `registros_${empleado}`;
  const registros = JSON.parse(localStorage.getItem(key)) || {};
  const resultados = [];

  for (let fecha in registros) {
    const d = new Date(fecha);
    if (d.getMonth() === mes && getWeekOfMonth(d) === semana) {
      const eventos = registros[fecha];
      resultados.push(`<strong>${fecha}</strong>: ${Object.entries(eventos).map(e => `${e[0]} - ${e[1]}`).join(", ")}`);
    }
  }

  output.innerHTML = resultados.length ? resultados.join("<br><br>") : "No hay registros.";
}

function getWeekOfMonth(date) {
  const day = date.getDate();
  return Math.ceil(day / 7);
}
