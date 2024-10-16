const StageParams = require("../Models/ParamsStagesModel");
const updateModel = require("../Utils/ModelsUtils");

const CreateParamStage = async (req, res) => {
  try {
    const data = req.body;

    const result = await updateModel.createModel(StageParams, data);

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
      .json({ error: "Error al crear la etapa del parametro: " + error.message });
  }
};

const UpdateParamStage = async (req, res) => {
  try {
    const { id_etapa_de_parametro } = req.params;
    const data = req.body;

    const result = await updateModel.updateModel(StageParams, { id_etapa_de_parametro: id_etapa_de_parametro }, data);
    if (result.status === 200) {
      res.status(result.status).json({ message: result.message, data: result.data });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al actualizar la etapa del parametro: " + error.message });
  }
};

const DeleteParamStage = async (req, res) => {
  try {
    const { id_etapa_de_parametro } = req.params; // Obtener el ID del parámetro de la URL

    // Asumiendo que updateModel.deleteModel acepta un ID en lugar de un objeto
    const result = await updateModel.deleteModel(StageParams, { id_etapa_de_parametro });
    if (result.status === 200) {
      res.status(result.status).json({ message: result.message });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (err) {
    console.error("Error al eliminar la etapa del parametro:", err);
    res.status(500).json({ message: "Error al eliminar la etapa del parametro" });
  }
};

const GetParamStage = async (req, res) => {
  try {
    const tiposDeEstadosDeParametro = await StageParams.findAll({
      attributes: ['nombre_etapa_de_parametro', 'id_etapa_de_parametro'] // Solo obtener el campo nombre_documento
    });
    res.status(200).json({ mensaje: "sistemas encontrados", tiposDeEstadosDeParametro });
  } catch (error) {
    console.error("Error al obtener los nombres de los sistemas:", error);
    res.status(500).json({ error: "Error al obtener los nombres de los documentos: " + error.message });
  }
};

const GetStagesIds = async (name) => {
  const data = await StageParams.findOne({
    where: { nombre_etapa_de_parametro: name },
    attributes: ['id_etapa_de_parametro'] // Reemplaza 'id' con el nombre de la columna que representa el ID en tu modelo
  });

  const stageId = data ? data.id_etapa_de_parametro : null;

  return stageId;
}


module.exports = {
  CreateParamStage,
  UpdateParamStage,
  DeleteParamStage,
  GetParamStage,
  GetStagesIds

};