const loginForm = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMensaje();

  const correo = loginForm.correo.value.trim();
  const password = loginForm.password.value.trim();

  if (!correo || !password) {
    mostrarMensaje('Por favor, completa todos los campos', 'red');
    return;
  }

  try {
    // PRIMER INTENTO: login como usuario (empleado/admin)
    let response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });

    let data = await response.json();

    if (data.estado === "SESION_ACTIVA") {
      mostrarMensaje(data.mensaje || "Ya hay una sesión activa para este usuario.", "red");
      return; // bloquea el login
    }

    if (response.ok) {
      console.log("Respuesta del login:", data);
      procesarLogin(data, 'usuario');
      return;
    }

    // SEGUNDO INTENTO: login como cliente
    response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/clientes/logincliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña: password })
    });

    data = await response.json();
    if (data.estado === "SESION_ACTIVA") {
  mostrarMensaje(data.mensaje || "Ya hay una sesión activa para este cliente.", "red");
  return; // bloquea el login
}

    if (response.ok) {
      console.log("Respuesta del login:", data);
      procesarLogin(data, 'cliente');
    } else {
      mostrarMensaje(data.mensaje || 'Credenciales incorrectas.', 'red');
    }

  } catch (error) {
    console.error('Error:', error);
    mostrarMensaje('Error de conexión. Intenta más tarde.', 'red');
  }
});
function procesarLogin(data, tipo) {
  mostrarMensaje(data.mensaje, 'green');

  const user = data[tipo]; // data.usuario o data.cliente
  console.log(user);

  // CAMBIADO A sessionStorage
  sessionStorage.setItem('usuarioLogueado', 'true');
  sessionStorage.setItem('tipoUsuario', tipo); // 'usuario' o 'cliente'
  sessionStorage.setItem('nombreUsuario', user.nombre || '');
  sessionStorage.setItem('correo', user.correo || '');
  sessionStorage.setItem('rangoUsuario', user.rol || 'cliente');

  if (tipo === 'usuario') {
    sessionStorage.setItem('idsucursal', user.id_sucursal || '');
    sessionStorage.setItem('idusuario', user.id_usuario || '');
  } else {
    sessionStorage.setItem('idcliente', user.id_cliente || '');
    sessionStorage.setItem('latitud', user.latitud || '');
    sessionStorage.setItem('longitud', user.longitud || '');
  }

  // Validar rol para impedir acceso a repartidores
  if (user.rol === 'repartidor') {
    mostrarMensaje('Acceso denegado para repartidores.', 'red');
    // Opcional: limpiar sessionStorage y no redirigir
    sessionStorage.clear();
    return; // Detener ejecución y no redirigir
  }

  // Redirigir si no es repartidor
  setTimeout(() => {
    const destino = '../dashbar/index.html';
    window.location.href = destino;
  }, 1000);
}


function mostrarMensaje(texto, color = 'red') {
  mensaje.textContent = texto;
  mensaje.style.color = color;
}

function clearMensaje() {
  mensaje.textContent = '';
}
