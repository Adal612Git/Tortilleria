<?php

    class Cliente{
        private $conn;

        public function __construct($db)
        {
            $this->conn = $db;
        }

        public function getClientes(){
            try{
                $query = " Select * from vista_clientes_sucursal ORDER BY activo DESC";
                $stmt = $this-> conn -> prepare($query);
                $stmt->execute();

                return$stmt->fetchAll();
            }catch(PDOException $e){
                error_log("error en getcliente: " . $e->getMessage());
                return[];
            }
        }

         public function insertCliente($nombre, $direccion, $telefono, $latitud, $longitud,$contrasena,$correo) {
            try {
                $query = "INSERT INTO cliente(nombre, direccion, telefono, latitud, longitud,contraseña,correo) VALUES (:nombre, :direccion, :telefono, :latitud, :longitud,:contrasena,:correo)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
                $stmt->bindParam(':direccion', $direccion, PDO::PARAM_STR);
                $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
                $stmt->bindParam(':latitud', $latitud, PDO::PARAM_STR);
                $stmt->bindParam(':longitud', $longitud, PDO::PARAM_STR);
                $stmt->bindParam(':contrasena' , $contrasena,PDO::PARAM_STR);
                $stmt->bindParam(':correo' , $correo,PDO::PARAM_STR);
                
                return $stmt->execute();

                } catch (PDOException $e) {
                    error_log("Error en insertCliente: " . $e->getMessage());
                    return false;
                }
        }

        public function editarCliente($id, $datos) {
        try {
            $query = "UPDATE cliente SET 
                        nombre = :nombre,
                        direccion = :direccion,
                        correo = :correo,
                        telefono = :telefono,
                        contraseña =:contrasena
                      WHERE id_cliente = :id";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':nombre', $datos['nombre'], PDO::PARAM_STR);
            $stmt->bindParam(':direccion', $datos['direccion'], PDO::PARAM_STR);
            $stmt->bindParam(':correo', $datos['correo'], PDO::PARAM_STR);
            $stmt->bindParam(':telefono', $datos['telefono'], PDO::PARAM_STR);
            $stmt->bindParam(':contrasena', $datos['contraseña'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al editar cliente: " . $e->getMessage());
            return false;
        }
        } 

    public function actualizarActivo($id_cliente, $activo) {
        $sql = "UPDATE cliente SET activo = :activo WHERE id_cliente = :id_cliente ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':activo', $activo, PDO::PARAM_INT);
        $stmt->bindValue(':id_cliente', $id_cliente, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
public function loginCliente($correo, $password) {
    try {
        $query = "SELECT * FROM cliente WHERE correo = :correo LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":correo", $correo, PDO::PARAM_STR);
        $stmt->execute();
        $cliente = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cliente) {
            if (!password_verify($password, $cliente['contraseña'])) {
                return false; // Contraseña incorrecta
            }

            if ($cliente['is_logged_in']) {
                return "SESION_ACTIVA"; // Ya hay una sesión activa
            }

            // Marcar como logueado
            $update = "UPDATE cliente SET is_logged_in = 1 WHERE id_cliente = :id";
            $stmtUpdate = $this->conn->prepare($update);
            $stmtUpdate->bindParam(":id", $cliente['id_cliente']);
            $stmtUpdate->execute();

            return $cliente; // Login exitoso
        } else {
            return false; // Cliente no encontrado
        }
    } catch (PDOException $e) {
        error_log("Error en loginCliente: " . $e->getMessage());
        return false;
    }
}

public function logoutCliente($id_cliente) {
    try {
        $query = "UPDATE cliente SET is_logged_in = 0 WHERE id_cliente = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id_cliente, PDO::PARAM_INT);
        $stmt->execute();

        return [
            "estado" => "OK",
            "mensaje" => "Sesión del cliente cerrada correctamente"
        ];
    } catch (PDOException $e) {
        error_log("Error al cerrar sesión del cliente: " . $e->getMessage());
        return [
            "estado" => "ERROR",
            "mensaje" => "Error al cerrar sesión del cliente"
        ];
    }
}


    }
?>
