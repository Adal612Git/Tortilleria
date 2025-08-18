<?php
require_once __DIR__ . "/../Models/pedidoEspecial.model.php";

class pedidoEspecialController {
    private $pedidoEspecialController;

    public function __construct($db) {
        $this->pedidoEspecialController = new pedidoEspecial($db);
    }

        public function crearPedidoEspecial() {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input['nombre_cliente'], $input['fecha_entrega'], $input['descripcion'], $input['total'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'mensaje' => 'Faltan datos requeridos']);
            return;
        }

        $nombreCliente = $input['nombre_cliente'];
        $fechaEntrega = $input['fecha_entrega'];
        $descripcion = $input['descripcion'];
        $total = $input['total'];

        try {
            $idPedido = $this->pedidoEspecialController->guardar($nombreCliente, $fechaEntrega, $descripcion, $total);
            http_response_code(201);
            echo json_encode(['success' => true, 'mensaje' => 'Pedido especial creado', 'id_pedido' => $idPedido]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'mensaje' => 'Error al crear el pedido especial: ' . $e->getMessage()]);
        }
    }

      public function obtenerPedidosEspeciales() {
        try {
            $pedidos = $this->pedidoEspecialController->obtenerPedidosEspeciales();
            http_response_code(200);
            echo json_encode(['success' => true, 'pedidos' => $pedidos]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'mensaje' => 'Error al obtener pedidos especiales: ' . $e->getMessage()]);
        }
    }

       public function marcarPedidoPagado() {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input['id_pedido'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'mensaje' => 'ID del pedido es requerido']);
            return;
        }

        $idPedido = $input['id_pedido'];

        try {
            $resultado = $this->pedidoEspecialController->marcarPagado($idPedido);
            if ($resultado) {
                echo json_encode(['success' => true, 'mensaje' => 'Pedido marcado como pagado']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'mensaje' => 'No se pudo actualizar el pedido']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }
}
