const Param = require('../Models/ParamsModel');
const TypeSystem = require('../Models/SystemTypeModel');
const Document = require('../Models/DocumentModel.js');
const TypeEquipment = require('../Models/TypeEquimentModel.js');
const TypeDocumentParams = require('../Models/TypeDocumentParamsModel.js');
const StageParam = require('../Models/ParamsStagesModel.js');
const Unit = require('../Models/UnidadDeMedidaModel.js');
const OrdenT = require('../Models/OrdenTModel');
const { CreateTypeDocumentParams, DeleteByIdParametro } = require('./TypeDocumentParamsController.js');
const { GetSystemTypesIds } = require('./SystemTYpeController.js');
const { GetUnitIds } = require('./UnidadDeMedidaController.js');
const { GetStagesIds } = require('./ParamsStagesController.js');
const updateModel = require('../Utils/ModelsUtils');

const UpdateParams = async (req, res) => {
  try {
    const { id_parametro } = req.params;
    const data = req.body;

    // Step 1: Fetch the existing parameter
    const paramLoaded = await Param.buscarPorIdParametro(id_parametro);
    if (!paramLoaded) {
      console.error(`Parameter not found for id_parametro: ${id_parametro}`);
      return res.status(404).json({ error: 'Parameter not found' });
    }

    // Verifica y convierte id_parametro a entero
    // const newIdParam = parseInt(data[0].id_parametro, 10);
    // if (!Number.isInteger(newIdParam)) {
    //   return res.status(400).json({ error: 'El id del parámetro debe ser un número entero.' });
    // }
    // data[0].id_parametro = newIdParam;


    try {
      data[0].sistema_parametro = await GetSystemTypesIds(data[0].sistema_parametro);
      data[0].unidad_medida = await GetUnitIds(data[0].unidad_medida);
      data[0].etapa = await GetStagesIds(data[0].etapa);
    } catch (error) {
      console.error("Error fetching related IDs:", error.message);
      return res.status(400).json({ error: "Invalid input data for related IDs" });
    }
    // Step 3: Update the parameter
    await paramLoaded.actualizarDatos(data[0]);

    // Step 4: Fetch updated parameter to confirm changes
    const updatedParam = await Param.buscarPorIdParametro(id_parametro);

    // Step 5: Delete existing relationships for the parameter
    const deleteResult = await DeleteByIdParametro(id_parametro);
    if (!deleteResult || deleteResult.status !== 200) {
      console.error("Failed to delete existing relationships:", deleteResult?.message || 'Unknown error');
      return res.status(deleteResult?.status || 500).json({ error: deleteResult?.message || 'Failed to delete relationships' });
    }

    // Step 6: Fetch parameter names and IDs for new relationships
    const parametros = await GetParamsNamesIds();

    // Step 7: Create new relationships
    const relationData = await CreateTypeDocumentParams(data, parametros);
    if (!relationData || relationData.status !== 201) {
      console.error("Failed to create new relationships:", relationData?.message || 'Unknown error');
      return res.status(relationData?.status || 500).json({ error: relationData?.message || 'Failed to create relationships' });
    }

    // Step 8: Send success response
    res.status(200).json({ message: 'Update successful', data: updatedParam });
  } catch (error) {
    console.error("Error in UpdateParams function:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "An unexpected error occurred: " + error.message });
  }
};

const TableParams = async (req, res) => {
  try {
    // Obtener las columnas del modelo
    const columnArray = Object.keys(Param.getAttributes());

    // Obtener todos los elementos
    const elementsArray = await Param.findAll();

    // Obtener datos relacionados
    const [unidadesMedida, etapas, sistemas] = await Promise.all([
      Unit.findAll(), // Obtener unidades de medida
      StageParam.findAll(),   // Obtener etapas
      TypeSystem.findAll(),   // Obtener tipos de sistema
    ]);

    // Crear objetos de mapeo
    const unidadMedidaMap = Object.fromEntries(unidadesMedida.map(item => [item.id_unidad_de_medida, item.nombre_unidad_de_medida]));
    const etapaMap = Object.fromEntries(etapas.map(item => [item.id_etapa_de_parametro, item.nombre_etapa_de_parametro]));
    const sistemaMap = Object.fromEntries(sistemas.map(item => [item.id_tipo_de_sistema, item.nombre_tipo_de_sistema]));

    // Transformar elementsArray para reemplazar IDs con nombres
    const transformedElementsArray = elementsArray.map(element => {
      return {
        ...element.dataValues,
        unidad_medida: unidadMedidaMap[element.unidad_medida] || element.unidad_medida,
        etapa: etapaMap[element.etapa] || element.etapa,
        sistema_parametro: sistemaMap[element.sistema_parametro] || element.sistema_parametro,
      };
    });
    // Devolver respuesta
    res.status(200).json({ columnArray, elementsArray: transformedElementsArray });
  } catch (error) {
    res.status(400).json({
      error: "Error: " + error.message,
    });
  }
};



const GetParamsNamesIds = async () => {
  try {
    // Obtener id y nombre de los parámetros
    const params = await Param.findAll({
      attributes: ['id_parametro', 'nombre_parametro']
    });

    // Verificar si no se obtuvieron parámetros
    if (!params || params.length === 0) {
      throw new Error('No se encontraron parámetros.');
    }


    const paramsResult = params.map(param => ({
      id_parametro: param.id_parametro,
      nombre_parametro: param.nombre_parametro.trim() // Limpiar espacios en blanco
    }));

    return paramsResult;
  } catch (error) {
    // Manejo de errores mejorado
    console.error('Error al obtener los parámetros:', error.message);

    // Diferenciar entre tipos de errores
    if (error instanceof SomeDatabaseError) {
      throw new Error('Error de base de datos: ' + error.message);
    } else if (error.message === 'No se encontraron parámetros.') {
      throw new Error('No se encontraron parámetros disponibles.');
    } else {
      throw new Error('Error interno al obtener los parámetros. Intente de nuevo más tarde.');
    }
  }
};


const CreateParams = async (req, res) => {
  try {
    // Obtén los datos del cuerpo de la solicitud
    const data = req.body;

    // Verifica si los campos requeridos están presentes en el primer objeto de datos
    if (!data[0].nombre_parametro || !data[0].sistema_parametro || !data[0].tipo_dato || !data[0].etapa) {
      return res.status(400).json({ error: 'Faltan datos requeridos en la solicitud.' });
    }

    // Verifica y convierte id_parametro a entero
    // const idParametro = parseInt(data[0].id_parametro, 10);
    // if (!Number.isInteger(idParametro)) {
    //   return res.status(400).json({ error: 'El id del parámetro debe ser un número entero.' });
    // }
    // data[0].id_parametro = idParametro;

    // Obtiene el ID de tipo de sistemas
    const systemId = await GetSystemTypesIds(data[0].sistema_parametro.trim());
    data[0].sistema_parametro = systemId;

    // Obtiene el ID de unidad de medida
    const unitId = await GetUnitIds(data[0].unidad_medida.trim());
    data[0].unidad_medida = unitId;

    //Obtiene el ID de etapas de parametros
    const stageId = await GetStagesIds(data[0].etapa.trim());
    data[0].etapa = stageId;

    // Comprobar si el parámetro ya existe
    const existingParam = await Param.findOne({
      where: { nombre_parametro: data[0].nombre_parametro.trim() }
    });

    if (existingParam) {
      return res.status(409).json({ error: 'El parámetro ya existe.' });
    }


    // Inserta el nuevo parámetro en la tabla de parámetros
    const result = await updateModel.createModel(Param, data[0]);


    // Obtiene el nombre y el id de los parametros
    const parametros = await GetParamsNamesIds();

    // Relaciona los datos con sus respectivos IDs
    const relationData = await CreateTypeDocumentParams(data, parametros);

    if (result.status !== 200) {
      return res.status(relationData.status).json({ error: relationData.message });
    }

    if (relationData.status !== 200) {
      return res.status(relationData.status).json({ error: relationData.message });
    }

  } catch (error) {
    console.error('Error al crear el parámetro:', error);
    res.status(500).json({ error: 'Error al crear el parámetro: ' + error.message });
  }
};

const DeleteParams = async (req, res) => {
  try {
    const { id_parametro } = req.params;

    // Verifica que se haya proporcionado un ID
    if (!id_parametro) {
      return res.status(400).json({ error: 'El ID del parámetro es requerido.' });
    }

    // Elimina las relaciones asociadas en TypeDocumentParams
    const deletedRelations = await updateModel.deleteModel(TypeDocumentParams, { id_parametro });

    if (deletedRelations.status === 404) {
      console.warn(`No se encontraron relaciones para el parámetro ID: ${id_parametro}`);
    }

    // Elimina el parámetro del modelo ParamsModel
    const deletedParam = await updateModel.deleteModel(Param, { id_parametro });

    // Verifica si se eliminó algún parámetro
    if (deletedParam.status === 404) {
      return res.status(404).json({ error: 'No se encontró el parámetro a eliminar.' });
    } else if (deletedParam.status !== 200) {
      return res.status(deletedParam.status).json({ error: deletedParam.message });
    }

    // Respuesta exitosa
    return res.status(200).json({ message: 'Parámetro eliminado exitosamente.' });

  } catch (error) {
    console.error('Error al eliminar el parámetro:', error.message);
    return res.status(500).json({ error: 'Error al eliminar el parámetro: ' + error.message });
  }
};

const FilterParams = async (req, res) => {
  try {
    const filtrado = req.body;

    const documento = await updateModel.SearchByOne(Document, 'nombre_documento', filtrado.tipo_servicio);
    const equipo = await updateModel.SearchByOne(TypeEquipment, 'nombre_tipo_equipo', filtrado.tipo_equipo);
    const tablageneral = await TypeDocumentParams.findAll({
      where: {
        id_tipo_equipo: equipo.id_tipo_equipo,
        id_documento: documento.id_documento
      },
      include: [{
        model: Param,
        attributes:
          ['id_parametro', 'nombre_parametro', 'sistema_parametro', 'tipo_dato', 'unidad_medida', 'etapa'], // Solo el nombre del parámetro
        include: [{
          model: StageParam, // Suponiendo que el modelo se llama "Etapa"
          attributes: ['nombre_etapa_de_parametro'] // Solo el nombre de la etapa
        },
        {
          model: Unit, // Aquí incluyes la unidad de medida
          attributes: ['nombre_unidad_de_medida'] // Reemplaza 'nombre_unidad' con el atributo real que deseas
        }]
      }]
    });
    tablageneral.map(item => {

      item.parametro.dataValues.nombre_etapa_de_parametro = item.parametro?.dataValues?.etapaparametro?.dataValues?.nombre_etapa_de_parametro
      item.parametro.dataValues.nombre_unidad_de_medida = item.parametro?.dataValues?.unidadmedida?.dataValues?.nombre_unidad_de_medida
      delete item.parametro.dataValues.etapaparametro;
      delete item.parametro.dataValues.unidadmedida;

    })

    if (tablageneral && tablageneral.length > 0) {
      const results = tablageneral.map(item =>
      ({
        id_param: item.parametro.id_parametro,
        nombre_parametro: item.parametro.nombre_parametro.trim(), // Extrae el nombre del parámetro
        sistema_parametro: item.parametro.sistema_parametro,
        tipo_dato: item.parametro.tipo_dato,
        unidad_medida: item.parametro.unidad_medida,
        etapa: item.parametro.etapa,
        nombre_etapa_de_parametro: item.parametro.dataValues.nombre_etapa_de_parametro,
        nombre_unidad_de_medida: item.parametro.dataValues.nombre_unidad_de_medida
      }));
      res.status(200).json({ data: results });
    } else {
      res.status(404).json({ message: 'No se encontraron registros.' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  CreateParams,
  DeleteParams,
  UpdateParams,
  FilterParams,
  TableParams
};  