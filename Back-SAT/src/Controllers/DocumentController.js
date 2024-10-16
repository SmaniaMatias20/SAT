const Document = require("../Models/DocumentModel");

const GetDocumentsNames = async (req, res) => {
  try {
    const documentos = await Document.findAll({
      attributes: ['nombre_documento'] // Solo obtener el campo nombre_documento
    });

    if (!documentos || documentos.length === 0) {
      return res.status(404).json({ error: "No se encontraron documentos." });
    }

    res.status(200).json({ mensaje: "Documentos encontrados", documentos });
  } catch (error) {
    console.error("Error al obtener los nombres de los documentos:", error);

    // Manejo de errores específicos
    if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ error: "Error de base de datos: " + error.message });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(422).json({ error: "Error de validación: " + error.message });
    } else {
      res.status(500).json({ error: "Error inesperado: " + error.message });
    }
  }
};

const GetDocumentsNamesIds = async () => {
  try {
    // Obtener id y nombre de los tipos de documentos
    const documentos = await Document.findAll({
      attributes: ['id_documento', 'nombre_documento']
    });

    // Verificar si no se obtuvieron documentos
    if (!documentos || documentos.length === 0) {
      throw new Error('No se encontraron tipos de documentos.');
    }

    const documentsResult = documentos.map(doc => ({
      id_documento: doc.id_documento,
      nombre_documento: doc.nombre_documento.trim() // Limpiar espacios en blanco
    }));

    return documentsResult;
  } catch (error) {
    // Manejo de errores mejorado
    console.error('Error al obtener los tipos de documentos:', error.message);

    // Diferenciar entre tipos de errores
    if (error instanceof SomeDatabaseError) {
      throw new Error('Error de base de datos: ' + error.message);
    } else if (error.message === 'No se encontraron tipos de documentos.') {
      throw new Error('No se encontraron tipos de documentos disponibles.');
    } else {
      throw new Error('Error interno al obtener los tipos de documentos. Intente de nuevo más tarde.');
    }
  }
};

module.exports = {
  GetDocumentsNames,
  GetDocumentsNamesIds
};