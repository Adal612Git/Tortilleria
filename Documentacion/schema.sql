-- Activar claves foráneas
PRAGMA foreign_keys = ON;

-- 🧑‍💼 Tabla: Usuario
CREATE TABLE Usuario (
    id_usuario INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    rol TEXT CHECK(rol IN ('Dueño', 'Despachador', 'Motociclista')) NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    activo BOOLEAN DEFAULT 1
);

-- 📦 Tabla: Producto
CREATE TABLE Producto (
    id_producto INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT 1
);

-- 📥 Tabla: Inventario
CREATE TABLE Inventario (
    id_inventario INTEGER PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    tipo TEXT CHECK(tipo IN ('entrada', 'salida')) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- 💸 Tabla: Venta
CREATE TABLE Venta (
    id_venta INTEGER PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- 🧾 Tabla: DetalleVenta
CREATE TABLE DetalleVenta (
    id_detalle INTEGER PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- 📬 Tabla: Pedido
CREATE TABLE Pedido (
    id_pedido INTEGER PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    direccion TEXT NOT NULL,
    estado TEXT CHECK(estado IN ('pendiente', 'entregado')) DEFAULT 'pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- 🛵 Tabla: Entrega
CREATE TABLE Entrega (
    id_entrega INTEGER PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_repartidor INTEGER NOT NULL,
    fecha_entrega TIMESTAMP,
    confirmado BOOLEAN DEFAULT 0,
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY (id_repartidor) REFERENCES Usuario(id_usuario)
);

-- 📚 Tabla: HistorialEntrega
CREATE TABLE HistorialEntrega (
    id_historial INTEGER PRIMARY KEY,
    id_repartidor INTEGER NOT NULL,
    id_pedido INTEGER NOT NULL,
    accion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_repartidor) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
);
