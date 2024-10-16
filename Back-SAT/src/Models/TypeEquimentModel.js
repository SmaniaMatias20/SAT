const { DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig.js');


const TipoEquipo = sequelize.define('tipoequipo', {
    // Define los atributos del modelo
    id_tipo_equipo: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false,
    },
    nombre_tipo_equipo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        // Valida que el valor sea una cadena de texto
        esString(value) {
          if (typeof value !== 'string') {
            throw new Error('El campo nombre_tipo_equipo debe ser una cadena de texto.');
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
    tableName: 'tipoequipo', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
    timestamps: false // Cambia esto si estás usando timestamps
  });
  
  
  module.exports = TipoEquipo;
  