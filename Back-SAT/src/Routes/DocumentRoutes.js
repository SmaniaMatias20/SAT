const express = require('express');
const Router = express.Router();
const DocumentController = require('../Controllers/DocumentController');
const middleware = require('../Middleware/AuthJwt');


Router.get('/obtenerDocumentos', middleware.tokenAdmin, DocumentController.GetDocumentsNames);



module.exports = Router;