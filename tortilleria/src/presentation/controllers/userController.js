const bcrypt = require('bcryptjs');
const UserRepository = require('../../infrastructure/db/userRepository');
const { userSchema } = require('../../validators/userValidator');

module.exports = {
  async create(req, res) {
    try {
      const { error, value } = userSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });
      value.password = await bcrypt.hash(value.password, 8);
      const user = await UserRepository.create(value);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async list(req, res) {
    try {
      const users = await UserRepository.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await UserRepository.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { error, value } = userSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });
      if (value.password) value.password = await bcrypt.hash(value.password, 8);
      const result = await UserRepository.update(req.params.id, value);
      if (!result.changes) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Updated' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const result = await UserRepository.remove(req.params.id);
      if (!result.changes) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
