const { Sequelize } = require('sequelize');
require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
   // host: '175.10.0.54',
   // port: 5434,
   // dialect: 'postgres',
   // logging: false, // Cambia a true si quieres ver las consultas SQL en la consola

   host: '175.10.0.54',
   dialect: 'postgres',
   logging: false, // Cambia a true si quieres ver las consultas SQL en la consola
   port:5434
});

module.exports = sequelize;



// const { Sequelize } = require('sequelize');
// require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: '175.10.0.92',
//   dialect: 'postgres',
//   logging: false, // Cambia a true si quieres ver las consultas SQL en la consola
// });

// module.exports = sequelize;


// host: 'localhost',
// dialect: 'postgres',
// logging: false, // Cambia a true si quieres ver las consultas SQL en la consola