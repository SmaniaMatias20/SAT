const sql = require('mssql');

const config = {
  user: process.env.TANGO_USERNAME,
  password: process.env.TANGO_PASSWORD,
  server: process.env.TANGO_HOST,
  database: process.env.TANGO_NAME,
  port: parseInt(process.env.TANGO_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
let pool;

async function initPool() {
  try {
    pool = await sql.connect(config);
    console.log('Pool de conexiones inicializado');
  } catch (err) {
    console.error('Error al inicializar el pool:', err);
  }
}
async function closePool(){
    if (pool) {
      await pool.close();
      console.log('Pool de conexiones cerrado');
    }
  };
function getPool() {
  if (!pool) {
    throw new Error('El pool no está inicializado');
  }
  return pool;
}

module.exports = {
  initPool,
  getPool,
  closePool
};