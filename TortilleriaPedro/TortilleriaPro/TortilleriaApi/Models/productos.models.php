<?php
    class Producto{
        private $conn;

        public function __construct($db)
        {
            $this->conn = $db;
        }

        public function getProductos(){
            try{
                $query = " select * from producto where activo = 1;";
                $stmt = $this->conn->prepare($query);
                $stmt->execute();

                return $stmt->fetchAll();

            }catch(PDOException $e){
                 error_log("error en getProductos: ". $e->getMessage());
            return[];
            }  
        }

      public function actualizarProducto($id, $stock, $precio) {
    try {
        $query = "UPDATE producto SET stock = :stock, precio = :precio WHERE id_producto = :id ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":stock", $stock, PDO::PARAM_INT);
        $stmt->bindParam(":precio", $precio);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }

    } catch (PDOException $e) {
        error_log("Error en actualizarProducto: " . $e->getMessage());
        return false;
    }
    }

     public function actualizarMateriaPrima($id, $nombre, $cantidad,$unidad) {
    try {
        $query = "UPDATE materia_prima SET nombre = :nombre, cantidad = :cantidad, unidad_medida = :unidad WHERE id_materia = :id ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre",$nombre, PDO::PARAM_STR);
        $stmt->bindParam(":cantidad", $cantidad, PDO::PARAM_INT);
        $stmt->bindParam(":unidad", $unidad, PDO::PARAM_STR);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }

    } catch (PDOException $e) {
        error_log("Error en actualizarProducto: " . $e->getMessage());
        return false;
    }
    }

      public function retirarProducto($id_producto) {
        try {
            $query = "UPDATE producto SET activo = 0 WHERE id_producto = :id_producto";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id_producto', $id_producto, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }

        public function retirarMateriaPrima($id_materia) {
        try {
            $query = "UPDATE materia_prima SET activo = 0 WHERE id_materia = :id_producto";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id_producto', $id_materia, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }

public function guardarProducto($data, $rutaImagen) {
    try {
        $sql = "INSERT INTO producto (nombre, precio, stock, descripcion, imagen,controla_stock) 
                VALUES (:nombre, :precio, :stock, :descripcion, :imagen,:controla_stock)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':precio', $data['precio']);
        $stmt->bindParam(':stock', $data['stock']);
        $stmt->bindParam(':descripcion', $data['descripcion']);
        $stmt->bindParam(':imagen', $rutaImagen);
        $stmt->bindParam(':controla_stock', $data['controla_stock']);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log("Error en guardarProducto: " . $e->getMessage());
        return false;
    }
}

public function guardarMateriaPrima($data) {
    try {
        $sql = "INSERT INTO materia_prima (nombre, unidad_medida, cantidad) 
                VALUES (:nombre, :unidad_medida, :cantidad)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':unidad_medida', $data['unidad_medida']);
        $stmt->bindParam(':cantidad', $data['cantidad']);
    
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log("Error en guardarProducto: " . $e->getMessage());
        return false;
    }
}

   public function getMateriaPrima(){
            try{
                $query = " select * from materia_Prima where activo = 1;";
                $stmt = $this->conn->prepare($query);
                $stmt->execute();

                return $stmt->fetchAll();

            }catch(PDOException $e){
                 error_log("error en getmateriaprima: ". $e->getMessage());
            return[];
            }  
        }

    }
?>