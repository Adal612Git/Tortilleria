// Función que obtiene coordenadas con OpenStreetMap Nominatim
async function obtenerCoordenadas(direccion) {
  if (!direccion) throw new Error("La dirección está vacía.");

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'es',
      'User-Agent': 'TuAppNombre/1.0'
    }
  });

  const data = await response.json();

  if (data.length === 0) throw new Error("No se encontraron coordenadas para esa dirección.");

  return {
    lat: data[0].lat,
    lon: data[0].lon
  };
}

// Procesar el formulario
async function procesarRegistro(formElement) {
  try {
    const nombre = formElement.querySelector('input[placeholder="Nombre completo"]').value.trim();
    const telefono = formElement.querySelector('input[placeholder="Teléfono"]').value.trim();
    const direccion = formElement.querySelector('input[placeholder^="Domicilio"]').value.trim();
    const correo = formElement.querySelector('input[placeholder="Correo electrónico"]').value.trim();
    const password = formElement.querySelector('input[placeholder="Contraseña"]').value.trim();
    const repetirPassword = formElement.querySelector('input[placeholder="Repite la contraseña"]').value.trim();

    if (!nombre || !telefono || !direccion || !correo || !password || !repetirPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos.'
      });
      return;
    }

    if (password !== repetirPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Revisa que ambas contraseñas sean iguales.'
      });
      return;
    }

    const coords = await obtenerCoordenadas(direccion);
    console.log("Coordenadas:", coords);

    const datosEnviar = {
      nombre,
      telefono,
      direccion,
      correo,
      contraseña: password,
      latitud: coords.lat,
      longitud: coords.lon
    };

    console.log(datosEnviar);

    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/clientes/insertCliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosEnviar)
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada correctamente.'
      }).then(() => {
  window.location.href = '../login/login.html';
});

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: data.mensaje || "Error desconocido"
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un problema',
      text: error.message
    });
    console.error(error);
  }
}

// Listener del formulario
document.querySelector('#formRegistro').addEventListener('submit', function (e) {
  e.preventDefault();
  procesarRegistro(this);
});
