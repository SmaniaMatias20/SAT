const ParamsController = require('../Controllers/ParamsController')
const express = require('express');
const Router = express.Router();

// Define las rutas para los formularios
Router.post('/cargar', ParamsController.CreateParams);
Router.delete('/borrar/:id_parametro', ParamsController.DeleteParams);
Router.put('/modificar/:id_parametro', ParamsController.UpdateParams);
Router.post('/filtrarParams', ParamsController.FilterParams);

Router.get('/tablaParametros', ParamsController.TableParams);


module.exports = Router;