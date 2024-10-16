const { DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig.js');
// Define el modelo Usuario
const Tipo_de_sistema = sequelize.define('unidad_de_medida', {
  // Define los atributos del modelo
  id_tipo_de_sistema: {
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    allowNull:false,
  },
  nombre_tipo_de_sistema: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  tableName: 'tiposistema', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
  timestamps: false // Cambia esto si estás usando timestamps
});


Tipo_de_sistema.buscarPorId = async function (id) {
  const result = await this.findByPk(id);
  return result;
};
Tipo_de_sistema.prototype.actualizarDatos = async function (datosActualizados) {

  // Actualizar solo los campos que se pasaron
  const { id, ...restData } = datosActualizados; // Asegúrate de no actualizar el id

  // Establecer los nuevos datos
  this.set(restData);

  // Guardar los cambios
  await this.save();  // Utiliza 'save' para guardar los cambios

};

module.exports = Tipo_de_sistema;