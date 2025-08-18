<?php
require_once __DIR__ . '/../Controllers/sucursales.controllers.php';

function sucursalesRoutes($db, $uri, $method) {
    $sucursalesController = new sucursalesController($db);

    if (isset($uri[0]) && $uri[0] === 'sucursales') {
        switch ($method) {
            case 'GET':
                // Si quieres obtener por ID
                if (isset($uri[1])) {
                    // Puedes implementar obtener sucursal por ID si tienes método
                    //$sucursalesController->obtenerSucursalPorID($uri[1]);
                } else {
                    $sucursalesController->obtenerSucursales();
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
?>