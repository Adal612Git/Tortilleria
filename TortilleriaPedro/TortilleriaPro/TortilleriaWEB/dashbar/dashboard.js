const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const header = document.querySelector(".dashboard-header");
const mainContent = document.querySelector(".main-content");

const id_cliente = sessionStorage.getItem("idcliente");
       console.log("Beforeunload, idcliente:", id_cliente);

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  header.classList.toggle("collapsed");
  mainContent.classList.toggle("collapsed");
});

// ➤ Proteger el acceso al dashboard
document.addEventListener("DOMContentLoaded", () => {
  const logueado = sessionStorage.getItem("usuarioLogueado");
  const rango = sessionStorage.getItem("rangoUsuario");
  const nombre = sessionStorage.getItem("nombreUsuario");
  const rol = sessionStorage.getItem("rol");

 window.addEventListener("beforeunload", function () {
  const rango = sessionStorage.getItem("rangoUsuario");

  if (rango === "cliente") {
    const id_cliente = sessionStorage.getItem("idcliente");
    if (id_cliente) {
      const dataCliente = JSON.stringify({ id_cliente: id_cliente });
      navigator.sendBeacon("http://localhost/TortilleriaPro/TortilleriaApi/public/clientes/cerrarseccion", dataCliente);
    }
  } else {
    // Asumes que es usuario normal (empleado, admin, etc)
    const id_usuario = sessionStorage.getItem("idusuario");
    if (id_usuario) {
      const dataUsuario = JSON.stringify({ id_usuario: id_usuario });
      navigator.sendBeacon("http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios/logout", dataUsuario);
    }
  }
});

  console.log("logueado:", logueado);
  console.log("rangoUsuario:", rango);
  console.log("nombreUsuario:", nombre);

  document.getElementById("nombreUsuario").innerText = nombre;
  document.getElementById("rolUsuario").innerText = rango;

  // Redirige si no hay sesión activa en esta pestaña
  if (logueado !== 'true') {
    window.location.href = '../login/login.html';
    return;
  }

 

  if (rango === "cliente") {
    // Ocultar menús que no deben ver los clientes
    ocultarMenus(["menuInicio", "menuV", "menuInventario","menuPedidos","menuReportes","menuAlmacen","menuUsuario","menuUsuarios","menuCheckList","menuMapa"]);
  } else if (rango === "empleado") {
    // Por ejemplo, ocultar menú de administración para empleados
    ocultarMenus(["menuInicio","menuHistorial","menuReportes","menuUsuarios","menuUsuarios","menuCheckList"]);
  }else if(rango === "admin"){
    ocultarMenus(["menuHistorial"])
  }

  document.getElementById('Cerrarsesion').addEventListener('click', cerrarSesion);

  //mostrarOpcionesSegunRango(rango);
});

// Opción para ocultar menús según el rol
function ocultarMenus(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

// ➤ Cerrar sesión
async function cerrarSesion() {
  const rango = sessionStorage.getItem('rangoUsuario');
  logueado = "false";
  const idUsuario = rango === 'cliente' 
    ? sessionStorage.getItem('idcliente') 
    : sessionStorage.getItem('idusuario');

  if (!idUsuario) {
    alert('No hay usuario logueado');
    return;
  }

  const url = rango === 'cliente'
    ? 'http://localhost/TortilleriaPro/TortilleriaApi/public/clientes/cerrarseccion'
    : 'http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios/logout';

  const body = rango === 'cliente'
    ? JSON.stringify({ id_cliente: idUsuario })
    : JSON.stringify({ id_usuario: idUsuario });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data.mensaje);
      sessionStorage.clear();
      window.location.href = '../login/login.html';
    } else {
      alert('Error al cerrar sesión: ' + data.mensaje);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('Error de conexión, intenta más tarde');
  }
}

// Función para cargar contenido en iframe
function cargarContenido(pagina) {
  const iframe = document.getElementById("miIframe");
  iframe.src = pagina;
}

function handleMenuClick(element, ruta) {
  // Elimina "active" de todos los <a>
  document.querySelectorAll("ul li a").forEach(link => {
    link.classList.remove("active");
  });

  // Agrega "active" al que se clicó
  element.classList.add("active");

  // Carga el contenido
  cargarContenido(ruta);
}
