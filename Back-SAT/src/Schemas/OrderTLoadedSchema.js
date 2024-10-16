// src/Schemas/OrderTLoadedSchema.js
const { z } = require('zod');

// Definición del esquema basado en el modelo Sequelize
const orderTLoadedSchema = z.object({
  idOt: z
    .number()
    .int({ message: 'El campo idOt debe ser un entero.' })
    .nonnegative({ message: 'El campo idOt debe ser un número entero positivo.' }),

  idParam: z
  .number()
  .int({ message: 'El campo idParam debe ser un entero.' })
  .nonnegative({ message: 'El campo idParam debe ser un número entero positivo.' }),

  valor: z
    .string()
    .nonempty({ message: 'El campo valor es requerido.' }),
  
  nombre: z
    .string()
    .nonempty({ message: 'El campo nombre es requerido.' }),

  tipoDeDato: z
    .string()
    .nonempty({ message: 'El campo tipoDeDato es requerido.' }),
});

module.exports = {
  orderTLoadedSchema,
};
