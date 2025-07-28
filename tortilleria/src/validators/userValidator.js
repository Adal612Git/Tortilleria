const Joi = require('joi');

const userSchema = Joi.object({
  nombre: Joi.string().min(1).required(),
  rol: Joi.string().valid('Dueño', 'Despachador', 'Motociclista').required(),
  correo: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  activo: Joi.boolean().optional()
});

module.exports = { userSchema };
