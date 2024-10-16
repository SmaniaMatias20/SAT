const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        const tokenSinFormatear = req.headers['authorization'];
        const decoded = jwt.verify(tokenSinFormatear.split(' ')[1],process.env.secretKey);

        req.user = decoded;
        next(); // Pasar al siguiente middleware o ruta
        // res.status(200).json({ mensaje: 'Token válsddsido', decoded });
      } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }
};


const tokenAdmin = async (req, res, next) => {
  try {
      const tokenSinFormatear = req.headers['authorization'];
      const decoded = jwt.verify(tokenSinFormatear.split(' ')[1],process.env.secretKey);

      if(decoded.rol === 'admin')
      {
        next();
      }
      else
      {
        res.status(201).json({message: 'Acceso denegado'})
      }
      // Pasar al siguiente middleware o ruta
      // res.status(200).json({ mensaje: 'Token válsddsido', decoded });
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
};

  module.exports = {
    verifyToken,
    tokenAdmin
  }
