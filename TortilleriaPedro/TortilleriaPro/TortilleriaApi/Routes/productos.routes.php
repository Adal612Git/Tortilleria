<?php
require_once __DIR__ . '/../Controllers/productos.controllers.php';

function productosRoutes($db, $uri, $method) {
    $productosController = new ProductosController($db);

    if (isset($uri[0]) && $uri[0] === 'productos') {
        switch ($method) {
          case 'GET':
                    if (isset($uri[1]) && $uri[1] === "materiaprima") {
                        $productosController->obtenermateriaprima();
                    } else {
                        $productosController->obtenerProductos();
                    }
                    break;

            case 'PUT':
                if (isset($uri[1])) {
                    if ($uri[1] === 'actualizar') {
                        $productosController->actualizarProducto();
                    } elseif ($uri[1] === 'retirar') {
                        $productosController->retirarProducto();
                    }elseif($uri[1] === 'actualizarMateriaPrima'){
                        $productosController->editarMateriaPrima();
                    }elseif($uri[1] === 'retirarMateriaPrima'){
                            $productosController->retirarMateriaPrima();
                    }else {
                        http_response_code(400);
                        echo json_encode(['mensaje' => 'Ruta PUT inválida']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Falta especificar ruta PUT']);
                }
                break;

            case 'POST':
                if (isset($uri[1])) {
                    switch ($uri[1]) {
                        case 'guardar':
                            $productosController->guardarProducto();
                            break;
                        case 'otraRutaPost':
                            // Lógica para otra ruta POST si tienes
                            break;
                        default:
                            http_response_code(400);
                            echo json_encode(['mensaje' => 'Ruta POST inválida']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Falta especificar ruta POST']);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(['mensaje' => 'Método no permitido']);
                break;
        }
        return true; // Ruta procesada
    }
    return false; // No es ruta productos
}
