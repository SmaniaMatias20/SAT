import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "../../shadcn/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem } from '../../shadcn/select';
import { FileText } from 'lucide-react';
import { useAxiosInstance } from "../../../axiosInstance";
import CustomToast from '../CustomToast'; // Importa el componente CustomToast
import { useToast } from '../../../hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../../shadcn/table";

export function TableOT() {
    const [ordenes, setOrdenes] = useState([]);
    const [selectedOption, setSelectedOption] = useState('Todas las ordenes');
    const [errorFetching, setErrorFetching] = useState(false);
    const navigate = useNavigate();
    const axiosInstance = useAxiosInstance();
    const { toast, showToast } = useToast();

    const handleSelectChange = (value) => {
        setSelectedOption(value);
    };

    const fetchOrdenes = useCallback(async (estado = '') => {
        try {
            const response = await axiosInstance.get(`/ordenes/obtenerOrdenesPorUsuario`, {
                params: {
                    estado: estado !== 'Todas' ? estado : '',
                }
            });

            if (response.data && response.data.length > 0) {
                setOrdenes(response.data);
                setErrorFetching(false); // Resetea el estado de error
            } else {
                // Si no hay órdenes, muestra un toast con el mensaje
                setOrdenes([]); // Asegúrate de vaciar el estado de órdenes
                setErrorFetching(true); // Marca que hubo un error
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error. No se encontraron ordenes.";
            showToast(`${errorMessage}`, 'error');
            setErrorFetching(true); // Marca que hubo un error
            // No imprimas el error en la consola
        }
    }, [axiosInstance]);

    useEffect(() => {
        fetchOrdenes(selectedOption === 'Todas las ordenes' ? '' : selectedOption);
    }, [selectedOption, fetchOrdenes]);

    const handleRowClick = async (id, estado, idequipo, tipo_servicio, tipo_equipo) => {
        try {
            let response;
            if (estado === "pendiente") {
                response = await axiosInstance.post('/parametros/filtrarParams', {
                    tipo_servicio,
                    tipo_equipo,
                });
            } else {
                response = await axiosInstance.get(`/ordenesCargadas/listarOrdenesPorIdot/${id}`);
            }

            const formData = response.data;
            navigate(`/formParams/${id}/${estado}/${idequipo}`, { state: { formData } });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error. Intenta nuevamente.";
            showToast(`Error: ${errorMessage}`, 'error');
        }
    };

    const handleCheckboxChange = (id) => {
        setOrdenes((prevOrdenes) =>
            prevOrdenes.map((item) =>
                item.id === id
                    ? { ...item, aprobado: !item.aprobado }
                    : item
            )
        );
    };

    const getRowColor = (estado, aprobado) => {
        if (estado === 'pendiente') return 'bg-red-300';
        if (estado === 'realizada') return aprobado ? 'bg-green-300' : 'bg-yellow-300';
        return '';
    };

    return (
        <>
            <CustomToast message={toast.message} type={toast.type} />
            <h1 className="text-3xl font-semibold text-gray-800 mb-4"><FileText size={64} /></h1>
            <div className="w-1/2 md:w-1/3 lg:w-1/5 max-w-3xl mb-6">
                <Select value={selectedOption} onValueChange={handleSelectChange} className="w-full border border-gray-300 rounded-md">
                    <SelectTrigger className="bg-white border rounded-md p-2 text-gray-800">
                        <span>{selectedOption}</span>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-md">
                        <SelectItem value="Todas las ordenes">Todas las ordenes</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Realizada">Realizada</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full max-w-4xl overflow-x-auto">
                {errorFetching || ordenes.length === 0 ? (
                    <div className="text-center text-gray-500">No hay órdenes disponibles.</div> // Mensaje cuando no hay órdenes
                ) : (
                    <Table className="border-separate border-spacing-[0px] w-full bg-white border rounded-md shadow-2xl">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-600 text-center">ID ORDEN</TableHead>
                                <TableHead className="text-gray-600 text-center">ID EQUIPO</TableHead>
                                <TableHead className="text-gray-600 text-center">MODELO</TableHead>
                                <TableHead className="text-gray-600 text-center">TITULO</TableHead>
                                <TableHead className="text-gray-600 text-center">CLIENTE</TableHead>
                                <TableHead className="text-gray-600 text-center">ESTADO</TableHead>
                                <TableHead className="text-gray-600 text-center">APROBADO</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ordenes.map((orden) => (
                                <TableRow
                                    key={orden.id}
                                    className={`cursor-pointer hover:bg-gray-100 rounded-md ${getRowColor(orden.estado, orden.aprobado)}`}
                                    onClick={() => handleRowClick(orden.id, orden.estado, orden.idequipo, orden.tipo_servicio, orden.tipo_equipo)}
                                >
                                    <TableCell className="text-gray-700 text-center">{orden.id}</TableCell>
                                    <TableCell className="text-gray-700 text-center">{orden.idequipo}</TableCell>
                                    <TableCell className="text-gray-700 text-center">{orden.tipo_equipo}</TableCell>
                                    <TableCell className="text-gray-700 text-center">{orden.titulo}</TableCell>
                                    <TableCell className="text-gray-700 text-center">{orden.cliente}</TableCell>
                                    <TableCell className="text-gray-700 text-center">{orden.estado}</TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={orden.aprobado}
                                            onChange={() => handleCheckboxChange(orden.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            {/* Aquí puedes agregar contenido adicional si es necesario */}
                        </TableFooter>
                    </Table>
                )}
            </div>
        </>
    );
}
