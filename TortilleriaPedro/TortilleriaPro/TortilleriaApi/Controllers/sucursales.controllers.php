<?php
    require_once __DIR__. "/../Models/sucursales.model.php";

    class sucursalesController{
        private $sucursalesController;

        public function __construct($db)
        {
            $this->sucursalesController = new sucursal($db);
        }

        public function obtenerSucursales(){
            $sucursales = $this->sucursalesController->getSucursales();

            header("Content-Type: application/json");
            echo json_encode($sucursales);
            
        }
    }
?>