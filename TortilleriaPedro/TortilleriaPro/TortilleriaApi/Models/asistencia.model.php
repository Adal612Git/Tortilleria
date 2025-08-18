<?php
class Asistencia {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

  public function obtenerHistorial($id_usuario, $mes = null) {
    try {
        $query = "SELECT * FROM vista_historial WHERE id_usuario = ?";
        $params = [$id_usuario];

        if ($mes !== null) {
            $query .= " AND MONTH(fecha) = ?";
            $params[] = $mes;
        }

        $query .= " ORDER BY fecha DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $resultados;

    } catch (PDOException $e) {
        error_log("Error en obtenerHistorial: " . $e->getMessage());
        return [];
    }
}
 public function actualizarEvento($id_usuario, $fecha, $tipo_evento, $hora) {
    $sql = "UPDATE eventos_asistencia 
            SET hora = :hora 
            WHERE id_usuario = :id_usuario AND fecha = :fecha AND tipo_evento = :tipo_evento";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(':hora', $hora, PDO::PARAM_STR);
    $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
    $stmt->bindValue(':fecha', $fecha, PDO::PARAM_STR);
    $stmt->bindValue(':tipo_evento', $tipo_evento, PDO::PARAM_STR);

    if ($stmt->rowCount() === 0) {
        // No se actualizó ningún registro => hacer insert
        $sqlInsert = "INSERT INTO eventos_asistencia (id_usuario, fecha, tipo_evento, hora) 
                      VALUES (:id_usuario, :fecha, :tipo_evento, :hora)";
        $stmtInsert = $this->conn->prepare($sqlInsert);
        $stmtInsert->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmtInsert->bindValue(':fecha', $fecha, PDO::PARAM_STR);
        $stmtInsert->bindValue(':tipo_evento', $tipo_evento, PDO::PARAM_STR);
        $stmtInsert->bindValue(':hora', $hora, PDO::PARAM_STR);
        $stmtInsert->execute();
    }

    try {
        return $stmt->execute();
    } catch (PDOException $e) {
       error_log("Error en editar: " . $e->getMessage());
        return false;
    }
}



     public function registrarEvento($empleado_id, $fecha, $tipo_evento, $hora) {
        try {
            $query = "INSERT INTO eventos_asistencia (id_usuario, fecha, tipo_evento, hora) VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$empleado_id, $fecha, $tipo_evento, $hora]);
            return true;
        } catch (PDOException $e) {
            error_log("Error en registrarEvento: " . $e->getMessage());
            return false;
        }
    }


    public function obtenerResumenSemanal($fecha_inicio, $fecha_fin) {
    $sql = "
        SELECT 
            u.id_usuario,
            u.nombre,
            u.salario,
            COALESCE(dias_asistidos.cnt, 0) AS dias_asistidos,
            (u.salario * COALESCE(dias_asistidos.cnt, 0)) AS salario_acumulado,
            COALESCE(dias_asistencia_confirmada.cnt, 0) AS dias_asistencia_confirmada,
            CASE WHEN entrada_hoy.id_usuario IS NOT NULL THEN 1 ELSE 0 END AS asistio_hoy
        FROM usuario u
        LEFT JOIN (
            SELECT id_usuario, COUNT(DISTINCT fecha) AS cnt
            FROM eventos_asistencia
            WHERE fecha BETWEEN :fecha_inicio AND :fecha_fin
            GROUP BY id_usuario
        ) dias_asistidos ON u.id_usuario = dias_asistidos.id_usuario
        LEFT JOIN (
            SELECT id_usuario, COUNT(DISTINCT fecha) AS cnt
            FROM eventos_asistencia ea
            WHERE fecha BETWEEN :fecha_inicio AND :fecha_fin
              AND EXISTS (
                  SELECT 1 FROM eventos_asistencia e_in 
                  WHERE e_in.id_usuario = ea.id_usuario AND e_in.fecha = ea.fecha AND e_in.tipo_evento = 'Entrada'
              )
              AND EXISTS (
                  SELECT 1 FROM eventos_asistencia e_out
                  WHERE e_out.id_usuario = ea.id_usuario AND e_out.fecha = ea.fecha AND e_out.tipo_evento = 'Salida'
              )
            GROUP BY id_usuario
        ) dias_asistencia_confirmada ON u.id_usuario = dias_asistencia_confirmada.id_usuario
        LEFT JOIN (
            SELECT DISTINCT id_usuario
            FROM eventos_asistencia
            WHERE fecha = CURDATE() AND tipo_evento = 'Entrada'
        ) entrada_hoy ON u.id_usuario = entrada_hoy.id_usuario
        ORDER BY u.nombre;
    ";

    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
    $stmt->bindValue(':fecha_fin', $fecha_fin, PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

}
?>
