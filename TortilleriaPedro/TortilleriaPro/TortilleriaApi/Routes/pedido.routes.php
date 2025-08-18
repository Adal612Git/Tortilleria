<?php
require_once __DIR__ . '/../Controllers/pedido.controller.php';

function pedidoRoutes($db, $uri, $method) {
    $controller = new pedidoController($db);

    if (isset($uri[0]) && $uri[0] === 'pedidoCompleto') {
        switch ($method) {
            case 'GET':
                if (isset($uri[1]) && $uri[1] === 'listar') {
                    $controller->listarAgrupado(); // 👉 GET /pedidoCompleto/listar
                } elseif (isset($uri[1]) && $uri[1] === 'ver' && isset($uri[2])) {
                    
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                }
                break;
             case 'PUT':
                if (isset($uri[1]) && $uri[1] === 'cambiarEstado') {
                    $controller->cambiarEstado();
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                }
                break;
             case 'POST':
                if (isset($uri[1]) && $uri[1] === 'crearPedido') {
                    $controller->crearPedido();
                }  elseif (isset($uri[1]) && $uri[1] === 'obtenerPedidos') {
                    $controller->obtenerPedidosPaginados();
                }elseif (isset($uri[1]) && $uri[1] === 'obtenerDetallesID') {
                   
                    $controller->obtenerDetallesPedido();}else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                }
                break;
      
            default:
                http_response_code(405);
                echo json_encode(['mensaje' => 'Método no permitido']);
                break;
        }
        return true;
    }

    return false;
}
