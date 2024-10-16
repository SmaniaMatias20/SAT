const express = require('express');
const app = express();
const Routes = require('./src/Routes/Routes');
const cors = require('cors');
const sequelize = require('./src/Config/dbconfig');
const TipoEquipo = require('./src/Models/TypeEquimentModel.js');
const Documento = require('./src/Models/DocumentModel.js');
const Parametro = require('./src/Models/ParamsModel.js');
const Tipoequipo_Documento_Parametro = require('./src/Models/TypeDocumentParamsModel.js');
const Unidad_de_medida = require("./src/Models/UnidadDeMedidaModel"); // Ajusta la ruta según tu estructura
const Tipo_de_sistema = require("./src/Models/SystemTypeModel"); // Ajusta la ruta según tu estructura
const Etapa_parametro = require("./src/Models/ParamsStagesModel")
const { initPool, closePool } = require('./src/Config/dbPool'); // Importa el pool
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes JSON con un límite aumentado
app.use(express.json({ limit: '25mb' }));

// Middleware para analizar el cuerpo de las solicitudes URL-encoded con un límite aumentado
app.use(express.urlencoded({ limit: '25mb', extended: true }));


const models = {
  TipoEquipo,
  Documento,
  Parametro,
  Tipoequipo_Documento_Parametro,
  Unidad_de_medida,
  Tipo_de_sistema,
  Etapa_parametro
};

// Asociar los modelos
Object.values(models).forEach(model => {
  if (model.associate) {
      model.associate(models);  // Aquí pasas el objeto 'models'
  }
});

// Rutas
app.use('/', Routes);


sequelize.sync({ alter: true }).then(() => {
  
  const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
    // Inicializa el pool de conexiones
    initPool();
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
const shutdown = async () => {
  console.log('Cerrando el servidor...');
    // Luego cierra el pool de MSSQL
    try {
       await closePool()
       await sequelize.close();
    } catch (error) {
      console.error('Error al cerrar el pool de conexiones:', error);
    }finally{
      process.exit(0)
    }
};

// Captura señales de cierre
process.on('SIGINT', async () => {
  await shutdown();
}); // Ctrl + C
process.on('SIGTERM', async () => {
  await shutdown();
}); // Seña

// Manejo de errores no capturados
process.on('uncaughtException', async (error) => {
  console.error('Error no capturado:', error);
  await shutdown(); // Llama a la función de cierre
});

process.on('unhandledRejection', async (reason) => {
  console.error('Rechazo no manejado:', reason);
  await shutdown(); // Llama a la función de cierre
});

}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});