const { z } = require('zod');

const OrdenTrabajoSchema = z.object({
  titulo: z
    .string()
    .nonempty('El campo titulo es requerido'),
  numOrden: z
    .string()
    .nonempty('El campo numOrden es requerido'),
  cliente: z
    .string()
    .nonempty('El campo cliente es requerido'),
  responsable: z
    .string()
    .nonempty('El campo responsable es requerido'),
  estado: z
    .string()
    .nonempty('El campo estado es requerido'),
  aprobado: z.boolean().default(false),
  archivo: z
    .union([z.instanceof(Buffer), z.string(), z.null()]) // Permite Buffer, string, o null
    .optional() // Permite que el campo sea undefined
});

module.exports = OrdenTrabajoSchema;
