<?php
class Venta {
   private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }
      public function getConexion() {
        return $this->conn;
    }

    // Crear venta con detalles en transacción
  public function crearVenta($tipo, $idUsuario, $total, $detalles, $idCliente = null) {
    try {
        $this->conn->beginTransaction();

        $sqlVenta = "INSERT INTO venta (fecha, total, id_usuario, id_cliente, tipo_venta) 
                     VALUES (NOW(), :total, :id_usuario, :id_cliente, :tipo)";
        $stmtVenta = $this->conn->prepare($sqlVenta);
        $stmtVenta->bindParam(':total', $total);
        $stmtVenta->bindParam(':tipo', $tipo);
        $stmtVenta->bindParam(':id_usuario', $idUsuario);
        $stmtVenta->bindParam(':id_cliente', $idCliente); // Puede ser null
        $stmtVenta->execute();

        $idVenta = $this->conn->lastInsertId();

        $sqlDetalle = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) 
                       VALUES (:id_venta, :id_producto, :cantidad, :subtotal)";
        $stmtDetalle = $this->conn->prepare($sqlDetalle);

        foreach ($detalles as $detalle) {
            $stmtDetalle->bindParam(':id_venta', $idVenta);
            $stmtDetalle->bindParam(':id_producto', $detalle['id_producto']);
            $stmtDetalle->bindParam(':cantidad', $detalle['cantidad']);
            $stmtDetalle->bindParam(':subtotal', $detalle['subtotal']);
            $stmtDetalle->execute();
        }

        $this->conn->commit();
        return $idVenta;
    } catch (PDOException $e) {
        $this->conn->rollBack();
        throw $e;
    }
}

public function obtenerResumenMes($mesActual) {
    // $mesActual debe venir en formato 'YYYY-MM' por ejemplo '2025-08'

    $sql = "SELECT
                v1.mes AS mes_actual,
                v1.numero_ventas AS numero_ventas_actual,
                v1.ventas_mostrador AS ventas_mostrador_actual,
                v1.ventas_reparto AS ventas_reparto_actual,
                v1.total_mes AS total_mes_actual,
                v1.total_mostrador AS total_mostrador_actual,
                v1.total_reparto AS total_reparto_actual,
                v2.mes AS mes_anterior,
                v2.numero_ventas AS numero_ventas_anterior,
                v2.ventas_mostrador AS ventas_mostrador_anterior,
                v2.ventas_reparto AS ventas_reparto_anterior,
                v2.total_mes AS total_mes_anterior,
                v2.total_mostrador AS total_mostrador_anterior,
                v2.total_reparto AS total_reparto_anterior
            FROM vista_resumen_ventas_mes v1
            LEFT JOIN vista_resumen_ventas_mes v2 ON v2.mes = DATE_FORMAT(DATE_SUB(STR_TO_DATE(CONCAT(v1.mes, '-01'), '%Y-%m-%d'), INTERVAL 1 MONTH), '%Y-%m')
            WHERE v1.mes = :mesActual";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(':mesActual', $mesActual, PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC); // devuelve un solo registro con datos del mes actual y anterior
}



public function obtenerVentasPaginadas($limit = 10, $offset = 0, $filtros = []) {
    $sql = "SELECT * FROM venta WHERE 1=1";

    // Filtros
    if (!empty($filtros['idVenta'])) {
        $sql .= " AND id_venta = :idVenta";
    }
    if (!empty($filtros['fechaInicio'])) {
        $sql .= " AND fecha >= :fechaInicio";
    }
    if (!empty($filtros['fechaFin'])) {
        $sql .= " AND fecha <= :fechaFin";
    }

    $sql .= " ORDER BY fecha DESC LIMIT :limit OFFSET :offset";

    $stmt = $this->conn->prepare($sql);

    if (!empty($filtros['idVenta'])) {
        $stmt->bindValue(':idVenta', $filtros['idVenta'], PDO::PARAM_INT);
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

// Método para contar total de registros con filtros (para saber cuántas páginas)
public function contarVentas($filtros = []) {
    $sql = "SELECT COUNT(*) as total FROM venta WHERE 1=1";

    if (!empty($filtros['idVenta'])) {
        $sql .= " AND id_venta = :idVenta";
    }
    if (!empty($filtros['fechaInicio'])) {
        $sql .= " AND fecha >= :fechaInicio";
    }
    if (!empty($filtros['fechaFin'])) {
        $sql .= " AND fecha <= :fechaFin";
    }

    $stmt = $this->conn->prepare($sql);

    if (!empty($filtros['idVenta'])) {
        $stmt->bindValue(':idVenta', $filtros['idVenta'], PDO::PARAM_INT);
    }
    if (!empty($filtros['fechaInicio'])) {
        $stmt->bindValue(':fechaInicio', $filtros['fechaInicio']);
    }
    if (!empty($filtros['fechaFin'])) {
        $stmt->bindValue(':fechaFin', $filtros['fechaFin']);
    }

    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? (int)$row['total'] : 0;
}


   public function obtenerDetallesPorVenta($id_venta) {
        $query = "SELECT dv.id_detalle_venta, dv.id_venta, dv.id_producto, p.nombre AS nombre_producto, dv.cantidad, dv.subtotal
                  FROM detalle_venta dv
                  JOIN producto p ON dv.id_producto = p.id_producto
                  WHERE dv.id_venta = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id_venta]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


}
