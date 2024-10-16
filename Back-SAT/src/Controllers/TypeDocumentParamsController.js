const TypeDocumentParams = require('../Models/TypeDocumentParamsModel');
const TypeEquipment = require('../Models/TypeEquimentModel.js');
const Document = require('../Models/DocumentModel.js');
const { GetDocumentsNamesIds } = require('./DocumentController.js');
const { GetTypeEquipmentNamesIds } = require('./TypeEquipmentController.js');
const updateModel = require('../Utils/ModelsUtils');


// Relates the created parameters with their document and equipment type
const CreateTypeDocumentParams = async (data, parametros) => {
    // Obtain existing documents and equipment
    const documentos = await GetDocumentsNamesIds();
    const equipos = await GetTypeEquipmentNamesIds();

    // Create a map to quickly access the ID of the equipment type by name
    const equipMap = equipos.reduce((acc, equipo) => {
        acc[equipo.nombre_tipo_equipo] = equipo.id_tipo_equipo;
        return acc;
    }, {});

    // Create a map to quickly access the ID of the document by name
    const docMap = documentos.reduce((acc, documento) => {
        acc[documento.nombre_documento] = documento.id_documento;
        return acc;
    }, {});

    // Create a map to quickly access the ID of the parameter by name
    const paramMap = parametros.reduce((acc, parametro) => {
        const cleanedName = parametro.nombre_parametro.trim(); // Remove whitespace
        acc[cleanedName] = parametro.id_parametro;
        return acc;
    }, {});

    // Get the parameter name from data
    const nombreParametro = data[0].nombre_parametro.trim(); // Clean spaces
    const idParametro = paramMap[nombreParametro]; // Get ID_PARAMETR


    if (!idParametro) {
        console.error(`ID_PARAMETRO not found for: "${nombreParametro}"`);
        return; // Optionally handle the error here
    }

    const relationData = data
        .filter(item => item.fila) // Filter objects with the 'fila' property
        .flatMap(item => {
            // Map item.fila to id_tipo_equipo using the created map
            const equipId = equipMap[item.fila];

            // If equipId is not defined, it means item.fila does not have a match in equipment
            if (!equipId) return [];

            // Iterate over the keys that are true to assign documents
            return Object.keys(item)
                .filter(key => key !== 'fila' && item[key]) // Filter out non-fila keys with true values
                .map(key => {
                    const idDocumento = docMap[key]; // Get ID_DOCUMENTO using the map
                    if (!idDocumento) return null; // If ID_DOCUMENTO is not found, return null

                    return {
                        id_tipo_equipo: equipId, // Use the obtained equipment type ID
                        id_documento: idDocumento, // Assign the corresponding ID_DOCUMENTO
                        id_parametro: idParametro // Assign the corresponding ID_PARAMETRO
                    };
                })
                .filter(item => item !== null); // Filter out nulls
        });

    // Check that all fields have a value
    const hasUndefined = relationData.some(item =>
        item.id_tipo_equipo === undefined ||
        item.id_documento === undefined ||
        item.id_parametro === undefined
    );

    if (hasUndefined) {
        return { status: 400, message: 'All fields must have a value.' }; // Adjust response as needed
    }

    // Insert the relationship data into the corresponding table
    const resultRelationData = await updateModel.createModel(TypeDocumentParams, relationData);

    if (resultRelationData.status !== 201) {
        return { status: resultRelationData.status, message: resultRelationData.message }; // Adjust response as needed
    }

    return { status: 201, data: resultRelationData }; // Return success response
};


const DeleteByIdParametro = async (id_parametro) => {
    try {
        // Delete records that match the id_parametro
        const result = await TypeDocumentParams.destroy({
            where: { id_parametro }
        });

        // Check if any records were deleted
        if (result === 0) {
            // console.log(`No records found to delete with id_parametro: ${id_parametro}`);
            return { status: 404, message: `No records found to delete with id_parametro: ${id_parametro}` };
        } else {
            // console.log(`Deleted ${result} records with id_parametro: ${id_parametro}`);
            return { status: 200, message: `Deleted ${result} records successfully` };
        }
    } catch (error) {
        // Error handling
        console.error(`Error deleting records: ${error.message}`);
        return { status: 500, message: `Could not delete records: ${error.message}` };
    }
};


const GetRecordsByIdParametro = async (req, res) => {
    const { id_parametro } = req.params; // Extraer id_parametro de los parámetros de la solicitud

    try {
        // Validar que se proporcione id_parametro
        if (!id_parametro) {
            return res.status(400).json({ error: 'id_parametro is required' });
        }

        // Buscar los registros en TypeDocumentParams
        const records = await TypeDocumentParams.findAll({
            where: { id_parametro },
            attributes: ['id_tipo_equipo', 'id_documento'], // Traer solo los IDs
        });

        // Verificar si se encontraron registros
        if (!records || records.length === 0) {
            return res.status(404).json({ error: 'No records found for the given id_parametro' });
        }

        // Obtener los IDs para las consultas
        const idsTipoEquipo = records.map(record => record.id_tipo_equipo);
        const idsDocumento = records.map(record => record.id_documento);

        // Buscar los nombres correspondientes
        const tiposEquipo = await TypeEquipment.findAll({
            where: { id_tipo_equipo: idsTipoEquipo },
            attributes: ['id_tipo_equipo', 'nombre_tipo_equipo'],
        });

        const documentos = await Document.findAll({
            where: { id_documento: idsDocumento },
            attributes: ['id_documento', 'nombre_documento'],
        });

        // Crear un mapa para los nombres de tipo de equipo
        const tipoEquipoMap = {};
        tiposEquipo.forEach(te => {
            tipoEquipoMap[te.id_tipo_equipo] = te.nombre_tipo_equipo;
        });

        // Crear un mapa para los nombres de documentos
        const documentoMap = {};
        documentos.forEach(doc => {
            documentoMap[doc.id_documento] = doc.nombre_documento;
        });

        // Preparar la respuesta con solo los nombres
        const result = records.map(record => ({
            tipo_equipo_nombre: tipoEquipoMap[record.id_tipo_equipo],
            documento_nombre: documentoMap[record.id_documento],
        }));

        // Retornar los nombres encontrados
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in GetRecordsByIdParametro:", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};






module.exports = {
    CreateTypeDocumentParams,
    DeleteByIdParametro,
    GetRecordsByIdParametro
}; 