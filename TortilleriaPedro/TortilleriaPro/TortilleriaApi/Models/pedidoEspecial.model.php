<?php
class pedidoEspecial{
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

     public function guardar($nombre_cliente, $fecha_entrega, $descripcion, $total) {
    $sql = "INSERT INTO pedidos_especiales (nombre_cliente, fecha_entrega, creado_en, descripccion, total) 
            VALUES (?, ?, NOW(), ?, ?)";
    $stmt = $this->conn->prepare($sql);
    return $stmt->execute([$nombre_cliente, $fecha_entrega, $descripcion, $total]);
  }

   public function obtenerPedidosEspeciales() {
        $sql = "SELECT id, nombre_cliente, fecha_entrega, descripccion, total, creado_en
                FROM pedidos_especiales WHERE pagado= 0;
                ORDER BY fecha_entrega ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

        public function marcarPagado($idPedido) {
        $sql = "UPDATE pedidos_especiales SET pagado = 1 WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$idPedido]);
    }


}
?>