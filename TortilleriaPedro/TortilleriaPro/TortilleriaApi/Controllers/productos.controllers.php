<?php
require_once __DIR__ .  "/../Models/productos.models.php";

class ProductosController{
    private $productoController;

    public function __construct($db)
    {
        $this->productoController = new Producto($db);
    }

   public function obtenerProductos(){
     $prodcutos = $this->productoController->getProductos();

        header('Content-Type: application/json');
        echo json_encode($prodcutos);
   }

      public function obtenermateriaprima(){
     $prodcutos = $this->productoController->getMateriaPrima();

        header('Content-Type: application/json');
        echo json_encode($prodcutos);
   }
   public function actualizarProducto() {
    // Obtener el JSON enviado desde JavaScript
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        isset($data['id_producto']) &&
        isset($data['stock']) &&
        isset($data['precio'])
    ) {
        $resultado = $this->productoController->actualizarProducto(
            $data['id_producto'],
            $data['stock'],
            $data['precio']
        );

        header('Content-Type: application/json');
        if ($resultado) {
            echo json_encode([
                'success' => true,
                'message' => 'Producto actualizado correctamente'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No se pudo actualizar el producto'
            ]);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Datos incompletos para actualizar el producto'
        ]);
    }
}

public function editarMateriaPrima() {
    $datos = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($datos['id_materia']) ||
        !isset($datos['nombre']) ||
        !isset($datos['unidad']) ||
        !isset($datos['cantidad'])
    ) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos para actualizar materia prima']);
        return;
    }

    $resultado = $this->productoController->actualizarMateriaPrima(
        $datos['id_materia'],
        $datos['nombre'],
        $datos['cantidad'],
        $datos['unidad']
        
    );

    header('Content-Type: application/json');
    if ($resultado) {
        echo json_encode(['success' => true, 'message' => 'Materia prima actualizada correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'No se pudo actualizar la materia prima']);
    }
}


public function retirarProducto() {
    $datos = json_decode(file_get_contents("php://input"), true);

    if (!isset($datos['id_producto'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID del producto requerido']);
        return;
    }

    $resultado = $this->productoController->retirarProducto($datos['id_producto']);

    if ($resultado) {
        echo json_encode(['success' => true, 'message' => 'Producto retirado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'No se pudo retirar el producto']);
    }
}

public function retirarMateriaPrima() {
    $datos = json_decode(file_get_contents("php://input"), true);

    if (!isset($datos['id_materia'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID del producto requerido']);
        return;
    }

    $resultado = $this->productoController->retirarMateriaPrima($datos['id_materia']);

    if ($resultado) {
        echo json_encode(['success' => true, 'message' => 'Producto retirado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'No se pudo retirar el producto']);
    }
}

public function guardarProducto() {
    if (!isset($_POST['nombre'], $_POST['menu'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }

    $menu = $_POST['menu'];

    if ($menu === 'producto') {
        // Validar campos requeridos para producto
        if (!isset($_POST['precio'], $_POST['stock'], $_POST['descripcion']) || !isset($_FILES['imagen'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Faltan datos de producto']);
            exit;
        }

        $nombreArchivo = basename($_FILES['imagen']['name']);
        $rutaDestino = __DIR__ . '/../../TortilleriaWeb/landing/imagenes/' . $nombreArchivo;

        if (!is_dir(dirname($rutaDestino)) || !is_writable(dirname($rutaDestino))) {
            echo json_encode(['success' => false, 'message' => 'Problemas con el directorio de destino']);
            exit;
        }

        if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al subir imagen']);
            exit;
        }

        $rutaImagenParaBD = 'landing/imagenes/' . $nombreArchivo;

        $data = [
            'nombre' => $_POST['nombre'],
            'precio' => $_POST['precio'],
            'stock' => $_POST['stock'],
            'descripcion' => $_POST['descripcion'],
            'controla_stock' => $_POST['controla_stock']
        ];

        $guardado = $this->productoController->guardarProducto($data, $rutaImagenParaBD);
        if ($guardado) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al guardar producto']);
        }

    } elseif ($menu === 'materiaPrima') {
        // Validar campos requeridos para materia prima
        if (!isset($_POST['unidadMedida'], $_POST['cantidadMateriaPrima'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Faltan datos de materia prima']);
            exit;
        }

        $data = [
            'nombre' => $_POST['nombre'],
            'unidad_medida' => $_POST['unidadMedida'],
            'cantidad' => $_POST['cantidadMateriaPrima'],
        ];

        $guardado = $this->productoController->guardarMateriaPrima($data);

        if ($guardado) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al guardar materia prima']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Tipo de menú inválido']);
    }
}





}

?>