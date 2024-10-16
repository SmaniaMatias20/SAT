const express = require('express');
const Router = express.Router();
const TypeDocumentParamsController = require('../Controllers/TypeDocumentParamsController');


// Falta agregar el middleware
Router.get('/obtenerTablaDeVerdad/:id_parametro', TypeDocumentParamsController.GetRecordsByIdParametro);

module.exports = Router;