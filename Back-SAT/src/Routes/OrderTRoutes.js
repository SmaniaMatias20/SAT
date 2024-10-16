const express = require('express');
const Router = express.Router();
const OrderController = require('../Controllers/OrderController')
const middleware = require('../Middleware/AuthJwt');
const multer = require('multer');

const storage = multer.memoryStorage(); // Usa memoria para almacenar el archivo temporalmente
const upload = multer({ storage: storage });

// Define las rutas para los usuarios
Router.post('/cargar', middleware.tokenAdmin, upload.single('archivo'), OrderController.CreateOrder);
Router.get('/obtenerOrdenes', OrderController.GetOrders);
Router.get('/obtenerOrdenesPorUsuario', OrderController.GetOrdersByUsuario);
Router.put('/modificar/:id', middleware.tokenAdmin, upload.single('archivo'), OrderController.UpdateOders);
Router.delete('/borrar/:id', middleware.tokenAdmin, OrderController.DeleteOrders);
Router.get('/listarOrdenesTrabajo', middleware.tokenAdmin, OrderController.ListOrders);
Router.get('/listarColumnas', middleware.tokenAdmin, OrderController.ListColumn);
Router.get('/tablaOtAsignadas', middleware.tokenAdmin, OrderController.TableOrder);
Router.get('/obtenerOrdenesPorId', OrderController.GetOrderForId);
Router.get('/descargar', OrderController.DownloadFile);
Router.get('/fetch/:ideEquipo/:ideCp', OrderController.FetchTango);



module.exports = Router;