const StageParams = require('../Models/ParamsStagesModel')
const TypeSystem = require('../Models/SystemTypeModel')
const OrdenTLoaded = require('../Models/OrderTLoadedModel');
const OrdenT = require('../Models/OrdenTModel');
const Param = require('../Models/ParamsModel')
const Unit = require('../Models/UnidadDeMedidaModel')
const updateModel = require('../Utils/ModelsUtils');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logoPath = path.join(__dirname, '../logoDefinitivo.webp');
const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });






const CrateLoadedOrders = async (req, res) => {
  try {
    const data = req.body;

    const result = await updateModel.createModel(OrdenTLoaded, data);

    if (result.status === 201) {
      res.status(result.status).json({ message: result.message, data: result.data });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      // Handle validation errors specific to Sequelize
      res.status(422).json({ error: 'Validation error: ' + error.message });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      // Handle unique constraint errors
      res.status(409).json({ error: 'Unique constraint error: ' + error.message });
    } else if (error.name === 'SequelizeDatabaseError') {
      // Handle general database errors
      res.status(500).json({ error: 'Database error: ' + error.message });
    } else {
      // Handle generic errors
      res.status(500).json({ error: 'Unexpected error: ' + error.message });
    }
  }
};


const DeleteLoadedOrders = async (req, res) => {
  try {
    const { id_ot } = req.params; // Obtener el ID del parámetro de la URL

    // Asumiendo que updateModel.deleteModel acepta un ID en lugar de un objeto
    const result = await updateModel.deleteModel(OrdenTLoaded, { id_ot });

    if (result.status === 200) {
      res.status(result.status).json({ message: result.message });
    } else {
      res.status(result.status).json({ error: result.message });
    }
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    if (error.name === 'CastError') {
      // Manejar errores de tipo de ID no válido
      res.status(400).json({ error: 'ID no válido: ' + error.message });
    } else if (error.name === 'NotFoundError') {
      // Manejar el caso en que la orden no se encuentra
      res.status(404).json({ error: 'Orden no encontrada' });
    } else {
      // Manejar errores genéricos
      res.status(500).json({ error: 'Error inesperado: ' + error.message });
    }
  }
};

const UpdateLoadedOrders = async (req, res) => {
  try {
    const data = req.body;

    const datosEnviados = data.datosEnviados;
    const datosGenerales = data.datosGenerales;

    const combinedData = datosEnviados.map(item => ({
      ...item, // Copiar todos los campos de datosEnviados
      observaciones_generales: datosGenerales.observaciones_generales
    }));
    // Verifica si data es un arreglo y tiene al menos un elemento
    if (!Array.isArray(combinedData) || combinedData.length === 0) {
      console.error("Los datos recibidos no son válidos.");
      return res.status(400).json({ error: 'Los datos deben ser un arreglo no vacío' });
    }

    // Extrae el primer elemento del arreglo
    const firstElement = combinedData[0];

    // Extrae id_ot del primer elemento
    const { id_ot } = firstElement;

    if (id_ot === undefined) {
      console.error("id_ot es undefined en el primer elemento.");
      return res.status(400).json({ error: 'id_ot es requerido en el cuerpo de la solicitud' });
    }

    // Busca la orden correspondiente
    const orderTLoaded = await OrdenTLoaded.buscarPorIdOt(id_ot);
    if (!orderTLoaded) {
      console.error(`OrderTLoadedModel no encontrado para id_ot: ${id_ot}`);
      return res.status(404).json({ error: 'OrderTLoadedModel no encontrado' });
    }

    // Llama a actualizarDatos con los datos recibidos
    await orderTLoaded.actualizarDatos(firstElement);

    // Generar el nuevo PDF usando HTML
    const html = generateHTML(combinedData, datosGenerales);
    const pdfBuffer = await CreatePDF(html);

    // Actualizar la orden con el nuevo archivo PDF
    const updateResult = await OrdenT.update(
      { archivo: pdfBuffer, firma: datosGenerales.firma },
      { where: { id: id_ot } } // Condición de actualización
    );

    // Verifica si la actualización fue exitosa
    if (updateResult[0] === 0) {
      console.error(`No se pudo actualizar la orden con id_ot: ${id_ot}`);
      return res.status(404).json({ error: 'No se encontró la orden para actualizar' });
    }

    // Busca la orden actualizada
    const updatedOrderT = await OrdenTLoaded.buscarPorIdOt(id_ot);

    // Envía la respuesta exitosa
    res.status(200).json({ message: 'Actualización exitosa', data: updatedOrderT });
  } catch (error) {
    console.error("Error en la función UpdateLoadedOrders:", error.message);
    console.error("Stack trace:", error.stack);

    if (error.name === 'SequelizeValidationError') {
      // Manejar errores de validación de Sequelize
      res.status(422).json({ error: 'Error de validación: ' + error.message });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      // Manejar errores de restricción única
      res.status(409).json({ error: 'Conflicto en la base de datos: ' + error.message });
    } else if (error instanceof Error) {
      // Manejar errores genéricos
      res.status(500).json({ error: 'Error inesperado: ' + error.message });
    } else {
      res.status(500).json({ error: 'Error inesperado: ' + error });
    }
  }
};


const ListColumn = async (req, res) => {
  try {
    const listacolumnas = Object.keys(OrdenTLoaded.getAttributes());
    res.status(200).json({ listacolumnas });
  } catch (error) {
    console.error("Error en la función ListColumn:", error.message);
    console.error("Stack trace:", error.stack);

    // Manejo de errores más específico
    if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ error: 'Error de base de datos: ' + error.message });
    } else {
      res.status(500).json({ error: 'Error inesperado: ' + error.message });
    }
  }
};


const ListLoadedOrders = async (req, res) => {
  try {
    const elementosEncontrado = await OrdenTLoaded.findAll();
    res.status(200).json({ mensaje: "Ordenes de Trabajo", elementosEncontrado });
  } catch (error) {
    console.error("Error en la función ListLoadedOrders:", error.message);
    console.error("Stack trace:", error.stack);

    // Manejo de errores más específico
    if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ error: 'Error de base de datos: ' + error.message });
    } else if (error.name === 'SequelizeConnectionError') {
      res.status(503).json({ error: 'Error de conexión a la base de datos: ' + error.message });
    } else {
      res.status(500).json({ error: 'Error inesperado: ' + error.message });
    }
  }
};


const SendAutoMail = async (destinatario, pdfBuffer) => {
  try {
    // Configuración del transportador
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const generateHtml = (cid) => {
      return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .container {
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            padding: 30px;
                            max-width: 600px;
                            margin: auto;
                        }
                        h1 {
                            color: #004080;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        p {
                            line-height: 1.6;
                            color: #333;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 0.9em;
                            color: #777;
                        }
              
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Orden de Trabajo</h1>
                        <p>Estimado/a Cliente,</p>
                        <p>Adjunto encontrarás la orden de trabajo en formato PDF. Si tienes alguna duda o necesitas más información, no dudes en contactarnos.</p>
                        <p>Saludos cordiales,</p>
                        <div class="footer">
                            <p><strong>DMD Compresores</strong></p>
                            <p>Teléfono: 1159380570</p>
                            <p>Email: info@dmdcompresores.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
    };
    // Configurar el correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: 'Orden de Trabajo',
      html: generateHtml('logo@dmdcompresores.com'),
      attachments: [
        {
          filename: 'orden_trabajo.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);


  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};




const ReceiveParamsandCreateLoadedOrders = async (req, res) => {
  try {
    const data = req.body;
    const datosEnviados = data.datosEnviados;
    const datosGenerales = data.datosGenerales;

    const combinedData = datosEnviados.map(item => ({
      ...item, // Copiar todos los campos de datosEnviados
      observaciones_generales: datosGenerales.observaciones_generales
    }));
    // Insertar los datos en la base de datos
    const result = await OrdenTLoaded.bulkCreate(combinedData);

    if (result) {
      const modificarOt = await updateModel.updateModel(
        OrdenT,
        { id: datosGenerales.id_ot || datosEnviados[0].id_ot },
        { estado: 'realizada' }
      );

      // Obtener los nombres de los sistemas asociados a los ids de `sistema_parametro`
      const sistemaIds = datosEnviados.map(item => item.sistema_parametro);
      const sistemas = await TypeSystem.findAll({
        where: { id_tipo_de_sistema: sistemaIds },
        attributes: ['id_tipo_de_sistema', 'nombre_tipo_de_sistema'],
      });

      // Crear un mapa de ID a nombre de sistema
      const sistemasMap = sistemas.reduce((acc, sistema) => {
        acc[sistema.id_tipo_de_sistema] = sistema.nombre_tipo_de_sistema;
        return acc;
      }, {});

      // Reemplazar los IDs con los nombres en el array `datosEnviados`
      const dataWithSystemNames = datosEnviados.map(item => ({
        ...item,
        sistema_parametro: sistemasMap[item.sistema_parametro] || 'Sistema desconocido'
      }));

      // Generar el PDF usando HTML con los nombres de los sistemas
      const html = generateHTML(dataWithSystemNames, datosGenerales);
      const pdfBuffer = await CreatePDF(html);

      // Actualizar la orden con el archivo PDF
      await OrdenT.update(
        { archivo: pdfBuffer, firma: datosGenerales.firma }, // Almacena directamente los bytes del PDF
        { where: { id: datosGenerales.id_ot || datosEnviados[0].id_ot } },
      );

      res.status(200).json({
        msg: 'Datos insertados y actualizados correctamente, incluyendo el PDF',
        modificarOt
      });

      await SendAutoMail(datosGenerales.mail, pdfBuffer);

    } else {
      res.status(400).json({ error: 'Error, información no actualizada' });
    }

  } catch (error) {
    // Manejo de errores específicos
    if (error.name === 'SequelizeValidationError') {
      res.status(422).json({ error: 'Error de validación: ' + error.message });
    } else if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ error: 'Error de base de datos: ' + error.message });
    } else {
      res.status(500).json({ error: 'Error inesperado: ' + error.message });
    }
  }
};

const generateHTML = (data, datosGenerales) => {
  // Agrupar los datos por etapa y luego por sistema
  const groupedByStageAndSystem = data.reduce((acc, item) => {
    const stage = item.nombre_etapa_de_parametro || 'Etapa desconocida';
    const system = item.sistema_parametro || 'Sistema desconocido';

    if (!acc[stage]) {
      acc[stage] = {};
    }

    if (!acc[stage][system]) {
      acc[stage][system] = [];
    }

    acc[stage][system].push(item);
    return acc;
  }, {});

  // Obtener las observaciones generales
  const observacionesGenerales = datosGenerales.observaciones_generales || 'No definidas';

  // Generar el HTML ordenado por etapa y sistema
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalles de Parámetros</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
          background-color: #fff;
        }
        h1 {
          color: #333;
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        h2 {
          font-size: 20px;
          color: #555;
          margin-top: 20px;
        }
        h3 {
          font-size: 18px;
          color: #007BFF;
        }
        .logo {
        position: absolute;
        top: 20px;
        right: 20px;
        }
        .parameter {
          margin: 15px 0;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .parameter p {
          margin: 5px 0;
          font-size: 14px;
        }
        .observaciones-generales {
          margin-top: 30px;
          padding: 15px;
          background-color: #f4f4f4;
          border: 1px solid #ddd;
        }
        .signature {
          margin-top: 20px;
          text-align: center;
        }
        .signature img {
          max-width: 200px;
          height: auto;
        }
          .logo{
          position:absolute;
          top:0px;
          right:0px;
          }
      </style>
    </head>
    <body>
      <img src="data:image/webp;base64,${logoBase64}" alt="Logo de la empresa" class="logo" style="max-width: 100px;">
      <h1><u>Orden de Trabajo</u></h1>
      ${Object.keys(groupedByStageAndSystem).map(stage => `
        <h2>${stage}</h2>
        ${Object.keys(groupedByStageAndSystem[stage]).map(system => {
    const items = groupedByStageAndSystem[stage][system];
    const systemObservations = items.map(item => item.observaciones).find(obs => obs) || 'No definidas';

    return `
          <div class="parameter">
            <h3><u>${system}</u></h3>
            ${items.map(item => `
        
              <h4>${item.nombre_parametro} (${item.id_param})</h4>
              <p><strong>Valor:</strong> ${item.valor_cargado}</p>
          
            `).join('')}
            <div class="observaciones-generales">
              <strong>Observaciones ${system}:</strong> ${systemObservations}
            </div>
          </div>
          `;
  }).join('')}
    <hr>
      `).join('')}
      
      <div class="observaciones-generales">
        <strong>Observaciones generales:</strong> ${observacionesGenerales}
      </div>

      <!-- Firma reconstruida al final del documento -->
      <div class="signature">
        <p><strong>Firma:</strong></p>
        <img src="${datosGenerales.firma}" alt="Firma">
      </div>
    </body>
    </html>
  `;
};


const CreatePDF = async (html) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // Ejecutar en modo headless
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      timeout: 0,
    });

    const page = await browser.newPage();

    // Configurar el contenido HTML
    await page.setContent(html, {
      waitUntil: 'networkidle2', // Esperar hasta que no haya más conexiones de red abiertas
    });

    // Aplicar estilos adicionales para prevenir el corte de elementos entre páginas
    await page.addStyleTag({
      content: `
        @media print {
          .parameter {
            page-break-inside: avoid; /* Evita que los elementos se dividan entre páginas */
          }
        }
      `,
    });

    // Generar el PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      printBackground: true, // Incluye los fondos en la impresión
    });

    return Buffer.from(pdfBuffer); // Almacena el PDF como buffer
  } catch (error) {
    console.error('Error al crear el PDF:', error);
    throw new Error(`Error al crear el PDF: ${error.message}\nStack: ${error.stack}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};






const TableOtCargadas = async (req, res) => {
  try {
    const columnArray = Object.keys(OrdenTLoaded.getAttributes());
    const elementsArray = await OrdenTLoaded.findAll();

    // Respuesta exitosa
    res.status(200).json({ columnArray, elementsArray });
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener datos:", error); // Registro del error en el servidor
    res.status(500).json({
      error: "Error al obtener los datos. Por favor, intenta nuevamente más tarde.",
      details: error.message, // Opcional: incluye detalles del error
    });
  }
};

const ListLoadedOrdersByIdot = async (req, res) => {
  try {
    const { idot } = req.params;

    if (!idot) {
      return res.status(400).json({ mensaje: "Error, se debe pasar el idot" });
    }

    // Obtener las órdenes cargadas por id_ot
    const ordenesCargadas = await OrdenTLoaded.findAll({
      where: { id_ot: idot },
      attributes: {
        exclude: ['id_ot_param_valor'],
        include: ['observaciones', 'observaciones_generales'],
      },
    });

    if (!ordenesCargadas || ordenesCargadas.length === 0) {
      return res.status(404).json({ mensaje: "Error, ese idot no existe" });
    }

    // Obtener la firma asociada a la id_ot
    const firma = await OrdenT.findOne({
      where: { id: idot },
      attributes: ['firma'], // Suponiendo que el campo se llama 'firma'
    });

    // Obtener los id_parametro de las órdenes cargadas
    const idsParametros = ordenesCargadas.map(orden => orden.id_param).filter(Boolean);

    // Obtener los parámetros correspondientes (incluyendo la 'etapa' y 'sistema')
    const parametros = await Param.findAll({
      where: { id_parametro: idsParametros },
      attributes: ['id_parametro', 'nombre_parametro', 'tipo_dato', 'unidad_medida', 'etapa', 'sistema_parametro'],
    });

    // Obtener los IDs únicos de las unidades de medida, etapas y sistemas
    const idsUnidadesDeMedida = [...new Set(parametros.map(param => param.unidad_medida).filter(Boolean))];
    const idsEtapas = [...new Set(parametros.map(param => param.etapa).filter(Boolean))];
    const idsSistemas = [...new Set(parametros.map(param => param.sistema_parametro).filter(Boolean))];

    // Obtener todas las entidades en una sola operación si hay datos
    const [unidadesDeMedida, etapas, sistemas] = await Promise.all([
      idsUnidadesDeMedida.length > 0 ? Unit.findAll({
        where: { id_unidad_de_medida: idsUnidadesDeMedida },
        attributes: ['id_unidad_de_medida', 'nombre_unidad_de_medida'],
      }) : [],
      idsEtapas.length > 0 ? StageParams.findAll({
        where: { id_etapa_de_parametro: idsEtapas },
        attributes: ['id_etapa_de_parametro', 'nombre_etapa_de_parametro'],
      }) : [],
      idsSistemas.length > 0 ? TypeSystem.findAll({
        where: { id_tipo_de_sistema: idsSistemas },
        attributes: ['id_tipo_de_sistema', 'nombre_tipo_de_sistema'],
      }) : [],
    ]);

    // Crear mapeos rápidos de unidades, etapas y sistemas
    const unidadesDeMedidaMap = Object.fromEntries(unidadesDeMedida.map(u => [u.id_unidad_de_medida, u.nombre_unidad_de_medida]));
    const etapasMap = Object.fromEntries(etapas.map(e => [e.id_etapa_de_parametro, e.nombre_etapa_de_parametro]));
    const sistemasMap = Object.fromEntries(sistemas.map(s => [s.id_tipo_de_sistema, s.nombre_tipo_de_sistema]));

    // Crear mapeos de parámetros
    const parametrosMap = parametros.reduce((map, param) => {
      map[param.id_parametro] = {
        nombre_parametro: param.nombre_parametro,
        tipo_dato: param.tipo_dato,
        unidad_medida: unidadesDeMedidaMap[param.unidad_medida] || null,
        nombre_etapa: etapasMap[param.etapa] || null,
        tipo_sistema: sistemasMap[param.sistema_parametro] || null,
      };
      return map;
    }, {});

    // Agregar información adicional a las órdenes cargadas
    const ordenesConNombresYTipo = ordenesCargadas.map(orden => {
      const paramData = parametrosMap[orden.id_param] || {};
      return {
        ...orden.dataValues,
        nombre_parametro: paramData.nombre_parametro || null,
        tipo_dato: paramData.tipo_dato || null,
        nombre_unidad_de_medida: paramData.unidad_medida || null,
        nombre_etapa_de_parametro: paramData.nombre_etapa || null,
        tipo_sistema: paramData.tipo_sistema || null,
      };
    });

    return res.status(200).json({
      mensaje: "OrdenesTrabajo",
      ordenesCargadas: ordenesConNombresYTipo,
      firma: firma ? firma.firma : null // Incluyendo la firma en la respuesta
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al devolver la lista de Ordenes de trabajo Cargadas por id: " + error.message,
    });
  }
};



module.exports = {
  CrateLoadedOrders,
  DeleteLoadedOrders,
  UpdateLoadedOrders,
  ListColumn,
  ListLoadedOrders,
  ReceiveParamsandCreateLoadedOrders,
  TableOtCargadas,
  ListLoadedOrdersByIdot,
  CreatePDF
};







