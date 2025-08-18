<?php
 class Usuario{
    private $conn;
    

    public function __construct($db){
        $this->conn =$db;
    }

    public function getUsuarios(){
        try{
        $query = "SELECT * FROM vista_usuarios_roles  ORDER BY activo DESC;";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll();
        }catch(PDOException $e){
            error_log("error en getUsuario: ". $e->getMessage());
            return[];
        }
    }

    public function getUsuarioID($id){
        try{
            $query = "SELECT * FROM vista_usuarios_roles WHERE id_usuario = :id;";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $id,PDO::PARAM_INT);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        }catch(PDOException $e){
            error_log("Error en getUsuarioID: " . $e->getMessage());
            return false;
        }
    }
public function login($correo, $password) {
    try {
        $query = "SELECT * FROM usuario WHERE correo = :correo LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":correo", $correo, PDO::PARAM_STR);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            if (!password_verify($password, $usuario['contraseña'])) {
                return false; // Contraseña incorrecta
            }

            if ($usuario['is_logged_in']) {
                return "SESION_ACTIVA"; // Ya hay una sesión activa
            }

            // Marcar como logueado
            $update = "UPDATE usuario SET is_logged_in = 1 WHERE id_usuario = :id";
            $stmtUpdate = $this->conn->prepare($update);
            $stmtUpdate->bindParam(":id", $usuario['id_usuario']);
            $stmtUpdate->execute();

            return $usuario; // Login exitoso
        } else {
            return false;
        }
    } catch (PDOException $e) {
        error_log("Error en login: " . $e->getMessage());
        return false;
    }
}

public function logout($id_usuario) {
    try {
        $query = "UPDATE usuario SET is_logged_in = 0 WHERE id_usuario = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id_usuario, PDO::PARAM_INT);
        $stmt->execute();

        return [
            "estado" => "OK",
            "mensaje" => "Sesión cerrada correctamente"
        ];
    } catch (PDOException $e) {
        error_log("Error al cerrar sesión: " . $e->getMessage());
        return [
            "estado" => "ERROR",
            "mensaje" => "Error al cerrar sesión"
        ];
    }
}



  public function actualizarCordsRepartidor($id_usuario, $latitud, $longitud) {
    try {
        $query = "UPDATE usuario SET latitud = ?, longitud = ? WHERE id_usuario = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $latitud, PDO::PARAM_STR);
        $stmt->bindParam(2, $longitud, PDO::PARAM_STR);
        $stmt->bindParam(3, $id_usuario, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    } catch (PDOException $e) {
        error_log("Error en actualizarCordsRepartidor: " . $e->getMessage());
        return false;
    }
}

public function editarUsuario($id, $datos) {
        try {
            $query = "UPDATE usuario SET 
                        nombre = :nombre,
                        rol = :rol,
                        correo = :correo,
                        telefono = :telefono,
                        salario = :salario,
                        Descanso = :descanso
                      WHERE id_usuario = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':nombre', $datos['nombre'], PDO::PARAM_STR);
            $stmt->bindParam(':rol', $datos['rol'], PDO::PARAM_STR);
            $stmt->bindParam(':correo', $datos['correo'], PDO::PARAM_STR);
            $stmt->bindParam(':telefono', $datos['telefono'], PDO::PARAM_STR);
            $stmt->bindParam(':salario', $datos['salario'], PDO::PARAM_STR);
            $stmt->bindParam(':descanso', $datos['Descanso'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error al editar usuario: " . $e->getMessage());
            return false;
        }
}       
 public function insertUsuario($nombre, $correo, $contraseña, $rol, $telefono,$salario,$Descanso) {
    try {
        $query = "INSERT INTO usuario(nombre, correo, contraseña, rol, telefono,salario,Descanso) VALUES (:nombre, :correo, :contrasena, :rol, :telefono,:salario,:Descanso)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':correo', $correo, PDO::PARAM_STR);
        $stmt->bindParam(':contrasena', $contraseña, PDO::PARAM_STR);
        $stmt->bindParam(':rol', $rol, PDO::PARAM_STR);
        $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
        $stmt->bindParam(':salario' , $salario,PDO::PARAM_STR);
          $stmt->bindParam(':Descanso' , $Descanso,PDO::PARAM_STR);


        return $stmt->execute();
    } catch (PDOException $e) {
        error_log("Error en insertUsuario: " . $e->getMessage());
        return false;
    }
}

 public function actualizarActivo($id_usuario, $activo) {
        $sql = "UPDATE usuario SET activo = :activo WHERE id_usuario = :id_usuario";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':activo', $activo, PDO::PARAM_INT);
        $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }


    
        
    
 }
?>