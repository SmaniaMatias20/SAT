const { DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig.js');
const bcrypt = require('bcrypt');
// Define el modelo Usuario
const Usuario = sequelize.define('usuarios', {
  // Define los atributos del modelo
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Asegura que los nombres de usuario sean únicos
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo validate debe ser una cadena de texto.');
        }
      }
    }
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo rol debe ser una cadena de texto.');
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Valida que el valor sea una cadena de texto
      esString(value) {
        if (typeof value !== 'string') {
          throw new Error('El campo password debe ser una cadena de texto.');
        }
      }
    }
  },
  fecha_subida: {
    type: DataTypes.DATE, // Usar DATEONLY para almacenar solo fechas
    allowNull: false,
    defaultValue: DataTypes.NOW,

  }
}, {
  schema: 'usuarios',
  tableName: 'usuarios', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
  timestamps: false // Cambia esto si estás usando timestamps
});

// Encriptar la contraseña antes de guardar el usuario
Usuario.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Método para validar la contraseña
Usuario.prototype.validarPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};
// Método para actualizar la información del usuario
Usuario.prototype.actualizarDatos = async function (datosActualizados) {

  // Actualizar solo los campos que se pasaron
  const { id, ...restData } = datosActualizados; // Asegúrate de no actualizar el id

  // Establecer los nuevos datos
  this.set(restData);

  // Guardar los cambios
  await this.save();  // Utiliza 'save' para guardar los cambios

};
// Método estático para encontrar un usuario por ID
Usuario.buscarPorId = async function(id) {
  const result = await this.findByPk(id);
  return result;
};

// Método estático para encontrar un usuario por nombre de usuario
Usuario.buscarPorUsuario = async function (usuario) {
  const result = await this.findOne({ where: { usuario } });
  return result;
};

// Método estático para encontrar un usuario por ID
Usuario.buscarPorId = async function (id) {
  const result = await this.findByPk(id);
  return result;
};



module.exports = Usuario;