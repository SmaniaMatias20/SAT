const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");
const middleware = require("../Middleware/AuthJwt");

// Define las rutas para los usuarios
router.post("/iniciarSesion", UserController.Login);
router.post("/cargar", middleware.tokenAdmin, UserController.CreateUser);
router.get(
  "/tablaUsuarios",
  middleware.tokenAdmin,
  UserController.TableUsers
);
router.get("/listaUsuarios", middleware.tokenAdmin, UserController.GetUsers);
router.get("/listaColumnas", middleware.tokenAdmin, UserController.GetColumns);
router.put(
  "/modificar/:id",
  middleware.tokenAdmin,
  UserController.UpdateUser
);
router.get('/obtenerTecnicos', middleware.tokenAdmin, UserController.GetUsersByRole);
router.delete("/borrar/:id", middleware.tokenAdmin, UserController.DeleteUser);
router.post("/verificarToken", middleware.verifyToken, (req, res) => {
  res.send({ message: "Token Válido" });
});

module.exports = router;
