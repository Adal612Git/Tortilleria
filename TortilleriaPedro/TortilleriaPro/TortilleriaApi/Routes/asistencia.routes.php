<?php
require_once __DIR__ . '/../Controllers/asistencia.controller.php';

function asistenciaRoutes($db, $uri, $method) {
    $asistenciaController = new AsistenciaController($db);

    if (isset($uri[0]) && $uri[0] === 'asistencia') {
        switch ($method) {
            case 'GET':
                 
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                
                break;

            case 'POST':
                if (isset($uri[1]) && $uri[1] === 'registrar') {
                    // POST /asistencia/registrar
                    $asistenciaController->registrarEvento();
                } elseif (isset($uri[1]) && $uri[1] === 'historial') {
                    // Ejemplo: /asistencia/historial?empleado_id=3
                    $asistenciaController->obtenerHistorial();
                }elseif (isset($uri[1]) && $uri[1] === 'resumen') {
                    // Ejemplo: /asistencia/historial?empleado_id=3
                    $asistenciaController->obtenerResumenSemanal();
                }else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'Ruta inválida']);
                }
                break;
            case 'PUT':
                if (isset($uri[1]) && $uri[1] === 'editar') {
                    // POST /asistencia/registrar
                    $asistenciaController->editarEvento();
                } elseif (isset($uri[1]) && $uri[1] === 'historial') {
                    // Ejemplo: /asistencia/historial?empleado_id=3
                    $asistenciaController->obtenerHistorial();
                }else {
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
