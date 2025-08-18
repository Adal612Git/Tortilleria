<?php
require_once __DIR__ . "/../Models/usuarios.models.php";

class usuariosController{
    private $usuarioController;

    public function __construct($db){
        $this->usuarioController = new Usuario($db);
    }

    

    public function ObtenerUsuarios(){
        $usuarios = $this->usuarioController->getUsuarios();

        header('Content-Type: application/json');
        echo json_encode($usuarios);
    }

    public function ObtenerUsuarioID($id){
        $usuario = $this->usuarioController->getUsuarioID($id);
        header("Content-Type: application/json");

        if($usuario){
            echo json_encode($usuario);
        }else{
            http_response_code(404);
            echo json_encode(["mensaje" => "usuario no encontrado"]);
        }
    }

    public function LoginUsuario($data) {
    $correo = $data['correo'] ?? '';
    $password = $data['password'] ?? '';

    header("Content-Type: application/json");

    if (empty($correo) || empty($password)) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'Correo y contraseña son obligatorios']);
        return;
    }

    $usuario = $this->usuarioController->login($correo, $password);
    if($usuario === "SESION_ACTIVA"){
        echo json_encode(["estado" => "SESION_ACTIVA"]);
    }
    elseif ($usuario) {
        http_response_code(200);
        echo json_encode([
            'mensaje' => 'Login exitoso',
            'usuario' => $usuario
        ]);
    } else {
        http_response_code(403);
        echo json_encode(['mensaje' => 'Correo o contraseña incorrectos']);
    }
    }

    public function cerrarSesion($datos) {
    header("Content-Type: application/json");

    $id_usuario = $datos['id_usuario'] ?? null;

    if (!$id_usuario) {
        http_response_code(400);
        echo json_encode(["mensaje" => "ID de usuario requerido"]);
        return;
    }

    $resultado = $this->usuarioController->logout($id_usuario);

    if ($resultado) {
        http_response_code(200);
        echo json_encode(["mensaje" => "Sesión cerrada exitosamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["mensaje" => "No se pudo cerrar la sesión"]);
    }
}

public function editarUsuario($data) {
    header("Content-Type: application/json");

    // Validar que el ID venga dentro del objeto $data (por ejemplo: $data['id_usuario'])
    $id = $data['id_usuario'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'ID de usuario es obligatorio']);
        return;
    }

    // Campos que deseas permitir actualizar (deberían venir en $data)
    $camposActualizables = ['nombre', 'rol', 'correo', 'telefono', 'salario', 'Descanso'];

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
    $resultado = $this->usuarioController->editarUsuario($id, $datosParaActualizar);

    if ($resultado) {
        http_response_code(200);
        echo json_encode(['mensaje' => 'Usuario actualizado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['mensaje' => 'Error al actualizar usuario']);
    }
}

public function activarUsuario($data) {
    header("Content-Type: application/json");

    // Validar que venga el id_cliente y el nuevo estado activo
    $id = $data['id_usuario'] ?? null;
    $activo = $data['activo'] ?? null;

    if (!$id || !isset($activo)) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'ID de usuario y estado activo son obligatorios']);
        return;
    }

    // Validar que el estado activo sea 0 o 1
    if ($activo !== '0' && $activo !== '1' && $activo !== 0 && $activo !== 1) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'Estado activo inválido']);
        return;
    }

    // Llamar al método del modelo para actualizar solo el campo 'activo'
    $resultado = $this->usuarioController->actualizarActivo($id, (int)$activo);

    if ($resultado) {
        http_response_code(200);
        echo json_encode(['mensaje' => 'Estado del usuario actualizado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['mensaje' => 'Error al actualizar el estado del usuario']);
    }
}






    public  function actualizarCoordenadas($datos) {
        header("Content-Type: application/json");

        $id_usuario = $datos['id_usuario'] ?? null;
        $latitud = $datos['latitud'] ?? null;
        $longitud = $datos['longitud'] ?? null;

        if (!$id_usuario || !$latitud || !$longitud) {
            echo json_encode(['status' => 'error', 'mensaje' => 'Datos incompletos']);
            return;
        }

        $ok = $this->usuarioController->actualizarCordsRepartidor($id_usuario, $latitud, $longitud);

        if ($ok) {
            echo json_encode(['status' => 'ok', 'mensaje' => 'Coordenadas actualizadas']);
        } else {
            echo json_encode(['status' => 'error', 'mensaje' => 'No se pudo actualizar']);
        }
    }

    public function insertarUsuario() {
        header("Content-Type: application/json; charset=utf-8");

        // Obtener datos JSON del request
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            !isset($data['nombre'], $data['correo'], $data['contraseña'], $data['rol'], $data['telefono'])
        ) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Faltan datos requeridos."]);
            return;
        }

        // Validar rol permitido (ejemplo)
        $rolesPermitidos = ['admin', 'repartidor', 'cliente','empleado'];
        if (!in_array($data['rol'], $rolesPermitidos)) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Rol inválido."]);
            return;
        }

        // Encriptar contraseña
        $passwordEncriptado = password_hash($data['contraseña'], PASSWORD_DEFAULT);

        // Insertar usuario
        $resultado = $this->usuarioController->insertUsuario(
            $data['nombre'],
            $data['correo'],
            $passwordEncriptado,
            $data['rol'],
            $data['telefono'],
            $data['salario'],
            $data['descanso']
        );

        if ($resultado) {
            http_response_code(201);
            echo json_encode(["mensaje" => "Usuario insertado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "Error al insertar usuario."]);
        }
    }




    
        
    
}
?>