const TypeSystem = require("../Models/SystemTypeModel");
const updateModel = require("../Utils/ModelsUtils");

const CreateSystem = async (req, res) => {
  try {
    const data = req.body;
    const result = await updateModel.createModel(TypeSystem, data);

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
      .json({ error: "Error al crear el tipo de sistema: " + error.message });
  }
};

const UpdateSystem = async (req, res) => {
  try {
    const { id_tipo_de_sistema } = req.params;
    const data = req.body;
    const result = await updateModel.updateModel(TypeSystem, { id_tipo_de_sistema: id_tipo_de_sistema }, data);
    if (result.status === 200) {
      res.status(result.status).json({ message: result.message, data: result.data });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al eliminar el tipo de sistema" + error.message });
  }
};

const DeleteSystem = async (req, res) => {
  try {
    const { id_tipo_de_sistema } = req.params; // Obtener el ID del parámetro de la URL
    // Asumiendo que updateModel.deleteModel acepta un ID en lugar de un objeto
    const result = await updateModel.deleteModel(TypeSystem, { id_tipo_de_sistema });

    if (result.status === 200) {
      res.status(result.status).json({ message: result.message });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (err) {
    console.error("Error al eliminar el tipo de sistema:", err);
    res.status(500).json({ message: "Error al eliminar el tipo de sistema" });
  }
};

const GetSystemTypes = async (req, res) => {
  try {
    const tiposDeSistema = await TypeSystem.findAll({
      attributes: ['nombre_tipo_de_sistema', 'id_tipo_de_sistema'] // Solo obtener el campo nombre_documento
    });

    res.status(200).json({ mensaje: "sistemas encontrados", tiposDeSistema });
  } catch (error) {
    console.error("Error al obtener los nombres de los sistemas:", error);
    res.status(500).json({ error: "Error al obtener los nombres de los documentos: " + error.message });
  }
};

const GetSystemTypesIds = async (name) => {
  const data = await TypeSystem.findOne({
    where: { nombre_tipo_de_sistema: name },
    attributes: ['id_tipo_de_sistema'] // Reemplaza 'id' con el nombre de la columna que representa el ID en tu modelo
  });

  const systemId = data ? data.id_tipo_de_sistema : null;


  return systemId;
}


module.exports = {
  CreateSystem,
  UpdateSystem,
  DeleteSystem,
  GetSystemTypes,
  GetSystemTypesIds
};