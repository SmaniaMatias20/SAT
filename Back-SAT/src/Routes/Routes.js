const express = require('express');
const Router = express.Router();
const UsersRoutes = require('./UserRoutes');
const OrderTRoutes = require('./OrderTRoutes');
const ParamsRoutes = require('./ParamsRoutes');
const OrderTLoadedRoutes = require('./OrderTLoadedRoutes');
const DocumentRoutes = require('./DocumentRoutes');
const TypeEquipmentRoutes = require('./TypeEquipmentRoutes');
const TypeSystemRoutes = require('./SistemTypeRoutes');
const UnitRoutes = require('./UnidadDeMedidaRoutes');
const StagesRoutes = require('./ParamsStagesRoutes');
const TypesDocumentsParams = require('./TypeDocumentRoutes')


Router.use('/usuarios', UsersRoutes);
Router.use('/ordenes', OrderTRoutes);
Router.use('/parametros', ParamsRoutes);
Router.use('/ordenesCargadas', OrderTLoadedRoutes);
Router.use('/documentos', DocumentRoutes);
Router.use('/tiposDeEquipo', TypeEquipmentRoutes);
Router.use('/tiposDeSistema', TypeSystemRoutes);
Router.use('/tiposDeUnidades', UnitRoutes);
Router.use('/tiposDeStages', StagesRoutes);
Router.use('/tiposDeDocumentosParametros', TypesDocumentsParams);

module.exports = Router;