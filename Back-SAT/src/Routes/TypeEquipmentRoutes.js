const express = require('express');
const Router = express.Router();
const TypeEquipmentController = require('../Controllers/TypeEquipmentController');
const middleware = require('../Middleware/AuthJwt');


Router.get('/obtenerTipoEquipo', middleware.tokenAdmin, TypeEquipmentController.GetEquipmentsTypes);


module.exports = Router;