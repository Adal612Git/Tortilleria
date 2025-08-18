document.addEventListener("DOMContentLoaded", () => {
  cargarMenu();
  cargarMenu2();
  mostrarCamposSegunMenu();
  document.getElementById("cerrarModalBtn").addEventListener("click", cerrarModal);
});

 async function cargarMenu() {
    const contenedor = document.getElementById("menu-list");
      contenedor.innerHTML = "";
    try {
      const respuesta = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/productos");
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);

      const productos = await respuesta.json();

      productos.forEach(p => {
        const producto = {
          id: p.id_producto,
          nombre: p.nombre,
          precio: parseFloat(p.precio),
          unidad: p.unidad 
        };

        const card = document.createElement("div");
        card.classList.add("menu-card");
        card.innerHTML = `
          <div class="menu-img-container">
            <img src="../${p.imagen}" alt="${p.nombre}" />
          </div>
          <h4>${p.nombre}</h4>
          <p>stock:${p.stock ?? "Sin descripción."}</p>
          <span>$${producto.precio.toFixed(2)}</span>
          <button class="btn-editar"> ✏️ Editar</button>
          <button class="btn-retirar">🗑️ Retirar</button>
        `;

            card.querySelector(".btn-editar").addEventListener("click", () => {
      const producto = {
        ...p,
        menu: p.unidad ? "materiaPrima" : "producto"
      };
      mostrarModal(producto);
    });
         card.querySelector(".btn-retirar").addEventListener("click", () => {
          retirarProducto(p);
        });

        contenedor.appendChild(card);
      });

    } catch (error) {
      console.error("Error al cargar productos:", error);
      contenedor.innerHTML = "<p style='color:red'>No se pudieron cargar los productos.</p>";
    }
  }
// Ejemplo simple de modal para editar cantidad
let productoActual = null;

function limpiarFormulario() {
  document.getElementById("nuevoNombre").value = "";
  document.getElementById("menuSeleccion").value = "materiaPrima";
  document.getElementById("unidadMedida").value = "";
  document.getElementById("cantidadMateriaPrima").value = "";
  document.getElementById("descripcionProducto").value = "";
  document.getElementById("precionuevo").value = "";
  document.getElementById("stock").value = "";

  // Limpiar imagen
  const preview = document.getElementById("previewImagen");
  preview.src = "";
  preview.style.display = "none";
  document.getElementById("inputArchivo").value = "";

  // Asegurar que los campos visibles coincidan con el menú
  mostrarCamposSegunMenu();
}



function mostrarModal(producto) {
  productoActual = producto;

  document.getElementById("modalNombre").textContent = producto.nombre;
  document.getElementById("stockActual").textContent = producto.stock;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("cantidadModificar").value = 0;

  // Mostrar unidad si es materia prima
  if (producto.menu === "materiaPrima") {
    document.getElementById("campoUnidad").style.display = "block";
    document.getElementById("unidadMostrar").textContent = producto.unidad || "—";
  } else {
    document.getElementById("campoUnidad").style.display = "none";
  }

  document.getElementById("modal").style.display = "block";
}
 let materia_prima = null;
function mostrarModalMateriaPrima(producto) {
  materia_prima = producto;
  document.getElementById("modalMateriaPrima").style.display = "block";
  document.getElementById("nombreMateria").value = producto.nombre;
  document.getElementById("stockMateria").value = producto.cantidad;
  document.getElementById("unidadMateria").value = producto.unidad; // visible pero no editable
}

function cerrarModalMateriaPrima() {
  document.getElementById("modalMateriaPrima").style.display = "none";
}

async function guardarMateriaPrima() {
  const nuevoNombre = document.getElementById("nombreMateria").value.trim();
  const nuevoStock = parseFloat(document.getElementById("stockMateria").value);
  const unidad = document.getElementById("unidadMateria").value.trim();

  if (!nuevoNombre || isNaN(nuevoStock) || nuevoStock < 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos inválidos',
      text: 'Verifica que el nombre y el stock sean válidos.'
    });
    return;
  }

  const datos = {
    id_materia: materia_prima.id_materia,
    nombre: nuevoNombre,
    cantidad: nuevoStock,
    unidad:unidad,
    menu: "materiaPrima"
  };
   console.log(datos);
  const confirmacion = await Swal.fire({
    title: "¿Guardar cambios?",
    text: "Se actualizarán los datos de la materia prima.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const respuesta = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/productos/actualizarMateriaPrima", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const result = await respuesta.json();

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Materia actualizada",
        text: "La materia prima fue actualizada correctamente",
        timer: 2000,
        showConfirmButton: false
      });
      cerrarModalMateriaPrima();
      cargarMenu2(); // Recargar materias primas
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: result.message || "No se pudo actualizar"
      });
    }

  } catch (error) {
    console.error("Error al guardar materia:", error);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor"
    });
  }
}






function sumar() {
  const cantidadActual = parseInt(document.getElementById("stockActual").textContent);
  const cantidadModificar = parseInt(document.getElementById("cantidadModificar").value);
  

  if (isNaN(cantidadModificar) || cantidadModificar <= 0) return;

  const nuevoStock = cantidadActual + cantidadModificar;
  document.getElementById("stockActual").textContent= nuevoStock;
  console.log(nuevoStock);
}

function restar() {
  const cantidadActual = parseInt(document.getElementById("stockActual").textContent);
  const cantidadModificar = parseInt(document.getElementById("cantidadModificar").value);

  if (isNaN(cantidadModificar) || cantidadModificar <= 0) return;

  const nuevoStock = Math.max(cantidadActual - cantidadModificar, 0);
  document.getElementById("stockActual").textContent = nuevoStock;
}


// Función para cerrar modal
function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

function mostrarFormulario() {
  const modal = document.getElementById("formularioProducto");
  limpiarFormulario();
  modal.style.display = "block";
}

function cerrarFormulario() {
  const modal = document.getElementById("formularioProducto");
  modal.style.display = "none";
}

// Evento click para botón cerrar (la "X")



window.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    cerrarModal();
  }
});

async function guardarCantidad() {
  const nuevoStock = parseInt(document.getElementById("stockActual").textContent);
  const nuevoPrecio = parseFloat(document.getElementById("precio").value);

  if ( isNaN(nuevoStock) || isNaN(nuevoPrecio)) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos inválidos',
      text: 'Verifica que todos los campos estén completos.'
    });
    return;
  }

 const datos = {
  id_producto: productoActual.id_producto,
  stock: nuevoStock,
  precio: nuevoPrecio,
  menu: productoActual.menu // ← opcional
};
    console.log("JSON que se va a enviar:", JSON.stringify(datos));

  const result = await Swal.fire({
    title: '¿Guardar cambios?',
    text: "Estás por actualizar el stock y precio.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/productos/actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      const respuesta = await response.json();

      if (respuesta.success) {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El producto se actualizó correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        cerrarModal();
        // Opcional: recargar productos si tienes función
         cargarMenu();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: respuesta.message || 'No se pudo actualizar el producto'
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud',
        text: 'Ocurrió un error al conectar con el servidor'
      });
    }
  }
}

async function retirarProducto(producto) {
  const confirmacion = await Swal.fire({
    title: `¿Retirar "${producto.nombre}"?`,
    text: "El producto ya no estará disponible en el sistema.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, retirar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const response = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/productos/retirar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_producto: producto.id_producto,
        activo: 0
      })
    });

    const result = await response.json();

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Producto retirado",
        text: "El producto fue desactivado correctamente",
        timer: 2000,
        showConfirmButton: false
      });
      cargarMenu(); // Recarga el menú sin el producto retirado
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "No se pudo retirar el producto"
      });
    }
  } catch (error) {
    console.error("Error al retirar producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor"
    });
  }
}

async function retirarMateriaPrima(producto) {
  const confirmacion = await Swal.fire({
    title: `¿Retirar "${producto.nombre}"?`,
    text: "El producto ya no estará disponible en el sistema.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, retirar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmacion.isConfirmed) return;

  try {
    const response = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/productos/retirarMateriaPrima", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_materia: producto.id_materia,
        activo: 0
      })
    });



    const result = await response.json();

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Producto retirado",
        text: "El producto fue desactivado correctamente",
        timer: 2000,
        showConfirmButton: false
      });
      cargarMenu();
      cargarMenu2();// Recarga el menú sin el producto retirado
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "No se pudo retirar el producto"
      });
    }
  } catch (error) {
    console.error("Error al retirar producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor"
    });
  }
}
 async function cargarMenu2() {
    const contenedor = document.getElementById("menu-list2");
      contenedor.innerHTML = "";
    try {
      const respuesta = await fetch("http://localhost/TortilleriaPro/TortilleriaApi/public/productos/materiaprima");
      if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);

      const productos = await respuesta.json();

      productos.forEach(p => {
        const producto = {
          id_materia: p.id_materia,
          nombre: p.nombre,
          cantidad: parseFloat(p.cantidad),
          unidad: p.unidad_medida || "pieza",
          menu: p.unidad ? "materiaPrima" : "producto" // ← deducido
        };
        console.log(producto);

        const card = document.createElement("div");
        card.classList.add("card-materia-prima");
        card.innerHTML = `
          <h4>${p.nombre}</h4>
          <p>Stock: ${p.cantidad ?? "Sin descripción."}</p>
          <span class="unidad">unidad: ${producto.unidad}</span>
          <div class="acciones">
            <button class="btn-editar">✏️ Editar</button>
            <button class="btn-retirar">🗑️ Retirar</button>
          </div>
        `;

        card.querySelector(".btn-editar").addEventListener("click", () => {
       
        mostrarModalMateriaPrima(producto);
      });
         card.querySelector(".btn-retirar").addEventListener("click", () => {
          retirarMateriaPrima(p);
        });

        contenedor.appendChild(card);
      });

    } catch (error) {
      console.error("Error al cargar productos:", error);
      contenedor.innerHTML = "<p style='color:red'>No se pudieron cargar los productos.</p>";
    }
  }

  function mostrarCamposSegunMenu() {
  const seleccion = document.getElementById("menuSeleccion").value;
  const materia = document.getElementById("camposMateriaPrima");
  const listo = document.getElementById("camposProductoListo");

  // Obtener también los campos y sus etiquetas
  const precio = document.getElementById("precionuevo");
  const stock = document.getElementById("stock");
  const labelPrecio = document.querySelector('label[for="precionuevo"]');
  const labelStock = document.querySelector('label[for="stock"]');
  const dropArea = document.getElementById("dropArea");
  const previewImagen = document.getElementById("previewImagen");
  const labelImagen = document.getElementById("labelImagen");
    const controlaStock = document.getElementById("controlaStock");
  const labelControlaStock = document.getElementById("labelControlaStock");

  if (seleccion === "materiaPrima") {
    materia.style.display = "block";
    listo.style.display = "none";

    precio.style.display = "none";
    labelPrecio.style.display = "none";

    stock.style.display = "none";
    labelStock.style.display = "none";

    dropArea.style.display = "none";
    previewImagen.style.display = "none";
      if (controlaStock) controlaStock.style.display = "none";
    if (labelControlaStock) labelControlaStock.style.display = "none";

     if (labelImagen) labelImagen.style.display = "none";
  } else {
    materia.style.display = "none";
    listo.style.display = "block";

    precio.style.display = "inline-block";
    labelPrecio.style.display = "inline-block";

    stock.style.display = "inline-block";
    labelStock.style.display = "inline-block";

    dropArea.style.display = "block";
        // Mostrar controlaStock
    if (controlaStock) controlaStock.style.display = "inline-block";
    if (labelControlaStock) labelControlaStock.style.display = "inline-block";

      if (labelImagen) labelImagen.style.display = "block";
  }
}



const dropArea = document.getElementById('dropArea');
const inputArchivo = document.getElementById('inputArchivo');
const previewImagen = document.getElementById('previewImagen');

// Permitir click para abrir selector de archivo
dropArea.addEventListener('click', () => {
  inputArchivo.click();
});

function mostrarPreviewArchivo() {
  const file = inputArchivo.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImagen.src = e.target.result;
      previewImagen.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    // Asignar archivo al input file para poder enviarlo luego en el formulario
    inputArchivo.files = event.dataTransfer.files;
    mostrarPreviewArchivo();
  }
}

function guardarProducto() {
  const formData = new FormData();

  const nombre = document.getElementById('nuevoNombre').value;
  const menu = document.getElementById('menuSeleccion').value;
  const descripcion = document.getElementById('descripcionProducto').value;
  const precio = document.getElementById('precionuevo').value;
  const stock = document.getElementById('stock').value;
  const imagen = document.getElementById('inputArchivo').files[0];

  // Obtener valor controla_stock (solo si existe el elemento)
  const controlaStockElem = document.getElementById('controlaStock');
  const controlaStock = controlaStockElem ? controlaStockElem.value : "0";

  formData.append('nombre', nombre);
  formData.append('menu', menu);
  formData.append('descripcion', descripcion);
  formData.append('precio', precio);
  formData.append('stock', stock);
  formData.append('imagen', imagen);
  formData.append('controla_stock', controlaStock);  // <-- aquí lo agregas

  if (menu === "materiaPrima") {
    const unidadMedida = document.getElementById('unidadMedida').value;
    const cantidadMateriaPrima = document.getElementById('cantidadMateriaPrima').value;
    formData.append('unidadMedida', unidadMedida);
    formData.append('cantidadMateriaPrima', cantidadMateriaPrima);
  } else {
    formData.append('unidadMedida', "");
    formData.append('cantidadMateriaPrima', "");
  }

  // Debug
  console.log("Contenido de formData:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/productos/guardar', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Producto guardado',
          text: ' Producto guardado correctamente',
          confirmButtonText: 'OK'
        }).then(() => {
          cerrarFormulario();
          cargarMenu();   // Recargar menú
          cargarMenu2();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Error',
          text: '⚠️ Error al guardar: ' + data.message,
          confirmButtonText: 'OK'
        });
      }
    })
    .catch(error => {
      console.error('Error en la petición:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: ' Error de conexión o servidor',
        confirmButtonText: 'OK'
      });
    });
}




// Opcional: asegurarte que el formulario inicia bien cuando se abre
document.addEventListener("DOMContentLoaded", () => {
  mostrarCamposSegunMenu();
   const btnGuardar = document.getElementById("btn-guardar");
  if(btnGuardar){
    btnGuardar.addEventListener("click", guardarProducto);
  }

  document.getElementById("guardarMateriaPrima").addEventListener("click",(e)=>{
    e.preventDefault();
    guardarMateriaPrima();
  })
});






