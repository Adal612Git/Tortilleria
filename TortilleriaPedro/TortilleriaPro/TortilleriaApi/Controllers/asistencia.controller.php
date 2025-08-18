<?php
require_once __DIR__ . "/../Models/asistencia.model.php";

class AsistenciaController {
    private $asistenciaModel;

    public function __construct($db) {
        $this->asistenciaModel = new Asistencia($db);
    }

public function obtenerHistorial() {
    header("Content-Type: application/json; charset=utf-8");

    // Obtener el cuerpo de la solicitud y decodificar el JSON
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id_usuario'])) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Falta empleado_id"]);
        return;
    }

    $empleado_id = intval($data['id_usuario']);
    $mes = isset($data['mes']) ? intval($data['mes']) : null;
    $semana = isset($data['semana']) ? intval($data['semana']) : null;

    $historial = $this->asistenciaModel->obtenerHistorial($empleado_id, $mes, $semana);

    echo json_encode($historial);
}

   public function editarEvento() {
        header("Content-Type: application/json; charset=utf-8");

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['id_usuario']) ||
            empty($data['fecha']) ||
            empty($data['tipo_evento']) ||
            empty($data['hora'])
        ) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Faltan datos requeridos para actualizar evento."]);
            return;
        }

        $id_usuario = intval($data['id_usuario']);
        $fecha = $data['fecha'];
        $tipo_evento = $data['tipo_evento'];
        $hora = $data['hora'];

        $resultado = $this->asistenciaModel->actualizarEvento($id_usuario, $fecha, $tipo_evento, $hora);

        if ($resultado) {
            http_response_code(200);
            echo json_encode(["mensaje" => "Evento actualizado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "Error al actualizar el evento."]);
        }
    }



    public function registrarEvento() {
        header("Content-Type: application/json; charset=utf-8");

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['empleado_id']) ||
            empty($data['fecha']) ||
            empty($data['tipo_evento']) ||
            empty($data['hora'])
        ) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Faltan datos requeridos."]);
            return;
        }

        $empleado_id = intval($data['empleado_id']);
        $fecha = $data['fecha'];
        $tipo_evento = $data['tipo_evento'];
        $hora = $data['hora'];

        $resultado = $this->asistenciaModel->registrarEvento($empleado_id, $fecha, $tipo_evento, $hora);

        if ($resultado) {
            http_response_code(201);
            echo json_encode(["mensaje" => "Evento registrado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "Error al registrar el evento."]);
        }
    }

       public function obtenerResumenSemanal() {
        header("Content-Type: application/json; charset=utf-8");

        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['fecha_inicio']) || empty($data['fecha_fin'])) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Faltan las fechas de inicio y fin."]);
            return;
        }

        $fecha_inicio = $data['fecha_inicio'];
        $fecha_fin = $data['fecha_fin'];

        $resultado = $this->asistenciaModel->obtenerResumenSemanal($fecha_inicio, $fecha_fin);

        echo json_encode($resultado);
    }

}
?>
