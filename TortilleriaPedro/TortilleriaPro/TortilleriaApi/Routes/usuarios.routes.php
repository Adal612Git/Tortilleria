<?php
require_once __DIR__ . '/../Controllers/usuarios.controllers.php';

function usuariosRoutes($db, $uri, $method) {
    $usuariosController = new usuariosController($db);

    if (isset($uri[0]) && $uri[0] === 'usuarios') {
        switch ($method) {
            case 'GET':
                if (isset($uri[1])) {
                    $usuariosController->ObtenerUsuarioID($uri[1]);
                } else {
                    $usuariosController->ObtenerUsuarios();
                }
                break;

            case 'POST':
                if (isset($uri[1])) {
                    switch ($uri[1]) {
                        case 'login':
                            $input = json_decode(file_get_contents("php://input"), true);
                            $usuariosController->LoginUsuario($input);
                            break;

                        case 'actualizar-coordenadas':
                            $input = json_decode(file_get_contents("php://input"), true);
                            $usuariosController->actualizarCoordenadas($input);
                            break;

                        case 'insertUsuario':
                            $usuariosController->insertarUsuario();
                            break;

                        case 'logout':  // <-- Aquí agregas la ruta logout
                            $input = json_decode(file_get_contents("php://input"), true);
                            $usuariosController->cerrarSesion($input);
                            break;

                        default:
                            http_response_code(400);
                            echo json_encode(['mensaje' => 'Ruta no válida']);
                            break;
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta no válida']);
                }
                break;
             
            case 'PUT':  // Aquí el método para editar usuario
               if (isset($uri[1])) {
                    switch ($uri[1]) {
                        case 'editarUsuario':
                            $input = json_decode(file_get_contents("php://input"), true);
                            $usuariosController->editarUsuario($input);
                            break;

                        case 'activarUsuario':
                            $input = json_decode(file_get_contents("php://input"), true);
                            $usuariosController->activarUsuario($input);
                            break;

                        case 'insertUsuario':
                            $usuariosController->insertarUsuario();
                            break;

                        case 'logout':  // <-- Aquí agregas la ruta logout
                            $input = json_decode(file_get_contents("php://input"), true);
                            $usuariosController->cerrarSesion($input);
                            break;

                        default:
                            http_response_code(400);
                            echo json_encode(['mensaje' => 'Ruta no válida']);
                            break;
                    }
                } else {
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

