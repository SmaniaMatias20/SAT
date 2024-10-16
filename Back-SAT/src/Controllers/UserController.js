const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const updateModel = require("../Utils/ModelsUtils");
require("dotenv").config();

const CreateUser = async (req, res) => {
  try {
    const data = req.body;

    const result = await updateModel.createModel(User, data);

    if (result.status === 201) {
      res
        .status(result.status)
        .json({ message: result.message, data: result.data });
    } else {
      res.status(result.status).json({ error: result.message });
    }

  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al crear el usuario: " + error.message });
  }
};
// Iniciar sesión
const Login = async (req, res) => {
  try {
    // const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { usuario, password } = req.body;
    const usuarioEncontrado = await User.buscarPorUsuario(usuario);
    if (!usuarioEncontrado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const esValido = await usuarioEncontrado.validarPassword(password);
    if (!esValido) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { userId: usuario, rol: usuarioEncontrado.rol },
      process.env.secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token: token,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol,
      token: token,
    });
  } catch (error) {
    console.error('Error inesperado al iniciar sesión:', error);
    res.status(500).json({ error: "Error inesperado al iniciar sesión. Inténtelo más tarde." });
  }
};

const TableUsers = async (req, res) => {
  try {
    const columnArray = Object.keys(User.getAttributes());
    const elementsArray = await User.findAll();
    res.status(200).json({ columnArray, elementsArray });
  } catch {
    res.status(400).json({
      error: "error" + error.message,
    });
  }
};

const GetColumns = async (req, res) => {
  try {
    const listacolumnas = Object.keys(User.getAttributes());
    res.status(200).json({ listacolumnas });
  } catch {
    res.status(400).json({
      error: "error" + error.message,
    });
  }
};
const GetUsers = async (req, res) => {
  try {
    const elementoEncontrado = await User.findAll();
    res.status(200).json({ mensaje: "Usuarios", elementoEncontrado });
  } catch (error) {
    res.status(400).json({
      error: "Error al devolver la lista de usuarios: " + error.message,
    });
  }
};
const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await User.buscarPorId(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Llama a actualizarDatos con los datos recibidos
    await user.actualizarDatos(data);

    const updatedUser = await User.buscarPorId(id);


    res.status(200).json({ message: 'Actualización exitosa', data: updatedUser });
  } catch (error) {
    console.error("Error en la función UpdateUser:", error);
    res.status(400).json({ error: "Error al actualizar el usuario: " + error.message });
  }
};



const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del parámetro de la URL

    // Asumiendo que updateModel.deleteModel acepta un ID en lugar de un objeto
    const result = await updateModel.deleteModel(User, { id });

    if (result.status === 200) {
      res.status(result.status).json({ message: result.message });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

const GetUsersByRole = async (req, res) => {
  try {
    const { rol } = req.query; // Obtener el rol de los query params

    if (!rol) {
      return res.status(400).json({ error: "Debe proporcionar un rol para filtrar" });
    }

    // Filtrar usuarios por rol
    const usuariosFiltrados = await User.findAll({ where: { rol } });

    if (usuariosFiltrados.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron usuarios con ese rol" });
    }

    res.status(200).json({ mensaje: `Usuarios con el rol ${rol}`, usuariosFiltrados });
  } catch (error) {
    console.error("Error al obtener usuarios por rol:", error);
    res.status(500).json({
      error: "Error al obtener la lista de usuarios por rol: " + error.message,
    });
  }
};


module.exports = {
  CreateUser,
  Login,
  GetUsers,
  UpdateUser,
  DeleteUser,
  GetColumns,
  TableUsers,
  GetUsersByRole,
};