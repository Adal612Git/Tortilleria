<?php
require_once __DIR__ . "/../Models/ventas.models.php";

class VentaController {
    private $ventaModel;

    public function __construct($db) {
        $this->ventaModel = new Venta($db);
    }

    public function crearVenta() {
        // Obtener datos JSON del POST
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset( $input['id_usuario'], $input['total'], $input['detalles'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos requeridos']);
            return;
        }

        $idSucursal = $input['id_sucursal'];
        $idUsuario = $input['id_usuario'];
        $total = $input['total'];
        $detalles = $input['detalles'];
        $tipo = $input["tipo"];

        try {
            $idVenta = $this->ventaModel->crearVenta($tipo, $idUsuario, $total, $detalles);

            http_response_code(201);
            echo json_encode(['mensaje' => 'Venta creada', 'id_venta' => $idVenta]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear la venta: ' . $e->getMessage()]);
        }
    }
public function resumenComparativoMes() {

    $input = json_decode(file_get_contents('php://input'), true);
$mes = $input['mes'] ?? null;

    try {
        $resumen = $this->ventaModel->obtenerResumenMes($mes);

        if ($resumen) {
            echo json_encode([
                'success' => true,
                'resumen' => $resumen
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No se encontró resumen para el mes'
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}


        public function obtenerDetalles($id_venta) {
        $detalles = $this->ventaModel->obtenerDetallesPorVenta($id_venta);
        if ($detalles) {
            echo json_encode([
                "success" => true,
                "detalles" => $detalles
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "No se encontraron detalles para esa venta."
            ]);
        }
    }

    public function obtenerVentasPaginadas() {
    // Recibir parámetros GET (pueden venir vacíos)
  // Leer datos JSON del POST
$input = json_decode(file_get_contents("php://input"), true);

$limit = isset($input['limit']) ? intval($input['limit']) : 10;
$offset = isset($input['offset']) ? intval($input['offset']) : 0;
$idVenta = $input['idVenta'] ?? null;
$fechaInicio = $input['fechaInicio'] ?? null;
$fechaFin = $input['fechaFin'] ?? null;

    $filtros = [];
    if ($idVenta) $filtros['idVenta'] = $idVenta;
    if ($fechaInicio) $filtros['fechaInicio'] = $fechaInicio;
    if ($fechaFin) $filtros['fechaFin'] = $fechaFin;

    try {
        $ventas = $this->ventaModel->obtenerVentasPaginadas($limit, $offset, $filtros);
        $total = $this->ventaModel->contarVentas($filtros);

        echo json_encode([
            'success' => true,
            'data' => $ventas,
            'total' => $total
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'mensaje' => $e->getMessage()]);
    }
}
}
