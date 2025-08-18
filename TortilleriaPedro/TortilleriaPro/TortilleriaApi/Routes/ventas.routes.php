<?php
require_once __DIR__ . '/../Controllers/venta.controllers.php';

function ventasRoutes($db, $uri, $method) {
    $ventasController = new VentaController($db);

    if (isset($uri[0]) && $uri[0] === 'venta') {
        switch ($method) {
            case 'GET':
               if (isset($uri[1]) && $uri[1] === 'resumen') {
              
                  
                    
                } else {
                    $ventasController;
                }
                break;

            case 'POST':
                if (isset($uri[1]) && $uri[1] === 'insertarVenta') {
                    $input = json_decode(file_get_contents("php://input"), true);
                    $ventasController->crearVenta($input);
                } elseif (isset($uri[1]) && $uri[1] === 'cargarVentas') {
                    
                    $ventasController->obtenerVentasPaginadas();
                }
                 elseif (isset($uri[1]) && $uri[1] === 'obtenerDetallesID') {
                    $input = json_decode(file_get_contents("php://input"), true);
                    $ventasController->obtenerDetalles($input);
                }
                elseif (isset($uri[1]) && $uri[1] === 'resumen') {
                    
                    $ventasController->resumenComparativoMes();
                }else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta no válida']);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(['mensaje' => 'Método no permitido']);
                break;
        }

        return true; // Ruta de usuarios encontrada y procesada
    }

    return false; // No coincide con rutas de usuarios
}
?>
