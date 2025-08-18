<?php
require_once __DIR__ . '/../Controllers/pedidoEspecial.controller.php';

function pedidoEspecialRoutes($db, $uri, $method) {
    $pedidoEspecialController = new pedidoEspecialController($db);

    if (isset($uri[0]) && $uri[0] === 'pedidoEspecial') {
        switch ($method) {
            case 'GET':
                 
                        if (isset($uri[1]) && $uri[1] === 'listar') {
                    // GET /pedidoEspecial/listar
                    $pedidoEspecialController->obtenerPedidosEspeciales();
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                }
                break;
                
                break;

            case 'POST':
                if (isset($uri[1]) && $uri[1] === 'crear') {
                    // POST /asistencia/registrar
                    $pedidoEspecialController->crearPedidoEspecial();
                
                }else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                }
                break;
            case 'PUT':
                   if (isset($uri[1]) && $uri[1] === 'marcarPagado') {
                $pedidoEspecialController->marcarPedidoPagado();
        
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                }
                break;          
            default:
                http_response_code(405);
                echo json_encode(['mensaje' => 'Método no permitido']);
                break;
        }
        return true; // Ruta procesada
    }
    return false; // No es ruta asistencia
}
