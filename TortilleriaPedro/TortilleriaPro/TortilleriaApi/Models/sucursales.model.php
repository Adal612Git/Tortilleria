<?php
    class sucursal{
        private $conn;

       public function __construct($db)
       {
        $this->conn =$db;
       }

       public function getSucursales(){
        try{
            $query = "Select * from sucursal;";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll();
        }catch(PDOException $e){
            error_log("error en getSucursales: ". $e->getMessage());
            return[];
        }
       }
    }
?>