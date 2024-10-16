const { DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig.js');
// Define el modelo Usuario
const OrdenTrabajo = sequelize.define('ordent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo titulo debe ser una cadena de texto.');
        }
      }
    }
  },
  tipo_servicio: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo titulo debe ser una cadena de texto.');
        }
      }
    }
  },
  tipo_equipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo titulo debe ser una cadena de texto.');
        }
      }
    }
  },
  numOrden: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Asegura que los nombres de usuario sean únicos
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo numOrden debe ser una cadena de texto.');
        }
      }
    }
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo cliente debe ser una cadena de texto.');
        }
      }
    }
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo responsable debe ser una cadena de texto.');
        }
      }
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente', // Valor por defecto
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo estado debe ser una cadena de texto.');
        }
      }
    }
  },

  aprobado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  idequipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo estado debe ser una cadena de texto.');
        }
      }
    }
  },
  archivo: {
    type: DataTypes.BLOB, // 'long' para grandes cantidades de datos binarios
    allowNull: true
  },
  firma: {
    type: DataTypes.TEXT, // Usar TEXT para almacenar firmas, si son largas
    allowNull: true // Permitir que sea nulo si no siempre se proporciona
  },
  date: {
    type: DataTypes.DATE, // Usar DATEONLY para almacenar solo fechas
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  schema: 'orden_trabajo', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
  tableName: 'ordent', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
  timestamps: false // Cambia esto si estás usando timestamps
});

OrdenTrabajo.prototype.actualizarDatos = async function (datosActualizados) {


  const { archivo, ...restData } = datosActualizados;

  // Establecer los nuevos datos
  this.set(restData);

  // Si hay un archivo, actualizar el campo correspondiente
  if (archivo) {

    this.archivo = archivo;  // Asignar el buffer del archivo al campo 'archivo'
  }

  // Guardar los cambios
  await this.save();  // Utiliza 'save' para guardar los cambios

};


// Método estático para encontrar un OrdenTrabajo por ID
OrdenTrabajo.buscarPorId_ot = async function (id_ot) {

  const result = await this.findByPk(id_ot);

  return result;
};


module.exports = OrdenTrabajo;