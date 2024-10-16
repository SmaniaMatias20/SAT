const TypeEquipment = require("../Models/TypeEquimentModel");

const GetEquipmentsTypes = async (req, res) => {
  try {
    const tiposDeEquipo = await TypeEquipment.findAll({
      attributes: ['nombre_tipo_equipo'] // Solo obtener el campo nombre_documento
    });

    res.status(200).json({ mensaje: "Documentos encontrados", tiposDeEquipo });
  } catch (error) {
    console.error("Error al obtener los nombres de los documentos:", error);
    res.status(500).json({ error: "Error al obtener los nombres de los documentos: " + error.message });
  }
};

const GetTypeEquipmentNamesIds = async () => {
  try {
    // Obtener id y nombre de los equipos
    const equipment = await TypeEquipment.findAll({
      attributes: ['id_tipo_equipo', 'nombre_tipo_equipo']
    });

    // Verificar si no se obtuvieron equipos
    if (!equipment || equipment.length === 0) {
      throw new Error('No se encontraron tipos de equipos.');
    }

    const equipmentResult = equipment.map(equipo => ({
      id_tipo_equipo: equipo.id_tipo_equipo,
      nombre_tipo_equipo: equipo.nombre_tipo_equipo.trim() // Limpiar espacios en blanco
    }));

    return equipmentResult;
  } catch (error) {
    // Manejo de errores mejorado
    console.error('Error al obtener los tipos de equipos:', error.message);

    // Diferenciar entre tipos de errores
    if (error instanceof SomeDatabaseError) {
      throw new Error('Error de base de datos: ' + error.message);
    } else if (error.message === 'No se encontraron tipos de equipos.') {
      throw new Error('No se encontraron tipos de equipos disponibles.');
    } else {
      throw new Error('Error interno al obtener los tipos de equipos. Intente de nuevo más tarde.');
    }
  }
};

module.exports = {
  GetEquipmentsTypes,
  GetTypeEquipmentNamesIds
};