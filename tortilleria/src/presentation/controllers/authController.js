const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../../infrastructure/db/userRepository');
const { SECRET } = require('../middlewares/auth');

module.exports = {
  async login(req, res) {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ message: 'Correo y password requeridos' });
    try {
      const user = await UserRepository.findByCorreo(correo);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
