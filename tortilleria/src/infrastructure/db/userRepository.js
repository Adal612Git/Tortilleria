const db = require('./database');

const UserRepository = {
  create: (user) => {
    return new Promise((resolve, reject) => {
      const { nombre, rol, correo, password } = user;
      const stmt = 'INSERT INTO Usuario(nombre, rol, correo, password) VALUES(?,?,?,?)';
      db.run(stmt, [nombre, rol, correo, password], function(err) {
        if (err) return reject(err);
        resolve({ id_usuario: this.lastID, ...user });
      });
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Usuario', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Usuario WHERE id_usuario = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  update: (id, user) => {
    return new Promise((resolve, reject) => {
      const { nombre, rol, correo, password, activo } = user;
      const stmt = 'UPDATE Usuario SET nombre=?, rol=?, correo=?, password=?, activo=? WHERE id_usuario=?';
      db.run(stmt, [nombre, rol, correo, password, activo, id], function(err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM Usuario WHERE id_usuario=?', [id], function(err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  findByCorreo: (correo) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Usuario WHERE correo=?', [correo], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
};

module.exports = UserRepository;
