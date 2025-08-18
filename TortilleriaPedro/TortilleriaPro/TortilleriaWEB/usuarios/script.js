document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');
  const clienteForm = document.getElementById('client-form');
  let usuarios = []
  let clientes = [];
  // Cargar datos iniciales
  cargarUsuarios();
  cargarClientes();

document.getElementById('btnGuardarEmpleado').addEventListener('click', async (e) => {
  e.preventDefault();
  guardarEdicionUsuario();
});

document.getElementById("btnGuardarCliente").addEventListener("click",async (e)=>{
  e.preventDefault();
  guardarEdicionCliente();
})
  // Evento para registrar usuario
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoUsuario = obtenerDatosUsuario();

    if (!validarUsuario(nuevoUsuario)) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonColor: '#f39c12'
      });
      return;
    }

    const exito = await enviarUsuario(nuevoUsuario);
    if (exito) {
      Swal.fire({
        icon: 'success',
        title: '¡Usuario registrado!',
        text: 'El usuario ha sido registrado correctamente.',
        confirmButtonColor: '#3085d6'
      });

      userForm.reset();
      cargarUsuarios();
    }
  });

  // Evento para registrar cliente
  clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let nuevoCliente = obtenerDatosCliente();

    if (!validarCliente(nuevoCliente)) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos.',
        confirmButtonColor: '#f39c12'
      });
      return;
    }

   
    const coords = await obtenerCoordenadasOSM(nuevoCliente.direccion);
    if (!coords) {
      Swal.fire({
        icon: 'error',
        title: 'Ubicación no encontrada',
        text: 'No se pudieron obtener coordenadas de la dirección.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Agregar coordenadas al objeto cliente
    nuevoCliente.latitud = coords.lat;
    nuevoCliente.longitud = coords.lng;
   


    // console.log(nuevoCliente.latitud , nuevoCliente.longitud);


    const exito = await enviarCliente(nuevoCliente);
    if (exito) {
      Swal.fire({
        icon: 'success',
        title: '¡Cliente registrado!',
        confirmButtonColor: '#3085d6'
      });

      clienteForm.reset();
      cargarClientes();
    }
  });
});

// --- Funciones para usuarios ---

function obtenerDatosUsuario() {
  return {
    nombre: document.getElementById('user-name').value.trim(),
    rol: document.getElementById('user-role').value.trim().toLowerCase(),
    correo: document.getElementById('user-email').value.trim(),
    telefono: document.getElementById('user-tel').value.trim(),
    contraseña: document.getElementById('user-password').value,
    salario: parseFloat(document.getElementById('user-salary').value),
    descanso: document.getElementById('user-dayoff').value,
    
  }
}

function validarUsuario(usuario) {
  return (
    usuario.nombre !== '' &&
    usuario.rol !== '' &&
    usuario.correo !== '' &&
    usuario.telefono !== '' &&
    usuario.contraseña !== '' &&
    !isNaN(usuario.salario) &&
    usuario.descanso !== ''
  );
}

async function enviarUsuario(usuario) {
  try {
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios/insertUsuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });

    const data = await response.json();

    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: data.message || 'No se pudo insertar el usuario.',
        confirmButtonColor: '#d33'
      });
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error en la petición:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#d33'
    });
    return false;
  }
}

async function cargarUsuarios() {
  try {
    const res = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios");
    if (!res.ok) throw new Error("Error en la respuesta");
    const data = await res.json();
    const lista = document.getElementById("user-list");
    lista.innerHTML = "";
     usuarios = data;
    data.forEach(usuario => {
      crearBotones(usuario, "usuario", lista);
    });
  } catch (err) {
    console.error("Error al cargar usuarios:", err);
  }
}

// --- Funciones para clientes ---

function obtenerDatosCliente() {
  return {
    nombre: document.getElementById('client-name').value.trim(),
    direccion: document.getElementById('client-address').value.trim(),
    telefono: document.getElementById('client-phone').value.trim(),
    correo: document.getElementById('client-email').value.trim(),
    contraseña: document.getElementById('client-password').value.trim()
  };
}

function validarCliente(cliente) {
  return (
    cliente.nombre !== '' &&
    cliente.direccion !== '' &&
    cliente.telefono !== '' &&
    cliente.correo !== '' &&
    cliente.contraseña !== ''
  );
}

async function enviarCliente(cliente) {
  try {
    console.log("Cliente a enviar:", JSON.stringify(cliente, null, 2));
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/clientes/insertCliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });

    const data = await response.json();
      console.log("Respuesta cruda del servidor:", data);

    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar cliente',
        text: data.message || 'No se pudo insertar el cliente.',
        confirmButtonColor: '#d33'
      });
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error en la petición:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#d33'
    });
    return false;
  }
}

async function cargarClientes() {
  try {
    const res = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/clientes");
    const data = await res.json();
    const lista = document.getElementById("client-list");
    lista.innerHTML = "";
    clientes  = data
    data.forEach(cliente => {
      crearBotones(cliente, "cliente", lista);
    });
  } catch (err) {
    console.error("Error al cargar clientes:", err);
  }
}

// --- Función para crear botones y mostrar items (usuarios o clientes) ---

function crearBotones(item, tipo, contenedor) {
  const li = document.createElement('li');

  // Guardar id y tipo en dataset para usar luego
  li.dataset.id = tipo === 'usuario' ? item.id_usuario : item.id_cliente;
  li.dataset.tipo = tipo;

  // Estado inicial
  let activo = item.activo == 1 || item.activo === '1'; // Asegura booleano
  li.dataset.activo = activo ? '1' : '0';

  // Ajustar clase y texto botón segun activo
  if (activo) {
    li.classList.add('activo');
  } else {
    li.classList.add('inactivo');
  }

  let contenido = '';
  if (tipo === 'usuario') {
    contenido = `
      <strong>${item.nombre}</strong><br>
      Correo: ${item.correo}<br>
      Rol: ${item.rol}<br>
      Salario: ${item.salario}<br>
      Descanso: ${item.descanso || 'N/A'}<br>
      Teléfono: ${item.telefono || 'N/A'}
    `;
  } else if (tipo === 'cliente') {
    contenido = `
      <strong>${item.nombre}</strong><br>
      Dirección: ${item.direccion}<br>
      Teléfono: ${item.telefono}<br>
    `;
  }

  li.innerHTML = `
    <span>${contenido}</span>
    <div class="acciones">
      <button class="editar">✏️</button>
      <button class="estado">${activo ? '🔴 Desactivar' : '🟢 Activar'}</button>
      
    </div>
  `;

  // Evento activar/inactivar
  li.querySelector('.estado').addEventListener('click', async () => {
    const btn = li.querySelector('.estado');
    const id = li.dataset.id;
    const tipoEntidad = li.dataset.tipo;
    const nuevoEstado = li.dataset.activo === '1' ? '0' : '1';

    // Actualizar visualmente
    li.dataset.activo = nuevoEstado;
    if (nuevoEstado === '1') {
      li.classList.replace('inactivo', 'activo');
      btn.textContent = '🔴 Desactivar';
    } else {
      li.classList.replace('activo', 'inactivo');
      btn.textContent = '🟢 Activar';
    }

    // Definir endpoint según tipo
    let urlActualizar;
    if (tipoEntidad === 'cliente') {
      urlActualizar = `http://localhost/TortilleriaPro/TortilleriaApi/public/clientes/activarCliente`;
       bodyData = { id_cliente: parseInt(id), activo: nuevoEstado };
    } else if (tipoEntidad === 'usuario') {
      urlActualizar = `http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios/activarUsuario`;
      bodyData = { id_usuario: parseInt(id), activo: nuevoEstado };
    } else {
      console.error('Tipo no soportado para activar/inactivar');
      return;
    }

    // Enviar actualización al backend
    try {
      const response = await fetch(urlActualizar, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al cambiar estado');
      }

      console.log('Estado actualizado:', data);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      // Podrías revertir cambios visuales si falla la petición
    }
  });

    li.querySelector('.editar').addEventListener('click', () => {
    if (tipo === 'usuario') {
      abrirModalEmpleado(item);
    } else if (tipo === 'cliente') {
      abrirModalCliente(item);
    }
  });

  // Resto: editar, eliminar, etc. Igual que antes...

  contenedor.appendChild(li);
}


// --- Función para obtener coordenadas desde OpenStreetMap ---

async function obtenerCoordenadasOSM(direccion) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'MiAplicacion/1.0' } // necesario según políticas OSM
    });
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    } else {
      console.error("No se encontraron coordenadas para la dirección");
      return null;
    }
  } catch (error) {
    console.error("Error en geocodificación OSM:", error);
    return null;
  }
}

document.getElementById('buscador-usuarios').addEventListener('input', function () {
  const filtro = this.value.toLowerCase();
  const lista = document.getElementById("user-list");
  lista.innerHTML = "";

  const filtrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(filtro)
  );

  filtrados.forEach(usuario => {
    crearBotones(usuario, "usuario", lista);
  });
});

document.getElementById('buscador-clientes').addEventListener('input', function () {
  const filtro = this.value.toLowerCase();
  const lista = document.getElementById("client-list");
  lista.innerHTML = "";

  const filtrados = clientes.filter(cliente => 
    cliente.nombre_cliente.toLowerCase().includes(filtro)
  );

  filtrados.forEach(cliente => {
    crearBotones(cliente, "cliente", lista);
  });
});

// Seleccionar modales y botones cerrar
const modalEmpleado = document.getElementById('modalEmpleado');
const cerrarModalEmpleado = document.getElementById('cerrarModalEmpleado');

const modalCliente = document.getElementById('modalCliente');
const cerrarModalCliente = document.getElementById('cerrarModalCliente');

// Abrir modal empleado (para agregar o editar)
function abrirModalEmpleado(empleado = null) {


  if (empleado) {
    console.log(empleado.id_usuario);
    document.getElementById('empleado-id').value = empleado.id_usuario;
    document.getElementById('empleado-nombre').value = empleado.nombre;
    document.getElementById('empleado-rol').value = empleado.rol;
    document.getElementById('empleado-correo').value = empleado.correo;
    document.getElementById('empleado-telefono').value = empleado.telefono;
    // No se rellena la contraseña por seguridad, se puede dejar vacía
    document.getElementById('empleado-salario').value = empleado.salario;
    document.getElementById('empleado-descanso').value = empleado.descanso;

    document.getElementById('tituloEmpleado').textContent = 'Editar Empleado';
    document.getElementById('btnGuardarEmpleado').textContent = 'Guardar Cambios';
  }

  modalEmpleado.style.display = 'block';
}

// Abrir modal cliente (para agregar o editar)
function abrirModalCliente(cliente = null) {
  document.getElementById('formCliente').reset();
  document.getElementById('cliente-id').value = '';
  document.getElementById('tituloCliente').textContent = 'Agregar Cliente';
  document.getElementById('btnGuardarCliente').textContent = 'Agregar';

  if (cliente) {
    document.getElementById('cliente-id').value = cliente.id_cliente;
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-direccion').value = cliente.direccion;
    document.getElementById('cliente-telefono').value = cliente.telefono;
    document.getElementById('cliente-correo').value = cliente.correo;
    // No se rellena la contraseña
    document.getElementById('tituloCliente').textContent = 'Editar Cliente';
    document.getElementById('btnGuardarCliente').textContent = 'Guardar Cambios';
  }

  modalCliente.style.display = 'block';
}

// Cerrar modales
cerrarModalEmpleado.onclick = () => modalEmpleado.style.display = 'none';
cerrarModalCliente.onclick = () => modalCliente.style.display = 'none';

// Cerrar modal si se hace clic fuera del contenido
window.onclick = function(event) {
  if (event.target == modalEmpleado) modalEmpleado.style.display = "none";
  if (event.target == modalCliente) modalCliente.style.display = "none";
}

async function guardarEdicionUsuario() {
  // Obtén los valores del formulario (deberías tener los inputs con estos IDs)
 const id_usuario = document.getElementById('empleado-id').value;

  const nombre = document.getElementById('empleado-nombre').value.trim();
  const rol = document.getElementById('empleado-rol').value.trim().toLowerCase();
  const correo = document.getElementById('empleado-correo').value.trim();
  const telefono = document.getElementById('empleado-telefono').value.trim();
  const salario = parseFloat(document.getElementById('empleado-salario').value);
  const Descanso = document.getElementById('empleado-descanso').value;

  if (!id_usuario || !nombre || !rol || !correo || !telefono || isNaN(salario) || !Descanso) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos incompletos',
      text: 'Por favor, completa todos los campos para editar el usuario.',
      confirmButtonColor: '#f39c12'
    });
    return;
  }

  // Construye el objeto con los datos a enviar
  const usuarioEditado = {
   id_usuario: parseInt(id_usuario),
    nombre,
    rol,
    correo,
    telefono,
    salario,
    Descanso
  };

  console.log("JSON a enviar:", usuarioEditado);

// Mostrar string JSON en consola
console.log("String JSON:", JSON.stringify(usuarioEditado));

  try {
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios/editarUsuario', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioEditado)
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: data.mensaje || 'El usuario se actualizó correctamente.',
        confirmButtonColor: '#3085d6'
      });
      // Cierra el modal
      document.getElementById('modalEmpleado').style.display = 'none';

      // Aquí puedes recargar la lista de usuarios o actualizar la UI según tu lógica
      cargarUsuarios();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: data.mensaje || 'No se pudo actualizar el usuario.',
        confirmButtonColor: '#d33'
      });
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#d33'
    });
  }
}

async function guardarEdicionCliente() {
  const id = document.getElementById('cliente-id').value;
  const nombre = document.getElementById('cliente-nombre').value.trim();
  const direccion = document.getElementById('cliente-direccion').value.trim();
  const telefono = document.getElementById('cliente-telefono').value.trim();
  const correo = document.getElementById('cliente-correo').value.trim();
  const contraseña = document.getElementById('cliente-password').value.trim(); // Opcional

  if (!id || !nombre || !direccion || !telefono || !correo) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, llena todos los campos para editar el cliente.',
      confirmButtonColor: '#f39c12'
    });
    return;
  }

  const clienteEditado = {
    id_cliente: parseInt(id),
    nombre,
    direccion,
    telefono,
    correo,
    contraseña // Puedes omitirlo si no se va a actualizar
  };

  try {
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/clientes/editarCliente', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clienteEditado)
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Cliente actualizado',
        text: data.mensaje || 'El cliente se actualizó correctamente.',
        confirmButtonColor: '#3085d6'
      });

      document.getElementById('modalCliente').style.display = 'none';
      cargarClientes();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: data.mensaje || 'No se pudo actualizar el cliente.',
        confirmButtonColor: '#d33'
      });
    }
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#d33'
    });
  }
}




