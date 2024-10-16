import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/shadcn/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, } from "@/components/shadcn/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../shadcn/select";
import { useState } from "react";
import { useAxiosInstance } from '../../../axiosInstance';
import CustomToast from '../CustomToast';
import { useToast } from '../../../hooks/use-toast';
import { TruthTable } from "./TruthTable";
import { z } from "zod";
import { PlusIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { schemaOrders, schemaUsers, schemaParams, hasAtLeastOneTrue, schemaGenerico } from '../../../schemas/validationSchemas';



export default function DropDownMenuTable({ onAdd, onEdit, onDelete, row, entity, fields, labels, hideAddOption, hideEditOption }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ValorEdit, setValorEdit] = useState(null);
  const [id_Etapa_parametro, setIdEliminar] = useState(null);
  const [ruta, setRuta] = useState(null);
  const [dialogDelete, setIsDialogDelete] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(null);
  const [method, setMethod] = useState(false);
  const [nombreGenerico, setNombreGenerico] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const filteredFields = fields.filter((field) => field !== "id" && field !== "fecha_subida" && field !== "id_parametro" &&
    field !== "estado" && field !== "aprobado" && field !== "date" && field !== "fecha" && field !== "archivo" && field !== "firma");
  const [editData, setEditData] = useState(filteredFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
  const [newEntityData, setNewEntityData] = useState(filteredFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
  const axiosInstance = useAxiosInstance();
  const { toast, showToast } = useToast();
  const [responsibleOptions, setResponsibleOptions] = useState([]);
  const [referencia, setReferencia] = useState([]);
  const [serviceOptions, setTipoServicioOptions] = useState([]);
  const [equipoOptions, setTipoEquipoOptions] = useState([]);
  const [sistemaOptions, setTipoSistemaOptions] = useState([]);
  const [unidadMedidaOptions, setTipoUnidadMedidaOptions] = useState([]);
  const [stagesOptions, setStagesOptions] = useState([]);
  const [truthTable, setTruthTable] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' }); // Define el estado inicial
  const [validationMessage, setValidationMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleDataSubmit = (data) => {
    // Crea un nuevo objeto para newEntityData
    const parameterData = {
      nombre_parametro: newEntityData.nombre_parametro,
      tipo_dato: newEntityData.tipo_dato,
      unidad_medida: newEntityData.unidad_medida,
      sistema_parametro: newEntityData.sistema_parametro,
      etapa: newEntityData.etapa
    };

    // Combina parameterData con los datos de la tabla de verdad
    const combinedData = [parameterData, ...data];

    setTruthTable(combinedData);
  };


  const handleIconClick = (referencia, ruta, message, obj, event) => {
    setReferencia(() => referencia);
    setIdEliminar(obj.id)
    event.stopPropagation(); // Evitar el cierre al hacer clic en el icono
    setDialogMessage(message)
    setRuta(ruta)
    setIsDialogDelete(true); // Abrir el diálogo de eliminación
  };
  const handleIconClickModificar = (referencia, ruta, message, obj, nombreGenrico, event) => {
    setNombreGenerico(nombreGenrico)
    setReferencia(() => referencia);
    setRuta(ruta)
    formData.name = '';
    setValorEdit(obj ? obj.label : '');
    setIdEliminar(obj ? obj.id : null);
    event.stopPropagation();
    setDialogMessage(message);
    if (obj) {
      setRuta(ruta + obj.id);
      setMethod('put')
    }
    else {
      setMethod('post')
    }
    setIsFormDialogOpen(true);
  }

  // Opciones para el rol
  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'usuario', label: 'Usuario' },
  ];
  const tipoDatoOptions = [
    { value: 'num', label: 'Número' },
    { value: 'string', label: 'Cadena' },
    { value: 'bool', label: 'Booleano' },
  ];


  const fetchData = async (url, setOptions, dataKey, valueKey, labelKey, errorMessage, idKey) => {
    try {
      const response = await axiosInstance.get(url);


      if (response.data && response.data[dataKey]) {
        setOptions(response.data[dataKey].map(item => ({
          value: item[valueKey],
          label: item[labelKey],
          id: item[idKey]
        })));
      }
    } catch (error) {
      console.error(`Error al obtener ${errorMessage}:`, error);
      setIsAddDialogOpen(false);
      showToast(`Error al cargar ${errorMessage}. Inténtalo de nuevo más tarde.`, 'error');
    }
  };

  // Usar la función genérica con las configuraciones específicas
  const fetchResponsibleOptions = () =>
    fetchData('/usuarios/obtenerTecnicos?rol=usuario', setResponsibleOptions, 'usuariosFiltrados', 'usuario', 'usuario', 'los técnicos');

  const fetchTiposDeServicio = () =>
    fetchData('/documentos/obtenerDocumentos', setTipoServicioOptions, 'documentos', 'nombre_documento', 'nombre_documento', 'los tipos de servicio');

  const fetchTiposDeEquipo = () =>
    fetchData('/tiposDeEquipo/obtenerTipoEquipo', setTipoEquipoOptions, 'tiposDeEquipo', 'nombre_tipo_equipo', 'nombre_tipo_equipo', 'los tipos de equipo');

  const fetchTiposDeSistemas = () =>
    fetchData('/tiposDeSistema/obtenerTipoSistema', setTipoSistemaOptions, 'tiposDeSistema', 'nombre_tipo_de_sistema', 'nombre_tipo_de_sistema', 'los tipos de sistemas', 'id_tipo_de_sistema');

  const fetchUnidadesDeMedida = () =>
    fetchData('/tiposDeUnidades/obtenerTipoUnidadesDeMedida', setTipoUnidadMedidaOptions, 'tiposDeUnidades', 'nombre_unidad_de_medida', 'nombre_unidad_de_medida', 'las unidades de medida', 'id_unidad_de_medida');

  const fetchStagesOptions = () =>
    fetchData('/tiposDeStages/obtenerStages', setStagesOptions, 'tiposDeEstadosDeParametro', 'nombre_etapa_de_parametro', 'nombre_etapa_de_parametro', 'las etapas', 'id_etapa_de_parametro');



  const handleEditClick = () => {
    // Configura editData, ocultando 'password' con asteriscos
    const data = filteredFields.reduce((acc, field) => {
      if (field === 'password') {
        // Guardamos la contraseña anterior
        setPasswordSaved(row[field]);
        // Reemplazamos la contraseña con asteriscos
        return { ...acc, [field]: '********' }; // 8 asteriscos, puedes ajustar según la longitud
      }
      return { ...acc, [field]: row[field] }; // Otros campos se agregan normalmente
    }, {});
    // Configura el estado de editData
    setEditData(data);
    setIsEditDialogOpen(true);
    if (entity == 'parametros') {
      fetchTiposDeSistemas();
      fetchUnidadesDeMedida();
      fetchStagesOptions();
    }
    else if (entity == 'ordenes') {
      fetchResponsibleOptions();
      fetchTiposDeServicio();
      fetchTiposDeEquipo();
    }


  };

  const handleAddClick = () => {
    setNewEntityData(filteredFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
    setIsAddDialogOpen(true);
    if (entity == 'ordenes') {

      fetchResponsibleOptions();
      fetchTiposDeServicio();
      fetchTiposDeEquipo();
    }
    else if (entity == 'parametros') {
      fetchTiposDeSistemas();
      fetchUnidadesDeMedida();
      fetchStagesOptions();

    }

  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));

  };

  const handleNewEntityChange = (e) => {
    if (e.target.id == 'usuario') {
      const lowerCaseValue = e.target.value.toLowerCase();
      e.target.value = lowerCaseValue;
    }
    const { name, value } = e.target;
    setNewEntityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    setErrors({}); // Reinicia los errores al intentar guardar

    if (onEdit && row) {
      const id = row.id !== undefined ? row.id : row.id_ot !== undefined ? row.id_ot : row.id_parametro;

      let updatedData = { ...editData, id };
      let combinedData = [updatedData, ...truthTable];

      try {
        if (entity === "parametros") {
          if (!hasAtLeastOneTrue(truthTable)) {
            // Mostrar el mensaje de error al usuario
            setValidationMessage("No se puede guardar, debe elegir por lo menos una relación.");
            return; // No continuar con el envío
          }
          setValidationMessage("");


          schemaParams.parse(updatedData);
          combinedData.splice(1, 1);
          await onEdit(combinedData);
        } else if (entity === "usuarios") {
          schemaUsers.parse(updatedData);
          // Si la contraseña es igual a 8 asteriscos quiere decir que no se modifico 
          if (updatedData.password === "********") {
            // Cargo la contraseña guardada del back
            updatedData.password = passwordSaved;
          }
          updatedData.id = id; // Asegúrate de que el id esté presente en updatedData
          await onEdit(updatedData);
        } else if (entity === "ordenes") {
          schemaOrders.parse(updatedData);
          updatedData.id = id; // Asegúrate de que el id esté presente en updatedData
          await onEdit(updatedData);
        }

        setIsEditDialogOpen(false); // Cierra el diálogo después de guardar
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Mapea los errores a un objeto
          const newErrors = error.errors.reduce((acc, err) => {
            acc[err.path[0]] = err.message; // Usa la propiedad del error como clave
            return acc;
          }, {});

          setErrors(newErrors);
        } else {
          setIsEditDialogOpen(false);
          showToast("Error al modificar", 'error');
        }
      }
    } else {
      showToast("No se pudo identificar la fila o el método de edición", 'error');
    }
  };


  const handleSaveNewEntity = async () => {
    if (onAdd) {
      try {
        // Validate the new entity data using schemaAddParams
        if (entity === "parametros") {
          if (!hasAtLeastOneTrue(truthTable)) {
            // Mostrar el mensaje de error al usuario
            setValidationMessage("No se puede guardar, debe elegir por lo menos una relación.");
            return; // No continuar con el envío
          }
          setValidationMessage("");

          const parameterData = {
            nombre_parametro: newEntityData.nombre_parametro,
            tipo_dato: newEntityData.tipo_dato,
            unidad_medida: newEntityData.unidad_medida,
            sistema_parametro: newEntityData.sistema_parametro,
            etapa: newEntityData.etapa
          };
          let data = [parameterData, ...truthTable.slice(1)];
          setTruthTable(data);
          schemaParams.parse(newEntityData); // Validate parameters
          await onAdd(data);
        } else if (entity === "usuarios") {
          schemaUsers.parse(newEntityData); // Validate users
          await onAdd(newEntityData);
        } else if (entity === "ordenes") {
          schemaOrders.parse(newEntityData);
          await onAdd(newEntityData);
        }
        setIsAddDialogOpen(false); // Close the dialog after adding
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Map errors to an object for display
          const newErrors = error.errors.reduce((acc, err) => {
            acc[err.path[0]] = err.message; // Use error path as key
            return acc;
          }, {});

          setErrors(newErrors); // Display errors in UI
        } else {
          setIsAddDialogOpen(false);
          showToast("Error al guardar", 'error');
        }
      }
    }
  };

  const handleSaveForm = async () => {


    try {
      const formDataToValidate = { nombre_Generico: formData.name };
      schemaGenerico.parse(formDataToValidate)
      // Enviar el FormData usando Axios
      const response = await axiosInstance[method](`${ruta}`, {
        [nombreGenerico]: formData.name
      });
      if (response.data && (response.status == 200 || response.status == 201)) {
        await referencia();
        setErrors({})
        showToast('Se agrego la etapa correctamente !.', 'success');
      }
      setIsFormDialogOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message; // Usa la propiedad del error como clave
          return acc;
        }, {});
        setErrors(newErrors); // Guarda los errores mapeados

        // console.log(newErrors)
      } else {
        // setIsEditDialogOpen(false);
        showToast("Error al modificar", 'error');
      }
      // alert("Error al enviar el formulario. Verifica la consola para detalles.");
    }
  };

  const handleDeleteForm = async () => {
    try {
      const response = await axiosInstance.delete(`${ruta}${id_Etapa_parametro}`);
      showToast('Elemento eliminado exitosamente.', 'success');
      setIsDialogDelete(false);

      if (response.data && response.status == 200) {
        await fetchUnidadesDeMedida();
        showToast('Se eliminó correctamente !.', 'success');
        referencia((prev) => prev.filter((etapa) => etapa.id !== id_Etapa_parametro));
        setIsDialogDelete(false);
      }

    } catch (error) {
      if (error.response.data.error) {
        if (error.response.data.error.includes("foreign key")) {
          showToast('Error, esa etapa está vínculada a un parámetro.', 'error');
        }
      }
      else {
        alert("Error al enviar el formulario. Verifica la consola para detalles.");
      }
    }
  }




  return (
    <>
      <CustomToast message={toast.message} type={toast.type} />


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!hideAddOption && (
            <>
              <DropdownMenuItem onClick={handleAddClick}>Crear nuevo</DropdownMenuItem>
            </>
          )}
          {!hideEditOption && (
            <DropdownMenuItem onClick={handleEditClick}>Modificar</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={`flex flex-col p-2 ${entity === 'parametros' ? 'max-w-3xl max-h-[80vh] overflow-auto' : ''}`}>
          <DialogHeader>
            <DialogTitle>Editar {entity.slice(0, -1).toUpperCase()}</DialogTitle>
            <DialogDescription>
              Modifica los detalles del {entity.slice(0, -1).toLowerCase()}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {filteredFields.map((field, index) => {
              const shouldHideUnidadMedida = field === "unidad_medida" && (editData.tipo_dato === "bool" || editData.tipo_dato === "string");

              // Si se debe ocultar, retorna null
              if (shouldHideUnidadMedida) {
                return null;
              }

              return (
                <div key={index} className="flex flex-col">
                  <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-1">
                    {labels[field] || field}
                  </label>

                  {field === "responsable" ? (
                    <Select
                      name="responsable"
                      value={editData.responsable}
                      onValueChange={(value) => handleEditChange({ target: { name: 'responsable', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{editData.responsable || "Selecciona un responsable"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {responsibleOptions.map((option) => (
                          <SelectItem key={option?.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "rol" ? (
                    <Select
                      name="rol"
                      value={editData.rol}
                      onValueChange={(value) => handleEditChange({ target: { name: 'rol', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{editData.rol || "Selecciona un rol"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role?.value} value={role?.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "tipo_servicio" ? (
                    <Select
                      name="tipo_servicio"
                      value={editData.tipo_servicio}
                      onValueChange={(value) => handleEditChange({ target: { name: 'tipo_servicio', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{editData.tipo_servicio || "Selecciona un tipo de servicio"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option?.value} value={option?.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "tipo_equipo" ? (
                    <Select
                      name="tipo_equipo"
                      value={editData.tipo_equipo}
                      onValueChange={(value) => handleEditChange({ target: { name: 'tipo_equipo', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{editData.tipo_equipo || "Selecciona un tipo de equipo"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {equipoOptions.map((option) => (
                          <SelectItem key={option?.value} value={option?.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "sistema_parametro" ? (
                    <div className="flex items-center justify-between">
                      <Select
                        name="sistema_parametro"
                        value={editData.sistema_parametro}
                        onValueChange={(value) => handleEditChange({ target: { name: 'sistema_parametro', value } })}
                        className="input"
                      >
                        <SelectTrigger>
                          <span>{editData.sistema_parametro || "Selecciona un tipo de sistema"}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {sistemaOptions.map((option) => (
                            <div key={option.value} className="flex items-center justify-between w-full">
                              <SelectItem key={option?.value} value={option?.value}>
                                {option.label}
                              </SelectItem>
                              <div className="flex space-x-2 ml-4">
                                <PencilIcon onMouseDown={(event) => handleIconClickModificar(fetchTiposDeSistemas, '/tiposDeSistema/modificar/', 'Modificar Tipo de Sistema', option, 'nombre_tipo_de_sistema', event)} className="h-6 w-6 text-yellow-500 cursor-pointer" aria-hidden="true" />
                                {/* <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchTiposDeSistemas,'/tiposDeSistema/modificar/','Modificar Tipo de Sistema',option,'nombre_tipo_de_sistema',event)}   className="h-6 w-6 text-blue-500 mr-2"  aria-hidden="true" /> */}
                                <TrashIcon
                                  onMouseDown={(event) => handleIconClick(fetchTiposDeSistemas, '/tiposDeSistema/borrar/', 'Eliminar Tipo de Sistema', option, event)}
                                  className="h-6 w-6 text-red-500 cursor-pointer"
                                  aria-hidden="true"
                                />

                              </div>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchTiposDeSistemas, '/tiposDeSistema/crear/', 'Agregar Tipo de Sistema', null, 'nombre_tipo_de_sistema', event)} className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
                    </div>
                  ) : field === "unidad_medida" ? (
                    <div className="flex items-center justify-between">
                      <Select
                        name="unidad_medida"
                        value={editData.unidad_medida}
                        onValueChange={(value) => handleEditChange({ target: { name: 'unidad_medida', value } })}
                        className="input"
                      >
                        <SelectTrigger>
                          <span>{editData.unidad_medida || "Selecciona un tipo de unidad de medida"}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {unidadMedidaOptions.map((option) => (
                            <div key={option.value} className="flex items-center justify-between w-full"> {/* Contenedor adicional */}
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                              <div className="flex space-x-2 ml-4">
                                <PencilIcon onMouseDown={(event) => handleIconClickModificar(fetchUnidadesDeMedida, '/tiposDeUnidades/modificar/', 'Modificar Unidad de Medida', option, 'nombre_unidad_de_medida', event)} className="h-6 w-6 text-yellow-500 cursor-pointer" aria-hidden="true" />
                                {/* <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchUnidadesDeMedida,'/tiposDeUnidades/modificar/','Modificar Unidad de Medida',null,'nombre_unidad_de_medida', event)}   className="h-6 w-6 text-blue-500 mr-2"  aria-hidden="true" /> */}
                                <TrashIcon
                                  onMouseDown={(event) => handleIconClick(fetchUnidadesDeMedida, '/tiposDeUnidades/borrar/', 'Eliminar Unidad de Medida', option, event)}
                                  className="h-6 w-6 text-red-500 cursor-pointer"
                                  aria-hidden="true"
                                />

                              </div>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchUnidadesDeMedida, '/tiposDeUnidades/crear/', 'Agregar Unidad de Medida', null, 'nombre_unidad_de_medida', event)} className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
                    </div>
                  ) : field === "tipo_dato" ? (
                    <Select
                      name="tipo_dato"
                      value={editData.tipo_dato}
                      onValueChange={(value) => handleEditChange({ target: { name: 'tipo_dato', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{editData.tipo_dato || "Selecciona un tipo de dato"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {tipoDatoOptions.map((option) => (
                          <SelectItem key={option?.value} value={option?.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "etapa" ? (
                    <div className="flex items-center justify-between">
                      <Select
                        name="etapa"
                        value={editData.etapa}
                        onValueChange={(value) => handleEditChange({ target: { name: 'etapa', value } })}
                        className="input"
                      >
                        <SelectTrigger>
                          <span>{editData.etapa || "Selecciona una etapa"}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {stagesOptions.map((etapa) => (
                            <div key={etapa.value} className="flex items-center justify-between w-full"> {/* Contenedor adicional */}
                              <SelectItem value={etapa.value}>
                                <span>{etapa.label}</span>
                              </SelectItem>
                              <div className="flex space-x-2 ml-4">
                                <PencilIcon
                                  onClick={() => { setIsFormDialogOpen(true); setDialogMessage("Modificar Etapa"); }}
                                  onMouseDown={(event) => handleIconClickModificar(fetchStagesOptions, '/tiposDeStages/modificar/', 'Modificar Etapa', etapa, 'nombre_etapa_de_parametro', event)}
                                  className="h-6 w-6 text-yellow-500 cursor-pointer"
                                  aria-hidden="true"
                                />
                                <TrashIcon
                                  onMouseDown={(event) => handleIconClick(fetchStagesOptions, '/tiposDeStages/borrar/', 'Eliminar Etapa', etapa, event)}
                                  className="h-6 w-6 text-red-500 cursor-pointer"
                                  aria-hidden="true"
                                />


                              </div>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchStagesOptions, '/tiposDeStages/crear/', 'Agregar Etapa', null, 'nombre_etapa_de_parametro', event)} className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
                    </div>
                  ) : (
                    <Input
                      id={field}
                      name={field}
                      value={editData[field]}
                      onChange={handleEditChange}
                      placeholder={labels[field] || field}
                      type={field === 'password' ? 'password' : 'text'} // Tipo de entrada dinámic
                    />
                  )}
                  {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                </div>
              );
            })}
            {entity === 'parametros' && (
              <>
                <TruthTable onDataSubmit={handleDataSubmit} id_parametro={row.id_parametro} />
                {validationMessage && (
                  <p className={`text-sm ${validationMessage.includes('No') ? 'text-red-500' : 'text-green-500'} mt-2`}>
                    {validationMessage}
                  </p>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleSaveEdit}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={`flex flex-col p-2 ${entity === 'parametros' && 'max-w-3xl max-h-[80vh] overflow-auto'}`}>
          <DialogHeader>
            <DialogTitle>Agregar {entity.slice(0, -1).toUpperCase()}</DialogTitle>
            <DialogDescription>
              Agrega un nuevo {entity.slice(0, -1).toLowerCase()}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {filteredFields.map((field, index) => {
              // Verifica si el campo es 'unidad_medida' y el tipo_dato es 'bool'
              const shouldHideUnidadMedida = field === "unidad_medida" && (newEntityData.tipo_dato === "bool" || newEntityData.tipo_dato === "string");


              // Si se debe ocultar, retorna null
              if (shouldHideUnidadMedida) {
                return null;
              }

              return (
                <div key={index} className="flex flex-col">
                  <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-1">
                    {labels[field] || field}
                  </label>

                  {field === "nombre_parametro" ? ( // Input para nombre_parametro
                    <Input
                      id="nombre_parametro"
                      name="nombre_parametro"
                      value={newEntityData.nombre_parametro}
                      onChange={handleNewEntityChange}
                      placeholder="Nombre del parámetro"
                      type="text"
                    />

                  ) : field === "responsable" ? (
                    <Select
                      name="responsable"
                      value={newEntityData.responsable}
                      onValueChange={(value) => handleNewEntityChange({ target: { name: 'responsable', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{newEntityData.responsable || "Selecciona un responsable"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {responsibleOptions.map((option) => (
                          <SelectItem key={option?.value} value={option?.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "rol" ? (
                    <Select
                      name="rol"
                      value={newEntityData.rol}
                      onValueChange={(value) => handleNewEntityChange({ target: { name: 'rol', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{newEntityData.rol || "Selecciona un rol"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role?.value} value={role?.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "tipo_servicio" ? (
                    <Select
                      name="tipo_servicio"
                      value={newEntityData.tipo_servicio}
                      onValueChange={(value) => handleNewEntityChange({ target: { name: 'tipo_servicio', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{newEntityData.tipo_servicio || "Selecciona un tipo de servicio"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((option) => (

                          <SelectItem key={option?.value} value={option?.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "tipo_equipo" ? (
                    <Select
                      name="tipo_equipo"
                      value={newEntityData.tipo_equipo}
                      onValueChange={(value) => handleNewEntityChange({ target: { name: 'tipo_equipo', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{newEntityData.tipo_equipo || "Selecciona un tipo de equipo"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {equipoOptions.map((option) => (
                          <SelectItem key={option?.value} value={option?.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "sistema_parametro" ? (
                    <div className="flex items-center justify-between">
                      <Select
                        name="sistema_parametro"
                        value={newEntityData.sistema_parametro}
                        onValueChange={(value) => handleNewEntityChange({ target: { name: 'sistema_parametro', value } })}
                        className="input"
                      >
                        <SelectTrigger>
                          <span>{newEntityData.sistema_parametro || "Selecciona un tipo de sistema"}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {sistemaOptions.map((option) => (
                            <div key={option.value} className="flex items-center justify-between w-full">
                              <SelectItem key={option?.value} value={option?.value}>
                                {option.label}
                              </SelectItem>
                              <div className="flex space-x-2 ml-4">
                                <PencilIcon onMouseDown={(event) => handleIconClickModificar(fetchTiposDeSistemas, '/tiposDeSistema/modificar/', 'Modificar Tipo de Sistema', option, 'nombre_tipo_de_sistema', event)} className="h-6 w-6 text-yellow-500 cursor-pointer" aria-hidden="true" />
                                {/* <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchTiposDeSistemas,'/tiposDeSistema/modificar/','Modificar Tipo de Sistema',option,'nombre_tipo_de_sistema',event)}   className="h-6 w-6 text-blue-500 mr-2"  aria-hidden="true" /> */}
                                <TrashIcon
                                  onMouseDown={(event) => handleIconClick(fetchTiposDeSistemas, '/tiposDeSistema/borrar/', 'Eliminar Tipo de Sistema', option, event)}
                                  className="h-6 w-6 text-red-500 cursor-pointer"
                                  aria-hidden="true"
                                />

                              </div>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchTiposDeSistemas, '/tiposDeSistema/crear/', 'Agregar Tipo de Sistema', null, 'nombre_tipo_de_sistema', event)} className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
                    </div>
                  ) : field === "unidad_medida" ? (
                    <div className="flex items-center justify-between">
                      <Select
                        name="unidad_medida"
                        value={newEntityData.unidad_medida}
                        onValueChange={(value) => handleNewEntityChange({ target: { name: 'unidad_medida', value } })}
                        className="input"
                      >
                        <SelectTrigger>
                          <span>{newEntityData.unidad_medida || "Selecciona un tipo de unidad de medida"}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {unidadMedidaOptions.map((option) => (
                            <div key={option.value} className="flex items-center justify-between w-full"> {/* Contenedor adicional */}
                              <SelectItem key={option?.value} value={option?.value}>
                                {option.label}
                              </SelectItem>
                              <div className="flex space-x-2 ml-4">
                                <PencilIcon onMouseDown={(event) => handleIconClickModificar(fetchUnidadesDeMedida, '/tiposDeUnidades/modificar/', 'Modificar Unidad de Medida', option, 'nombre_unidad_de_medida', event)} className="h-6 w-6 text-yellow-500 cursor-pointer" aria-hidden="true" />
                                {/* <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchUnidadesDeMedida,'/tiposDeUnidades/modificar/','Modificar Unidad de Medida',null,'nombre_unidad_de_medida', event)}   className="h-6 w-6 text-blue-500 mr-2"  aria-hidden="true" /> */}
                                <TrashIcon
                                  onMouseDown={(event) => handleIconClick(fetchUnidadesDeMedida, '/tiposDeUnidades/borrar/', 'Eliminar Unidad de Medida', option, event)}
                                  className="h-6 w-6 text-red-500 cursor-pointer"
                                  aria-hidden="true"
                                />

                              </div>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchUnidadesDeMedida, '/tiposDeUnidades/crear/', 'Agregar Unidad de Medida', null, 'nombre_unidad_de_medida', event)} className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
                    </div>
                  ) : field === "tipo_dato" ? (

                    <Select
                      name="tipo_dato"
                      value={newEntityData.tipo_dato}
                      onValueChange={(value) => handleNewEntityChange({ target: { name: 'tipo_dato', value } })}
                      className="input"
                    >
                      <SelectTrigger>
                        <span>{newEntityData.tipo_dato || "Selecciona un tipo de dato"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {tipoDatoOptions.map((option) => (
                          <SelectItem key={option?.value} value={option?.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field === "etapa" ?
                    (
                      <div className="flex items-center justify-between">
                        <Select
                          name="etapa"
                          value={newEntityData.etapa}
                          onValueChange={(value) => handleNewEntityChange({ target: { name: 'etapa', value } })}
                          className="input"
                        >
                          <SelectTrigger>
                            <span>{newEntityData.etapa || "Selecciona una etapa"}</span>
                          </SelectTrigger>
                          <SelectContent>
                            {stagesOptions.map((etapa) => (
                              <div key={etapa.value} className="flex items-center justify-between w-full"> {/* Contenedor adicional */}
                                <SelectItem value={etapa?.value}>
                                  <span>{etapa?.label}</span>
                                </SelectItem>
                                <div className="flex space-x-2 ml-4">
                                  <PencilIcon
                                    onClick={() => { setIsFormDialogOpen(true); setDialogMessage("Modificar Etapa"); }}
                                    onMouseDown={(event) => handleIconClickModificar(fetchStagesOptions, '/tiposDeStages/modificar/', 'Modificar Etapa', etapa, 'nombre_etapa_de_parametro', event)}
                                    className="h-6 w-6 text-yellow-500 cursor-pointer"
                                    aria-hidden="true"
                                  />
                                  <TrashIcon
                                    onMouseDown={(event) => handleIconClick(fetchStagesOptions, '/tiposDeStages/borrar/', 'Eliminar Etapa', etapa, event)}
                                    className="h-6 w-6 text-red-500 cursor-pointer"
                                    aria-hidden="true"
                                  />


                                </div>
                              </div>
                            ))}
                          </SelectContent>

                        </Select>
                        <PlusIcon onMouseDown={(event) => handleIconClickModificar(fetchStagesOptions, '/tiposDeStages/crear/', 'Agregar Etapa', null, 'nombre_etapa_de_parametro', event)} className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
                      </div>
                    ) : (
                      <Input
                        id={field}
                        name={field}
                        value={newEntityData[field]}

                        // onChange={handleNewEntityChange}

                        onChange={(e) => {
                          handleNewEntityChange(e);
                        }}

                        placeholder={labels[field] || field}
                        type={field === 'password' ? 'password' : 'text'}
                      />

                    )}
                  {errors[field] && <p className="text-red-500 text-sm mt-1"> {errors[field]} </p>}

                </div>
              );
            })}

            {entity === 'parametros' && (
              <>
                <TruthTable onDataSubmit={handleDataSubmit} />
                {validationMessage && (
                  <p className={`text-sm ${validationMessage.includes('No') ? 'text-red-500' : 'text-green-500'} mt-2`}>
                    {validationMessage}
                  </p>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleSaveNewEntity}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-4 max-h-[80vh] overflow-auto"> {/* Ajustes de scroll */}
          <DialogHeader>
            <DialogTitle>Eliminar {entity.slice(0, -1).toUpperCase()}</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este {entity.slice(0, -1).toLowerCase()}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await onDelete(row);
                  setIsDialogOpen(false); // Cierra el diálogo después de eliminar
                } catch (error) {
                  console.error("Error al eliminar el elemento:", error);
                }
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessage}</DialogTitle>
            <DialogDescription>
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>

          <Input value={formData.name || ValorEdit || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.nombre_Generico && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre_Generico}</p>
          )}
          {/* {<p className="text-red-500 text-sm mt-1">{errors.name} </p>} */}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsFormDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleSaveForm}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogDelete} onOpenChange={setIsDialogDelete}>
        <DialogContent className="max-w-lg p-4 max-h-[80vh] overflow-auto"> {/* Ajustes de scroll */}
          <DialogHeader>
            <DialogTitle>{dialogMessage}</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas {dialogMessage}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogDelete(false)}>
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteForm}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
