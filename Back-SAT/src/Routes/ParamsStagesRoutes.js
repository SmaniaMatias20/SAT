const express = require('express');
const Router = express.Router();
const StageParamsController = require('../Controllers/ParamsStagesController');
const middleware = require('../Middleware/AuthJwt');


Router.post('/crear', middleware.tokenAdmin, StageParamsController.CreateParamStage);
Router.get('/obtenerStages', StageParamsController.GetParamStage);
Router.put('/modificar/:id_etapa_de_parametro', middleware.tokenAdmin, middleware.tokenAdmin, StageParamsController.UpdateParamStage);
Router.delete('/borrar/:id_etapa_de_parametro', middleware.tokenAdmin, middleware.tokenAdmin, StageParamsController.DeleteParamStage);


module.exports = Router;