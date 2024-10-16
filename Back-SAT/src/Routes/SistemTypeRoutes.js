const express = require('express');
const Router = express.Router();
const TypeSystemController = require('../Controllers/SystemTYpeController');
const middleware = require('../Middleware/AuthJwt');


Router.post('/crear', middleware.tokenAdmin, TypeSystemController.CreateSystem);
Router.get('/obtenerTipoSistema', TypeSystemController.GetSystemTypes);
Router.put('/modificar/:id_tipo_de_sistema', middleware.tokenAdmin, middleware.tokenAdmin, TypeSystemController.UpdateSystem);
Router.delete('/borrar/:id_tipo_de_sistema', middleware.tokenAdmin, middleware.tokenAdmin, TypeSystemController.DeleteSystem);


module.exports = Router;