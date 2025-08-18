<?php
require_once __DIR__ . "/../Models/pedido.model.php";
require_once __DIR__ . '/../Models/ventas.models.php';

class pedidoController {
    private $pedidoController;

    public function __construct($db) {
        $this->pedidoController = new Pedido($db);
    }

 public function listarAgrupado() {
    header('Content-Type: application/json; charset=utf-8');
  try {
    $resultados = $this->pedidoController->obtenerTodosHoy();

    $pedidosAgrupados = [];

    foreach ($resultados as $fila) {
      $id = $fila['id_pedido'];

      if (!isset($pedidosAgrupados[$id])) {
        $pedidosAgrupados[$id] = [
          'id_pedido' => $fila['id_pedido'],
          'fecha_pedido' => $fila['fecha_pedido'],
          'estado_pedido' => $fila['estado_pedido'],
          'total' => $fila['total'],
          'cliente' => [
            'id_cliente' => $fila['id_cliente'],
            'nombre' => $fila['nombre_cliente'],
            'telefono' => $fila['telefono_cliente'],
            'direccion' => $fila['direccion_cliente'],
            'correo' => $fila['correo_cliente'],
            'latitud' => $fila['latitud'],
            'longitud' => $fila['longitud']
          ],
          'productos' => []
        ];
      }

      $pedidosAgrupados[$id]['productos'][] = [
        'id_producto' => $fila['id_producto'],
        'nombre' => $fila['nombre_producto'],
        'descripcion' => $fila['descripcion'],
        'precio_unitario' => $fila['precio_unitario'],
        'cantidad' => $fila['cantidad'],
        'subtotal' => $fila['subtotal_producto']
      ];
    }

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'pedidos' => array_values($pedidosAgrupados)
    ]);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
      'success' => false,
      'mensaje' => 'Error al obtener pedidos agrupados: ' . $e->getMessage()
    ]);
  }
}

public function obtenerPedidosPaginados() {
    // Leer JSON enviado por POST
    $input = json_decode(file_get_contents("php://input"), true);

    $limit = isset($input['limit']) ? intval($input['limit']) : 10;
    $offset = isset($input['offset']) ? intval($input['offset']) : 0;
    $idPedido = $input['idPedido'] ?? null;
    $fechaInicio = $input['fechaInicio'] ?? null;
    $fechaFin = $input['fechaFin'] ?? null;
    $idCliente = $input['idCliente'] ?? null;
    $filtros = [];
    if ($idPedido) $filtros['idPedido'] = $idPedido;
    if ($fechaInicio) $filtros['fechaInicio'] = $fechaInicio;
    if ($fechaFin) $filtros['fechaFin'] = $fechaFin;
    if($idCliente) $filtros['idCliente'] = $idCliente;

    try {
        $pedidos = $this->pedidoController->obtenerPedidosPaginados($limit, $offset, $filtros);
        $total = $this->pedidoController->contarPedidos($filtros);

        echo json_encode([
            'success' => true,
            'data' => $pedidos,
            'total' => $total
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'mensaje' => $e->getMessage()]);
    }
}

public function obtenerDetallesPedido() {
    try {
        // Leer el JSON del body
        $input = json_decode(file_get_contents("php://input"), true);
        $idPedido = isset($input['idPedido']) ? intval($input['idPedido']) : null;

        if (!$idPedido) {
            echo json_encode([
                'success' => false,
                'message' => 'ID de pedido no proporcionado'
            ]);
            return;
        }

        $detalles = $this->pedidoController->obtenerDetallesPedidoID($idPedido);

        if ($detalles) {
            echo json_encode([
                'success' => true,
                'detalles' => $detalles
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No se encontraron detalles para este pedido.'
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




  public function cambiarEstado() {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id_pedido'], $input['nuevo_estado'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos: id_pedido o estado']);
        return;
    }

    $idPedido = $input['id_pedido'];
    $nuevoEstado = $input['nuevo_estado'];
    $idRepartidor = $input['id_repartidor'] ?? null; // opcional, solo para 'entregado'

    try {
        // Actualizar estado y, si es entregado, actualizar id_repartidor también
        if ($nuevoEstado === 'entregado' && $idRepartidor !== null) {
            $resultado = $this->pedidoController->actualizarEstadoYRepartidor($idPedido, $nuevoEstado, $idRepartidor);
        } else {
            $resultado = $this->pedidoController->actualizarEstado($idPedido, $nuevoEstado);
        }

        if ($resultado) {
            // Si cambió a entregado, crear venta automática
            if ($nuevoEstado === 'entregado') {
                // Obtener datos del pedido para crear venta
                $pedido = $this->pedidoController->obtenerPorId($idPedido);
                $detalles = $this->pedidoController->obtenerDetalles($idPedido);

                // Aquí deberías llamar a tu modelo de Venta para crear la venta
                $ventaModel = new Venta($this->pedidoController->getConexion()); // o como lo tengas configurado
                $ventaId = $ventaModel->crearVenta(
                    'Reparto',               // tipo o puedes usar otro que identifique que es por reparto
                      null,// el cliente que hizo el pedido
                    $pedido['total'],
                    $detalles,
                    $pedido['id_cliente']
                );

                  error_log("VENTA REGISTRADA CON ID: " . $ventaId);
            }

            echo json_encode(['success' => true, 'mensaje' => 'Estado actualizado correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'mensaje' => 'No se pudo actualizar el estado']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
    }
}

      public function crearPedido() {
        $input = json_decode(file_get_contents("php://input"), true);

        if (
            !isset($input['id_cliente']) ||
            !isset($input['total']) ||
            !isset($input['detalles']) ||
            !is_array($input['detalles'])
        ) {
            http_response_code(400);
            echo json_encode(['success' => false, 'mensaje' => 'Faltan datos o formato incorrecto']);
            return;
        }

        $idCliente = $input['id_cliente'];
        $total = $input['total'];
        $detalles = $input['detalles'];
        $estado = $input['estado'] ?? 'pendiente';

        try {
            $idPedido = $this->pedidoController->crearPedido($idCliente, $total, $detalles, $estado);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'mensaje' => 'Pedido creado correctamente',
                'id_pedido' => $idPedido
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'mensaje' => 'Error al crear pedido: ' . $e->getMessage()
            ]);
        }
    }

}
 