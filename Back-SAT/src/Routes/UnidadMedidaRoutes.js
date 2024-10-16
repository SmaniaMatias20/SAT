const express = require('express');
const Router = express.Router();
const UnitController = require('../Controllers/UnidadDeMedidaController');
const middleware = require('../Middleware/AuthJwt');


Router.post('/crear', middleware.tokenAdmin, UnitController.CreateUnit);
Router.put('/modificar/:id', middleware.tokenAdmin, UnitController.UpdateUnit);
Router.delete('/borrar/:id_unidad_de_medida', middleware.tokenAdmin, UnitController.DeleteUnit);


module.exports = Router;