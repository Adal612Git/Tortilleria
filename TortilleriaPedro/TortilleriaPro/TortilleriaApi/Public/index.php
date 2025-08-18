<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
// Cambia esto si conoces la IP de tu celular o usa * solo para desarrollo
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Para solicitudes preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../Routes/usuarios.routes.php';
require_once __DIR__ . '/../Routes/sucursales.routes.php';
require_once __DIR__ . '/../Routes/productos.routes.php';
require_once __DIR__ . '/../Routes/clientes.routes.php';
require_once __DIR__ . '/../Routes/ventas.routes.php';
require_once __DIR__ . '/../Routes/asistencia.routes.php';
require_once __DIR__ . '/../Routes/pedidoEspecial.routes.php';
require_once __DIR__ . '/../Routes/pedido.routes.php';

$db = (new Database())->getConnection();

$base_path = '/TortilleriaPro/TortilleriaApi/public/';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Debug: muestra la URL original y el path
// var_dump($_SERVER['REQUEST_URI'], $path);

if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}
$method = $_SERVER['REQUEST_METHOD'];

$uri = explode('/', trim($path, '/'));
$uri = array_map('trim', $uri);

error_log('URI recibida: ' . print_r($uri, true));
error_log('METHOD recibido: ' . $method);




if (usuariosRoutes($db, $uri, $method)) {
    
    exit;
}

if(sucursalesRoutes($db,$uri,$method)){
    exit;
}
if(clientesRoutes($db,$uri,$method)){
    exit;
}
if(productosRoutes($db,$uri,$method)){
    exit;
}
if(ventasRoutes($db,$uri,$method)){
    exit;
}
if(asistenciaRoutes($db,$uri,$method)){
    exit;
}
if(pedidoEspecialRoutes($db,$uri,$method)){
    exit;
}
if(pedidoRoutes($db,$uri,$method)){
    exit;
}



http_response_code(404);
echo json_encode(['mensaje' => 'Ruta no encontrada']);