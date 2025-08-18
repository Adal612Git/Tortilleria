
console.log('🛠️ Versión nueva del archivo JS cargada');
const map = L.map('map').setView([20.6767, -103.3476], 13);


L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors & Carto',
  subdomains: 'abcd',
  maxZoom: 19,
  attributionControl: true
}).addTo(map);

// Mover el control de atribución a la esquina superior derecha
map.attributionControl.setPosition('topright');
let marcadoresRepartidores = [];

setInterval(() => {
  cargarRepartidores();
}, 5000);

cargarSucursales();
cargarClientes();

// Icono para motos
const motoIcon = L.icon({
  iconUrl: 'http://localhost/TortilleriaPro/TortilleriaWEB/landing/iconos/bicicletadereparto.png',
  iconSize: [40, 40], // tamaño del icono
  iconAnchor: [20, 40], // punto del icono que corresponde a la posición (x,y)
  popupAnchor: [0, -40]  // punto desde donde se abrirá el popup respecto al iconAnchor
});

const tiendaIcon = L.icon({
  iconUrl: 'http://localhost/TortilleriaPro/TortilleriaWEB/landing/iconos/tienda.png',
  iconSize: [40, 40], // tamaño del icono
  iconAnchor: [20, 40], // punto del icono que corresponde a la posición (x,y)
  popupAnchor: [0, -40]  // punto desde donde se abrirá el popup respecto al iconAnchor
});

const sucursalIcon = L.icon({
  iconUrl: 'http://localhost/TortilleriaPro/TortilleriaWEB/landing/iconos/4661477.png',
  iconSize: [40, 40], // tamaño del icono
  iconAnchor: [20, 40], // punto del icono que corresponde a la posición (x,y)
  popupAnchor: [0, -40]  // punto desde donde se abrirá el popup respecto al iconAnchor
});


async function cargarRepartidores() {
  try {
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/usuarios');

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const usuarios = await response.json();
    console.log('Usuarios recibidos:', usuarios);

    // Elimina los marcadores anteriores
    marcadoresRepartidores.forEach(marker => map.removeLayer(marker));
    marcadoresRepartidores = [];

    usuarios.forEach(usuario => {
      const lat = parseFloat(usuario.latitud);
      const lng = parseFloat(usuario.longitud);
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`⚠️ Coordenadas inválidas para ${usuario.nombre}`);
        return;
      }

      if (usuario.rol && usuario.rol.trim().toLowerCase() === 'repartidor') {
        const marker = L.marker([lat, lng], { icon: motoIcon })
          .addTo(map)
          .bindPopup(`<b>${usuario.nombre}</b><br>${usuario.sucursal}`);

        marcadoresRepartidores.push(marker);
      }
    });

  } catch (error) {
    console.error('❌ Error al cargar usuarios:', error);
  }
}


async function cargarSucursales(){
  try{

    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/sucursales')

    if(!response.ok) throw new Error(`Error HTTP: ${response.status}` );

    const sucursales = await response.json();

    sucursales.forEach(sucursal=>{
      const lat = parseFloat(sucursal.latitud);
      const lng = parseFloat(sucursal.longitud);
      const markerOptions={};
      markerOptions.icon =sucursalIcon;
      L.marker([lat, lng], markerOptions)
      .addTo(map)
      .bindPopup(`<b>${sucursal.nombre}</b><br>${sucursal.direccion}`);
    })

  }catch(error){
    console.log("Error al cargar sucursales");
  }
}

async function cargarClientes() {
  try {
    const response = await fetch('http://localhost/TortilleriaPro/TortilleriaApi/public/clientes');
  
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const clientes = await response.json();
    console.log("clientes ", clientes);

    clientes.forEach(cliente => {
      const lat = parseFloat(cliente.latitud);
      const lng = parseFloat(cliente.longitud);

      // Validar que lat y lng sean números válidos antes de crear marcador
      if (!isNaN(lat) && !isNaN(lng)) {
        const markerOptions = {
          icon: tiendaIcon
        };

        L.marker([lat, lng], markerOptions)
          .addTo(map)
          .bindPopup(`<b>${cliente.nombre}</b><br>${cliente.direccion}<br>${cliente.telefono}`);
      } else {
        console.warn(`Cliente con id ${cliente.id_cliente} tiene coordenadas inválidas: lat=${cliente.latitud}, lng=${cliente.longitud}`);
      }
    });
  } catch (error) {
    console.error("Error al cargar los clientes:", error);
  }
}

  


