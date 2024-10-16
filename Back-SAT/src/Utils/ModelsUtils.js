require('dotenv').config();

const updateModel = async (Model, whereClause, data) => {
  try {
    // Actualiza el registro en la base de datos
    const [numberOfAffectedRows] = await Model.update(data, {
      where: whereClause,
      individualHooks: true // Esto asegura que se ejecuten los hooks si hay alguno
    });
    if (numberOfAffectedRows === 0) {
      return { status: 404, message: 'Registro no encontrado o no modificado' };
    }

    // Encuentra el registro actualizado
    const updatedRecord = await Model.findOne({ where: whereClause });

    return { status: 200, message: 'Actualización exitosa', data: updatedRecord };
  } catch (error) {
    console.error("Error al modificar los datos:", error.message);
    return { status: 400, message: 'Error al modificar los datos: ' + error.message };
  }
};

const updateModelsInBatch = async (Model, updates) => {
  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Debe proporcionar un array de actualizaciones');
    }

    // Extraer todos los IDs de los registros a actualizar
    const ids = updates.map(update => update.id);
    // Buscar todos los registros que necesitan ser actualizados
    const records = await Model.findAll({ where: { id: ids } });

    // Crear un mapa para un acceso rápido a los registros por ID
    const recordMap = new Map(records.map(record => [record.id, record]));
    const results = [];

    // Iterar sobre cada objeto en el array de actualizaciones
    for (const update of updates) {
      const { id, ...data } = update;

      const record = recordMap.get(id);

      if (!record) {
        results.push({ id, status: 404, message: 'Registro no encontrado' });
        continue;
      }

      // Actualizar el registro con los nuevos datos
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          record[key] = data[key];
        }
      }

      results.push({ id, status: 200, message: 'Actualización exitosa' });
    }

    // Guardar todos los registros actualizados en una transacción
    await Model.sequelize.transaction(async (transaction) => {
      await Promise.all(results.map(result => {
        if (result.status === 200) {
          const record = recordMap.get(result.id);
          return record.save({ transaction });
        }
      }));
    });

    return { status: 200, message: 'Actualización completa', data: results };
  } catch (error) {
    console.error('Error al modificar los datos:', error); // Añadir logging para depuración
    return { status: 400, message: 'Error al modificar los datos: ' + error.message };
  }
};


const deleteModel = async (Model, whereClause) => {
  try {
    // Busca los registros que coincidan con la cláusula `where`
    const records = await Model.findAll({ where: whereClause });

    if (records.length === 0) {
      return { status: 404, message: 'No se encontraron registros para eliminar' };
    }

    // Elimina los registros que coincidan
    const deleteCount = await Model.destroy({ where: whereClause });

    if (deleteCount === 0) {
      return { status: 404, message: 'No se encontraron registros para eliminar' };
    }

    return { status: 200, message: `${deleteCount} registro(s) eliminado(s) exitosamente` };

  } catch (error) {
    return { status: 400, message: 'Error al eliminar los registros: ' + error.message };
  }
};


const createModel = async (Model, data) => {
  try {
    // Si `data` es un arreglo, usa `bulkCreate` para múltiples inserciones
    if (Array.isArray(data)) {
      const records = await Model.bulkCreate(data);
      return { status: 201, message: 'Registros creados exitosamente', data: records };
    }

    // Si no es un arreglo, usa `create` para un solo registro
    const record = await Model.create(data);
    return { status: 201, message: 'Registro creado exitosamente', data: record };

  } catch (error) {
    return { status: 400, message: 'Error al crear el registro: ' + error.message };
  }

}


const SearchByOne = async (Model, condicion, value) => {
  const elemento = await Model.findOne({ where: { [condicion]: value } });
  // Buscar el ID del documento
  if (!elemento) {
    throw new Error(`Model con nombre ${value} no encontrado en la tabla Model.`);
  }
  return elemento;
}

module.exports = { updateModel, deleteModel, createModel, updateModelsInBatch, SearchByOne };
