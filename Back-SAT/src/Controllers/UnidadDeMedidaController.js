const Unit = require("../Models/UnidadDeMedidaModel");
const updateModel = require("../Utils/ModelsUtils");

const CreateUnit = async (req, res) => {
  try {
    const data = req.body;

    const result = await updateModel.createModel(Unit, data);

    if (result.status === 201) {

      res.status(result.status).json({ message: result.message, data: result.data });
    } else {
      res.status(result.status).json({ error: result.message });
    }

  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al crear la unidad de medida: " + error.message });
  }
};


const GetUnit = async (req, res) => {
  try {
    const tiposDeUnidades = await Unit.findAll({
      attributes: ['nombre_unidad_de_medida', 'id_unidad_de_medida'] // Solo obtener el campo nombre_documento
    });

    res.status(200).json({ mensaje: "unidades encontrados", tiposDeUnidades });
  } catch (error) {
    console.error("Error al obtener los nombres de los unidades:", error);
    res.status(500).json({ error: "Error al obtener los nombres de los documentos: " + error.message });
  }
};

const UpdateUnit = async (req, res) => {
  try {
    const { id_unidad_de_medida } = req.params;
    const data = req.body;
    const result = await updateModel.updateModel(Unit, { id_unidad_de_medida: id_unidad_de_medida }, data);
    if (result.status === 200) {
      res.status(result.status).json({ message: result.message, data: result.data });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al actualizar la Unidad de Medida" + error.message });
  }
};

const DeleteUnit = async (req, res) => {
  try {
    const { id_unidad_de_medida } = req.params; // Obtener el ID del parámetro de la URL
    // Asumiendo que updateModel.deleteModel acepta un ID en lugar de un objeto
    const result = await updateModel.deleteModel(Unit, { id_unidad_de_medida });
    if (result.status === 200) {
      res.status(result.status).json({ message: result.message });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (err) {
    console.error("Error la unidad de medida:", err);
    res.status(500).json({ message: "Error al eliminar la unidad de medida" });
  }
};

const GetUnitIds = async (name) => {
  const data = await Unit.findOne({
    where: { nombre_unidad_de_medida: name },
    attributes: ['id_unidad_de_medida'] // Reemplaza 'id' con el nombre de la columna que representa el ID en tu modelo
  });

  const unitId = data ? data.id_unidad_de_medida : null;

  return unitId;
}


module.exports = {
  CreateUnit,
  UpdateUnit,
  DeleteUnit,
  GetUnit,
  GetUnitIds
};