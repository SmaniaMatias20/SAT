
const OrdenT = require('../Models/OrdenTModel'); // Ajusta la ruta según tu estructura
const updateModel = require('../Utils/ModelsUtils');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getPool } = require('../Config/dbPool'); 
const multer = require("multer");
const { where } = require('sequelize');
const storage = multer.memoryStorage(); // Usa memoria para almacenar el archivo temporalmente
const upload = multer({ storage: storage });

const CreateOrder = async (req, res) => {
  try {
    const data = req.body; // Obtener los datos del cuerpo de la solicitud

    // Manejar el archivo si está presente en la solicitud
    if (req.file) {
      data.archivo = req.file.buffer;  // Asignar el buffer del archivo al campo 'archivo'
    }
    // Llamar a la función para crear un nuevo registro en la base de datos
    const result = await updateModel.createModel(OrdenT, data);

    // Responder al cliente en función del resultado de la creación
    if (result.status === 201) {
      res.status(result.status).json({ message: result.message, data: result.data });
    } else {
      res.status(result.status).json({ error: result.message });
    }

  } catch (error) {
    // Manejar cualquier error durante el proceso
    res.status(400).json({ error: 'Error al crear la orden: ' + error.message });
  }
};


const GetOrders = async (req, res) => {
  try {

    const { estado } = req.query; // Obteniendo el estado desde query params si existe

    let whereClause = {};

    if (estado) {
      const estadosValidos = ["pendiente", "realizada"];

      if (!estadosValidos.includes(estado.toLowerCase())) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      // Añadir condición al whereClause si se pasa un estado
      whereClause.estado = estado.toLowerCase();
    }
    const ordenes = await OrdenT.findAll({
      where: whereClause,
      attributes: ["id", "titulo", "cliente", "estado", "aprobado", "archivo", "idequipo", "tipo_servicio", "tipo_equipo"],
    });
    if (ordenes.length > 0) {
      res.status(200).json(ordenes);
    } else {
      res
        .status(404)
        .json({
          error: estado
            ? `No se encontraron órdenes con estado ${estado}`
            : "No se encontraron órdenes",
        });
    }
  } catch (error) {
    res
      .status(400)
      .json({
        error: "Error al obtener las órdenes de trabajo: " + error.message,
      });
  }
};

const GetOrdersByUsuario = async (req, res) => {
  try {
    const { estado, usuario } = req.query; // Obteniendo el estado desde query params si existe
    const tokenSinFormatear = req.headers['authorization'];
    const decoded = jwt.verify(tokenSinFormatear.split(' ')[1], process.env.secretKey);


    let whereClause = {};
    whereClause.responsable = decoded.userId;

    if (estado) {
      const estadosValidos = ["pendiente", "realizada"];
      if (!estadosValidos.includes(estado.toLowerCase())) {
        return res.status(400).json({ error: "Estado inválido" });
      }
      // Añadir condición al whereClause si se pasa un estado
      whereClause.estado = estado.toLowerCase();
    }
    const ordenes = await OrdenT.findAll({
      where: whereClause,
      attributes: ["id", "titulo", "cliente", "estado", "aprobado", "archivo", "idequipo", "tipo_servicio", "tipo_equipo"],
    });
    if (ordenes.length > 0) {
      res.status(200).json(ordenes);
    } else {
      res
        .status(404)
        .json({
          error: estado
            ? `No se encontraron órdenes con estado ${estado}`
            : "No se encontraron órdenes",
        });
    }
  } catch (error) {
    res
      .status(400)
      .json({
        error: "Error al obtener las órdenes de trabajo: " + error.message,
      });
  }
};

const GetOrderForId = async (req, res) => {
  try {
    const { id } = req.query; // Cambiado para obtener el ID desde query params

    if (!id) {
      return res.status(400).json({ error: "ID es requerido" });
    }

    const orden = await OrdenT.findByPk(id, {
      attributes: ["id", "titulo", "cliente", "estado", "aprobado"],
    });

    if (orden) {
      res.status(200).json(orden);
    } else {
      res.status(404).json({ error: "Orden de trabajo no encontrada" });
    }
  } catch (error) {
    res
      .status(400)
      .json({
        error: "Error al obtener la orden de trabajo: " + error.message,
      });

  };
}

const UpdateOders = async (req, res) => {
  try {
    // Extraer y parsear el ID
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {

      return res.status(400).json({ error: 'ID inválido' });
    }

    const data = req.body;

    // Buscar la orden por ID
    const order = await OrdenT.buscarPorId_ot(id);
    if (!order) {

      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Llamar a actualizarDatos con los datos recibidos
    await order.actualizarDatos(data);

    // Obtener la orden actualizada
    const updatedOrder = await OrdenT.buscarPorId_ot(id);


    // Enviar respuesta de éxito
    res.status(200).json({ message: 'Actualización exitosa', data: updatedOrder });
  } catch (error) {
    console.error('Error en la función UpdateOders:', error);
    res.status(500).json({ error: "Error al actualizar la orden: " + error.message });
  }
};





const DeleteOrders = async (req, res) => {
  try {
    const { id } = req.params; // Suponiendo que el nombre del parámetro se pasa como un parámetro de URL

    const result = await updateModel.deleteModel(OrdenT, { id });

    if (result.status === 200) {
      res.status(result.status).json({ message: result.message });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error al eliminar la orden" });
  }

}


const ListColumn = async (req, res) => {
  try {
    const filteredObject = Object.keys(OrdenT.getAttributes());
    const listacolumnas = filteredObject.filter(item => item !== 'archivo');
    res.status(200).json({ listacolumnas });
  } catch (error) {
    res.status(400).json({
      error: "error" + error.message,
    });
  }
};
const ListOrders = async (req, res) => {
  try {
    const ordenesTrabajo = await OrdenT.findAll();
    const elementoEncontrado = ordenesTrabajo.map(e => {
      let primerOrden = e.toJSON();
      let { archivo, ...objetoFiltrado } = primerOrden;
      return objetoFiltrado;
    })
    res.status(200).json({ mensaje: "OrdenesTrabajo", elementoEncontrado });
  } catch (error) {
    res.status(400).json({
      error: "Error al devolver la lista Ordenes de trabajo: " + error.message,
    });
  }
};

const DownloadFile = async (req, res) => {
  let id = null; // Declara `id` fuera del bloque `try` para que esté disponible en el bloque `catch`
  try {
    id = req.query.id; // Recupera el ID desde los parámetros de consulta


    // Verifica si el ID está presente en la solicitud
    if (!id) {

      return res.status(400).send('Falta el parámetro ID');
    }

    // Encuentra la orden en la base de datos
    const orden = await OrdenT.findByPk(id);
    if (!orden) {

      return res.status(404).send('Orden no encontrada');
    }


    // Asegúrate de que el archivo existe
    if (!orden.archivo) {

      return res.status(404).send('Archivo no encontrado');
    }

    // Crea un buffer a partir del archivo binario almacenado
    const archivoBuffer = Buffer.from(orden.archivo);


    // Configura la respuesta para la descarga del archivo
    res.setHeader('Content-Disposition', 'attachment; filename="archivo.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(archivoBuffer);

  } catch (error) {
    console.error(`[ERROR] Error al descargar el archivo para la orden con ID: ${id}`, error);
    res.status(500).send('Error al descargar el archivo');
  }
};

const TableOrder = async (req, res) => {
  try {
    const columnArray = Object.keys(OrdenT.getAttributes());
    const elementsArray = await OrdenT.findAll();
    res.status(200).json({ columnArray, elementsArray });
  } catch {
    res.status(400).json({
      error: "error" + error.message,
    });
  }
};

const FetchTango = async (req, res) => { 
  try {
    const {ideEquipo,ideCp} = req.params;
    const pool = getPool(); // Obtén el pool
    const result = await pool.request().query(`SELECT d_val_ref, d_lim_inf, d_lim_sup, d_tol_inf, d_tol_sup, porc_lim_inf FROM ${process.env.VIEWNAME} WHERE cod_per_cp = '${ideEquipo}' AND id_atr_cp = '${ideCp}'`);
    res.status(200).json({message:result}) 
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  CreateOrder,
  GetOrders,
  GetOrderForId,
  UpdateOders,
  DeleteOrders,
  ListColumn,
  ListOrders,
  DownloadFile,
  TableOrder,
  GetOrdersByUsuario,
  FetchTango
};