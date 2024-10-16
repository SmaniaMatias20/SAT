import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAxiosInstance } from "../../../axiosInstance";
import CustomToast from '../CustomToast';
import { useToast } from '../../../hooks/use-toast';
import SignatureCanvas from "react-signature-canvas";
import { LoadingSpinner } from "../Spinner";

function FormParametros() {
  const [parametros, setParametros] = useState([]);
  const [valores, setValores] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [formSent, setFormSent] = useState(false); // Nuevo estado para controlar la visibilidad del formulario
  const { toast, showToast } = useToast();
  const [signature, setSignature] = useState(''); // Nuevo estado para la firma
  const signatureRef = useRef(); // Ref para el canvas de la firma

  const { id, estado, idequipo } = useParams();
  const location = useLocation();
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  const { formData } = location.state || {};

  useEffect(() => {
    if (formData) {
      const dataToProcess = formData.ordenesCargadas || formData.data;
      const firma = formData.firma;

      if (dataToProcess) {
        setParametros(dataToProcess);

        const initialValues = {};
        dataToProcess.forEach(field => {
          initialValues[field.nombre_parametro] = field.valor_cargado;
          initialValues[`observacion-${field.nombre_etapa_de_parametro}`] = field.observaciones || '';
          initialValues['observacion-Generales'] = field.observaciones_generales || '';
          initialValues['firma'] = firma ;
        });
        setValores(initialValues);
        setIsSendButtonDisabled(false);

        // Cargar la firma en el canvas
      if (firma) {
        signatureRef.current.fromDataURL(firma); // Carga la firma desde el base64
      }
      }
    }
  }, [formData]);
  const handleInputChange = (e, id, tipo_dato) => {
    let { value, checked } = e.target;

    if (tipo_dato === 'bool') {
      // Actualiza el estado local primero
      setValores((prevValues) => {
        const currentValues = prevValues[id] ? prevValues[id].split(', ') : [];

        if (checked) {
          // Agregar opción
          currentValues.push(value);
        } else {
          // Eliminar opción
          const index = currentValues.indexOf(value);
          if (index > -1) {
            currentValues.splice(index, 1);
          }
        }

        const newValue = currentValues.join(', '); // Generar el nuevo valor como string

        // Retorna el nuevo estado sin llamar a setValue aquí
        return {
          ...prevValues,
          [id]: newValue,
        };
      });

      // Usa setTimeout para evitar el warning
      setTimeout(() => {
        setValue(id, valores[id] ? valores[id].split(', ').join(', ') : value);
      }, 0);
    } else {
      const newValue = value.toString();
      setValores((prevValues) => ({
        ...prevValues,
        [id]: newValue,
      }));
      setValue(id, newValue); // Actualiza el valor en el formulario
    }
  };



  const handleSignature = () => {
    setSignature(signatureRef.current.getTrimmedCanvas().toDataURL('image/png')); // Captura la firma como base64
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
  });

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  const onSubmit = async () => {
    showToast('Formulario enviado exitosamente.', 'success', { duration: 2000 });

    // Separamos firma, mail y observaciones generales en un objeto independiente
    const datosGenerales = {
      observaciones_generales: valores[`observacion-Generales`] || '',
      firma: signature,
      mail: valores[`mail`] || '',
    };
    
    // Mantenemos el resto de los parámetros en un array sin duplicar los datos generales
    const datosEnviados = parametros.map((field) => ({
      id_ot: parseInt(id, 10) || 1,
      id_param: field.id_param,
      nombre_parametro: field.nombre_parametro,
      nombre_etapa_de_parametro: field.nombre_etapa_de_parametro,
      nombre_unidad_de_medida: field.nombre_unidad_de_medida,
      tipo_dato: field.tipo_dato,
      valor_cargado: Array.isArray(valores[field.nombre_parametro]) ? valores[field.nombre_parametro].join(', ') : valores[field.nombre_parametro] || '',
      idequipo: idequipo,
      observaciones: valores[`observacion-${field.nombre_etapa_de_parametro}`] || '',
      tiempo_transcurrido: formatTime(timeElapsed),
      sistema_parametro: field.sistema_parametro,
    }));
    
    // Creación del payload donde solo se envían los datosGenerales una vez
    const payload = {
      datosEnviados,
      datosGenerales
    };
    
    

console.log(payload)
    try {
      setIsLoading(true);
      let response;

      if (estado === "pendiente") {
        response = await axiosInstance.post("/ordenesCargadas/receiveAndCreateOrder", payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else if (estado === "realizada") {
        response = await axiosInstance.post("/ordenesCargadas/modificar", payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 200) {
        reset();
        setParametros([]);
        setValores({});
        setIsSendButtonDisabled(true);
        setFormSent(true); // Se marca el formulario como enviado
        showToast('Formulario enviado exitosamente.', 'success', { duration: 2000 });
        setTimeout(() => {
          navigate("/OTasignUsers");
        }, 400);
      } else {
        showToast('No se pudo enviar el formulario.', 'error');
      }
    } catch (error) {
      if (error.response) {
        console.log(error)
        const errorMessage = error.response.data?.message || 'Error en el servidor';
        showToast(`Error ${error.response.status}: ${errorMessage}`);
      } else {
        showToast(`${error}, 'error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const groupedParametros = parametros.reduce((acc, field) => {
    if (!acc[field.nombre_etapa_de_parametro]) {
      acc[field.nombre_etapa_de_parametro] = [];
    }
    acc[field.nombre_etapa_de_parametro].push(field);
    return acc;
  }, {});

  return (
    <div className="flex items-center justify-center p-8 bg-gray-100 min-h-screen">
      <CustomToast message={toast.message} type={toast.type} />

      {!formSent ? ( // Verifica si el formulario ha sido enviado para mostrar u ocultar el formulario
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg space-y-6 w-full max-w-lg">
          {Object.keys(groupedParametros).map((etapa) => (
            <div key={etapa}>
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
                {etapa}
              </h2>
              {groupedParametros[etapa].map((field) => (
                <div key={field.nombre_parametro} className="mb-6">
                  <Label
                    htmlFor={field.nombre_parametro}
                    className="block text-sm font-medium text-gray-600 mb-2 text-center"
                  >
                    {field.nombre_parametro}: *
                  </Label>
                  <Controller
                    name={field.nombre_parametro}
                    control={control}
                    rules={{ required: `${field.nombre_parametro} es obligatorio` }}
                    render={({ field: inputField }) => {
                      if (field.tipo_dato === 'num') {
                        return (
                          <div className="relative">
                            <Input
                              id={field.nombre_parametro}
                              type="number"
                              className="mt-1 p-3 pr-16 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
                              {...inputField}
                              value={valores[field.nombre_parametro] || ''}
                              onChange={(e) => handleInputChange(e, field.nombre_parametro, 'num')}
                            />
                            {field.nombre_unidad_de_medida && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                {field.nombre_unidad_de_medida}
                              </span>
                            )}
                          </div>
                        );
                      } else if (field.tipo_dato === 'string') {
                        return (
                          <Input
                            id={field.nombre_parametro}
                            type="text"
                            className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
                            {...inputField}
                            value={valores[field.nombre_parametro] || ''}
                            onChange={(e) => handleInputChange(e, field.nombre_parametro, 'string')}
                          />
                        );
                      } else if (field.tipo_dato === 'bool') {
                        const boolOptions = [
                          "Reparar",
                          "Reemplazar parte",
                          "Daño superficial",
                          "Ok"
                        ];
                        return (
                          <div className="mt-2">
                            {boolOptions.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${field.nombre_parametro}-${option}`}
                                  name={field.nombre_parametro}
                                  value={option}
                                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition"
                                  checked={valores[field.nombre_parametro]?.includes(option) || false}
                                  onChange={(e) => handleInputChange(e, field.nombre_parametro, 'bool')}
                                />
                                <Label htmlFor={`${field.nombre_parametro}-${option}`} className="text-sm font-medium text-gray-700">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        );
                      }
                    }}
                  />
                  {errors[field.nombre_parametro] && (
                    <span className="text-red-600 text-sm">{errors[field.nombre_parametro].message}</span>
                  )}
                </div>
              ))}

              <div className="mt-6">
                <Label
                  htmlFor={`observacion-${etapa}`}
                  className="block text-sm font-medium text-gray-600 mb-2 text-center"
                >
                  Observaciones {etapa}:
                </Label>
                <Input
                  id={`observacion-${etapa}`}
                  type="text"
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={valores[`observacion-${etapa}`] || ''}
                  onChange={(e) => handleInputChange(e, `observacion-${etapa}`, 'string')}
                />
              </div>
            </div>
          ))}
          <hr className="my-5 border-0 h-0.5 bg-black shadow-lg" />
          <div className="mt-6">
            <Label
              htmlFor="observacion-Generales"
              className="block text-sm font-medium text-gray-600 mb-2 text-center"
            >
              Observaciones Generales:
            </Label>
            <Input
              id="observacion-Generales"
              type="text"
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={valores['observacion-Generales'] || ''}
              onChange={(e) => handleInputChange(e, 'observacion-Generales', 'string')}
            />
            <Label
              htmlFor="mail"
              className="block text-sm font-medium text-gray-600 mb-2 text-center"
            >
              Mail:
            </Label>
            <Input
              id="mail"
              type="mail"
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={valores['mail'] || ''}
              onChange={(e) => handleInputChange(e, 'mail', 'string')}
            />
          </div>

          {/* Sección para dibujar la firma */}
          <div className="mb-6">
            <Label
              htmlFor="firma"
              className="block text-sm font-medium text-gray-600 mb-2 text-center"
            >
              Firma del Funcionario:
            </Label>
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                className: "border border-gray-300 rounded-lg w-full h-40 md:h-52", // Ajuste del tamaño
                width: 400,
                height: 200,
              }}
              onEnd={handleSignature} // Captura la firma cuando se termina de dibujar
            />
            <span
              onClick={() => {
                signatureRef.current.clear(); // Limpia el canvas
                setSignature(''); // Resetea el estado de la firma
              }}
              className="mt-2 inline-block text-sm text-sky-900 cursor-pointer hover:underline"
            >
              Limpiar Firma
            </span>
            
          </div>


          <div className="mt-6 flex justify-between items-center">
            <Button
              type="submit"
              className="bg-sky-900 hover:bg-sky-950 text-white p-3 rounded-lg w-full"
              disabled={isSendButtonDisabled || isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
            <p className="text-sm text-gray-500 text-center">{`Tiempo transcurrido: ${formatTime(timeElapsed)}`}</p>
          </div>
        </form>
      ) : (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="150px" className="w-8 h-8 text-blue-600" />
        </div>
      )}
    </div>
  );
}

export default FormParametros;
