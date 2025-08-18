<?php
class Pedido{
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

       public function getConexion() {
        return $this->conn;
    }

    public function obtenerTodos() {
    $sql = "SELECT * FROM vista_pedidos_completos ORDER BY fecha_pedido DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

 public function obtenerTodosHoy() {
    $sql = "SELECT
    vp.*,
    (SELECT c.latitud FROM cliente c WHERE c.id_cliente = vp.id_cliente) AS latitud,
    (SELECT c.longitud FROM cliente c WHERE c.id_cliente = vp.id_cliente) AS longitud
FROM
    vista_pedidos_completos vp
-- WHERE
--     DATE(vp.fecha_pedido) = CURDATE()
ORDER BY
    vp.fecha_pedido DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function obtenerPedidosPaginados($limit = 10, $offset = 0, $filtros = []) {
    $sql = "SELECT p.*, 
       c.nombre AS nombre_cliente,
       u.nombre AS nombre_repartidor
FROM pedido p
JOIN cliente c ON p.id_cliente = c.id_cliente
LEFT JOIN usuario u ON p.id_repartidor = u.id_usuario
WHERE 1=1";

    if (!empty($filtros['idPedido'])) {
        $sql .= " AND p.id_pedido = :idPedido";
    }
    if (!empty($filtros['idCliente'])) {
        $sql .= " AND p.id_cliente = :idCliente";
    }
    if (!empty($filtros['fechaInicio'])) {
        $sql .= " AND p.fecha >= :fechaInicio";
    }
    if (!empty($filtros['fechaFin'])) {
        $sql .= " AND p.fecha <= :fechaFin";
    }

    $sql .= " ORDER BY p.fecha DESC LIMIT :limit OFFSET :offset";

    $stmt = $this->conn->prepare($sql);

    if (!empty($filtros['idPedido'])) {
        $stmt->bindValue(':idPedido', $filtros['idPedido'], PDO::PARAM_INT);
    }
    if (!empty($filtros['idCliente'])) {
        $stmt->bindValue(':idCliente', $filtros['idCliente'], PDO::PARAM_INT);
    }
    if (!empty($filtros['fechaInicio'])) {
        $stmt->bindValue(':fechaInicio', $filtros['fechaInicio']);
    }
    if (!empty($filtros['fechaFin'])) {
        $stmt->bindValue(':fechaFin', $filtros['fechaFin']);
    }

    $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function contarPedidos($filtros = []) {
    $sql = "SELECT COUNT(*) AS total FROM pedido p WHERE 1=1";

    if (!empty($filtros['idPedido'])) {
        $sql .= " AND p.id_pedido = :idPedido";
    }
    if (!empty($filtros['idCliente'])) {
        $sql .= " AND p.id_cliente = :idCliente";
    }
    if (!empty($filtros['fechaInicio'])) {
        $sql .= " AND p.fecha >= :fechaInicio";
    }
    if (!empty($filtros['fechaFin'])) {
        $sql .= " AND p.fecha <= :fechaFin";
    }

    $stmt = $this->conn->prepare($sql);

    if (!empty($filtros['idPedido'])) {
        $stmt->bindValue(':idPedido', $filtros['idPedido'], PDO::PARAM_INT);
    }
    if (!empty($filtros['idCliente'])) {
        $stmt->bindValue(':idCliente', $filtros['idCliente'], PDO::PARAM_INT);
    }
    if (!empty($filtros['fechaInicio'])) {
        $stmt->bindValue(':fechaInicio', $filtros['fechaInicio']);
    }
    if (!empty($filtros['fechaFin'])) {
        $stmt->bindValue(':fechaFin', $filtros['fechaFin']);
    }

    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'] ?? 0;
}



      public function actualizarEstado($idPedido, $nuevoEstado) {
        $sql = "UPDATE pedido SET estado = ? WHERE id_pedido = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$nuevoEstado, $idPedido]);
    }


        public function crearPedido($idcliente, $total, $detalles, $estado = 'Pendiente') {
        try {
            $this->conn->beginTransaction();

            $sqlPedido = "INSERT INTO pedido (id_cliente, fecha, total, estado) VALUES (:id_usuario, NOW(), :total, :estado)";
            $stmtPedido = $this->conn->prepare($sqlPedido);
            $stmtPedido->bindParam(':id_usuario', $idcliente);
            $stmtPedido->bindParam(':total', $total);
            $stmtPedido->bindParam(':estado', $estado);
            $stmtPedido->execute();

            $idPedido = $this->conn->lastInsertId();

            $sqlDetalle = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, subtotal) VALUES (:id_pedido, :id_producto, :cantidad, :subtotal)";
            $stmtDetalle = $this->conn->prepare($sqlDetalle);

            foreach ($detalles as $detalle) {
                $stmtDetalle->bindParam(':id_pedido', $idPedido);
                $stmtDetalle->bindParam(':id_producto', $detalle['id_producto']);
                $stmtDetalle->bindParam(':cantidad', $detalle['cantidad']);
                $stmtDetalle->bindParam(':subtotal', $detalle['subtotal']);
                $stmtDetalle->execute();
            }

            $this->conn->commit();
            return $idPedido;

        } catch (PDOException $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function actualizarEstadoYRepartidor($idPedido, $nuevoEstado, $idRepartidor) {
    $sql = "UPDATE pedido SET estado = :estado, id_repartidor = :id_repartidor WHERE id_pedido = :id_pedido";
    $stmt = $this->conn->prepare($sql);
    return $stmt->execute([
        ':estado' => $nuevoEstado,
        ':id_repartidor' => $idRepartidor,
        ':id_pedido' => $idPedido
    ]);
}

public function obtenerPorId($idPedido) {
    $sql = "SELECT * FROM pedido WHERE id_pedido = :id_pedido";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute([':id_pedido' => $idPedido]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

public function obtenerDetalles($idPedido) {
    $sql = "SELECT id_producto, cantidad, subtotal FROM detalle_pedido WHERE id_pedido = :id_pedido";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute([':id_pedido' => $idPedido]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function obtenerDetallesPedidoID($idPedido) {
    $sql = "SELECT dp.id_detalle,
                   dp.id_pedido,
                   dp.id_producto,
                   pr.nombre AS nombre_producto,
                   dp.cantidad,
                   dp.subtotal
            FROM detalle_pedido dp
            JOIN producto pr ON dp.id_producto = pr.id_producto
            WHERE dp.id_pedido = :idPedido";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(':idPedido', $idPedido, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}



}
?>