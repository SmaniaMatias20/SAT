const { DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig.js');
// Define el modelo Usuario
const Documento = sequelize.define('documento', {
  // Define los atributos del modelo
  id_documento: {
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    allowNull:false,
  },
  nombre_documento: {
    type: DataTypes.STRING,
    unique: true,
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
  fecha: {
    type: DataTypes.DATE, // Usar DATEONLY para almacenar solo fechas
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'parametros',
  tableName: 'documento', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
  timestamps: false // Cambia esto si estás usando timestamps
});


module.exports = Documento;
