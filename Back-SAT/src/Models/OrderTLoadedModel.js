const { DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig.js');


// Define el modelo Usuario
const ordenTrabajoCargadas = sequelize.define('otcargadas', {
  // Campo id como clave primaria
  id_ot_param_valor: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  id_param: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      esEntero(value) {
        if (!Number.isInteger(value)) {
          throw new Error('El campo idParam debe ser un entero.');
        }
      }
    }
  },
  id_ot: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      esEntero(value) {
        if (!Number.isInteger(value)) {
          throw new Error('El campo idOt debe ser un entero.');
        }
      }
    }
  },
  valor_cargado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo valorCargado debe ser una cadena de texto.');
        }
      }
    }
  },
  observaciones: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo observacion debe ser una cadena de texto.');
        }
      }
    }
  },
  observaciones_generales: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo observacion debe ser una cadena de texto.');
        }
      }
    }
  },
  fecha_carga: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  tiempo_transcurrido: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  schema: 'orden_trabajo', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
  tableName: 'otcargadas', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
  timestamps: false // Cambia esto si estás usando timestamps
});

// Método estático para encontrar un usuario por ID
// Método estático para encontrar una orden por id_ot
ordenTrabajoCargadas.buscarPorIdOt = async function (id_ot) {
  // Utiliza una consulta que busca por el campo id_ot
  const result = await this.findOne({ where: { id_ot } });
  return result;
};

// Método para actualizar la información del ordenTrabajoCargadas
ordenTrabajoCargadas.prototype.actualizarDatos = async function (datosActualizados) {

  // Actualizar solo los campos que se pasaron
  const { id_ot, ...restData } = datosActualizados; // Asegúrate de no actualizar el id
  // Establecer los nuevos datos
  this.set(restData);
  // Guardar los cambios
  await this.save();  // Utiliza 'save' para guardar los cambios
};








module.exports = ordenTrabajoCargadas;