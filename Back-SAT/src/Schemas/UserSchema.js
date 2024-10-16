// userValidationSchema.js
const { z } = require('zod');

const userSchema = z.object({
  usuario: z
    .string()
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
    .nonempty({ message: 'El nombre de usuario es requerido.' }),
  rol: z
    .enum(['admin', 'usuario'], { message: 'El rol debe ser "admin" o "usuario".' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    .nonempty({ message: 'La contraseña es requerida.' }),
});

module.exports = {
  userSchema,
};
