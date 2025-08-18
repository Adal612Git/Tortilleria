<?php
require_once __DIR__ . "/../Models/clientes.models.php";

class clienteController{
    private $clienteController;

    public function __construct($db)
    {
        $this->clienteController=new Cliente($db);
    }

    public function obtenerClientes(){
        $clientes = $this->clienteController->getClientes();

        header('Content-Type: application/json');
        echo json_encode($clientes);
    }

    public function insertarCliente() {
        header("Content-Type: application/json; charset=utf-8");

        // Obtener datos JSON del request
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            !isset($data['nombre'], $data['direccion'], $data['telefono'], $data['latitud'], $data['longitud'],$data['contraseña'],$data['correo'])
        ) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Faltan datos requeridos."]);
            return;
        }

        // Validar rol permitido (ejemplo)
       

        // Encriptar contraseña
        $passwordEncriptado = password_hash($data['contraseña'], PASSWORD_DEFAULT);

        // Insertar usuario
        $resultado = $this->clienteController->insertCliente(
            $data['nombre'],
            $data['direccion'],
            $data['telefono'],
            $data['latitud'],
            $data['longitud'],
            $passwordEncriptado,
             $data['correo']
        );

        if ($resultado) {
            http_response_code(201);
            echo json_encode(["mensaje" => "Cliente insertado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "Error al insertar Cliente."]);
        }
    }

    public function editarCliente($data) {
    header("Content-Type: application/json");

    // Validar que el ID venga dentro del objeto $data (por ejemplo: $data['id_usuario'])
    $id = $data['id_cliente'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'ID de usuario es obligatorio']);
        return;
    }

    // Campos que deseas permitir actualizar (deberían venir en $data)
    $camposActualizables = ['nombre', 'rol', 'correo', 'telefono', 'contraseña'];

    // Filtrar solo campos permitidos
    $datosParaActualizar = [];
    foreach ($camposActualizables as $campo) {
        if (isset($data[$campo])) {
            $datosParaActualizar[$campo] = $data[$campo];
        }
    }

    // Validar que al menos venga un campo para actualizar
    if (empty($datosParaActualizar)) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'No hay datos para actualizar']);
        return;
    }

    // Llamar al método del modelo para actualizar
    $resultado = $this->clienteController->editarCliente($id, $datosParaActualizar);

    if ($resultado) {
        http_response_code(200);
        echo json_encode(['mensaje' => 'cliente actualizado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['mensaje' => 'Error al actualizar cliente']);
    }
}

public function activarCliente($data) {
    header("Content-Type: application/json");

    // Validar que venga el id_cliente y el nuevo estado activo
    $id = $data['id_cliente'] ?? null;
    $activo = $data['activo'] ?? null;

    if (!$id || !isset($activo)) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'ID de cliente y estado activo son obligatorios']);
        return;
    }

    // Validar que el estado activo sea 0 o 1
    if ($activo !== '0' && $activo !== '1' && $activo !== 0 && $activo !== 1) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'Estado activo inválido']);
        return;
    }

    // Llamar al método del modelo para actualizar solo el campo 'activo'
    $resultado = $this->clienteController->actualizarActivo($id, (int)$activo);

    if ($resultado) {
        http_response_code(200);
        echo json_encode(['mensaje' => 'Estado del cliente actualizado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['mensaje' => 'Error al actualizar el estado del cliente']);
    }
}


public function loginCliente() {
    header("Content-Type: application/json; charset=utf-8");

    // Obtener datos JSON
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['correo'], $data['contraseña'])) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Correo y contraseña son obligatorios."]);
        return;
    }

    $correo = $data['correo'];
    $contraseña = $data['contraseña'];

    $cliente = $this->clienteController->loginCliente($correo, $contraseña);

        if ($cliente === "SESION_ACTIVA") {
        http_response_code(200);
        echo json_encode([
            "estado" => "SESION_ACTIVA",
            "mensaje" => "Ya hay una sesión activa para este cliente."
        ]);
        return;
    }

    if ($cliente) {
        // Aquí puedes iniciar sesión con sesiones PHP si se desea
        // session_start();
        // $_SESSION['cliente_id'] = $cliente['id_cliente'];

        http_response_code(200);
        echo json_encode([
            "mensaje" => "Login exitoso",
            "cliente" => $cliente
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["mensaje" => "Correo o contraseña incorrectos."]);
    }
}

public function cerrarSesionCliente() {

    $datos = json_decode(file_get_contents("php://input"), true);
    header("Content-Type: application/json");

    $id_cliente = $datos['id_cliente'] ?? null;

    if (!$id_cliente) {
        http_response_code(400);
        echo json_encode(["mensaje" => "ID de cliente requerido"]);
        return;
    }

    $resultado = $this->clienteController->logoutCliente($id_cliente);

    if ($resultado && $resultado['estado'] === "OK") {
        http_response_code(200);
        echo json_encode(["mensaje" => "Sesión cerrada exitosamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["mensaje" => $resultado['mensaje'] ?? "No se pudo cerrar la sesión"]);
    }
}



}
?>