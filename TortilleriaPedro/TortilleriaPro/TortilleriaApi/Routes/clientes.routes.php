<?php
require_once __DIR__ . '/../Controllers/clientes.controllers.php';

function clientesRoutes($db, $uri, $method) {
    $clientesController= new clienteController($db);

    if (isset($uri[0]) && $uri[0] === 'clientes') {
        switch ($method) {
            case 'GET':
                // Si quieres obtener por ID
                if (isset($uri[1])) {
                    // Puedes implementar obtener sucursal por ID si tienes método
                    //$sucursalesController->obtenerSucursalPorID($uri[1]);
                } else {
                    $clientesController->obtenerClientes();
                }
                break;
            case 'POST':
                if (isset($uri[1]) && $uri[1] === 'insertCliente') {
                    $clientesController->insertarCliente();
                }elseif(isset($uri[1]) && $uri[1] == 'logincliente'){

                    $clientesController->loginCliente();
                }elseif(isset($uri[1]) && $uri[1] == 'cerrarseccion'){

                    $clientesController->cerrarSesionCliente();
                }
                break;
            case 'PUT':
                 if (isset($uri[1]) && $uri[1] === 'editarCliente') {
                    $input = json_decode(file_get_contents("php://input"), true);
                    $clientesController->editarCliente($input);
                }elseif(isset($uri[1]) && $uri[1] == 'activarCliente'){
                    $input= json_decode(file_get_contents("php://input"),true);
                    $clientesController->activarCliente($input);
                }
                break;
            default:
                http_response_code(405);
                echo json_encode(['mensaje' => 'Método no permitido']);
                break;
        }
        return true; // Ruta procesada
    }
    return false; // No es ruta sucursales
}
