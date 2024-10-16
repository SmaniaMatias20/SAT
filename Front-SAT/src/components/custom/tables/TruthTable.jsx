import { Checkbox } from "../../shadcn/checkbox";
import { useState, useEffect } from "react";
import { useAxiosInstance } from '../../../axiosInstance';
import { useToast } from '../../../hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../shadcn/table";

export function TruthTable({ onDataSubmit, id_parametro }) {
    const { showToast } = useToast();
    const axiosInstance = useAxiosInstance();

    const [rows, setRows] = useState([]);
    const [checkboxes, setCheckboxes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedRow, setSelectedRow] = useState(null); // Added state to track selected row

    useEffect(() => {
        const fetchData = async () => {
            await fetchTiposDeServicio();
            await fetchTiposDeEquipo();
            if (id_parametro) {
                await fetchExistingData();
            }
        };

        fetchData();
    }, [id_parametro]);

    const fetchTiposDeServicio = async () => {
        try {
            const response = await axiosInstance.get('/documentos/obtenerDocumentos');
            if (response.data && response.data.documentos) {
                const tiposServicio = response.data.documentos.map(doc => doc.nombre_documento);
                setCheckboxes(tiposServicio);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error. Intenta nuevamente.";
            showToast(`Error: ${errorMessage}`, 'error');
        }
    };

    const fetchTiposDeEquipo = async () => {
        try {
            const response = await axiosInstance.get('/tiposDeEquipo/obtenerTipoEquipo');
            if (response.data && response.data.tiposDeEquipo) {
                const tiposEquipo = response.data.tiposDeEquipo.map(tipo => tipo.nombre_tipo_equipo);
                setRows(tiposEquipo);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error. Intenta nuevamente.";
            showToast(`Error: ${errorMessage}`, 'error');
        }
    };

    const fetchExistingData = async () => {
        try {
            const response = await axiosInstance.get(`/tiposDeDocumentosParametros/obtenerTablaDeVerdad/${id_parametro}`);
            if (response.data) {
                const fetchedData = Array.isArray(response.data) ? response.data : [response.data];
                populateSelectedOptions(fetchedData);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error. Intenta nuevamente.";
            showToast(`Error: ${errorMessage}`, 'error');
        }
    };

    const populateSelectedOptions = (data) => {
        const options = {};
        data.forEach(item => {
            const rowKey = item.tipo_equipo_nombre; // Key for the equipment
            const checkboxLabel = item.documento_nombre; // Checkbox label

            if (!options[rowKey]) {
                options[rowKey] = {};
            }

            options[rowKey][checkboxLabel] = true; // Mark checkbox as selected
        });
        setSelectedOptions(options);
    };

    // Enviar datos cada vez que selectedOptions cambie
    useEffect(() => {
        const updatedData = formatData(selectedOptions);
        if (Object.keys(selectedOptions).length > 0) {
            onDataSubmit(updatedData);
        }
    }, [selectedOptions]);

    const handleRowClick = (row) => {
        const newSelectedOptions = { ...selectedOptions };
        if (selectedRow === row) {
            delete newSelectedOptions[row];
            setSelectedRow(null);
        } else {
            newSelectedOptions[row] = {};
            checkboxes.forEach((checkboxLabel) => {
                newSelectedOptions[row][checkboxLabel] = true;
            });
            setSelectedRow(row);
        }
        setSelectedOptions(newSelectedOptions);
    };

    const handleCheckboxChange = (checkboxLabel, row) => {
        const newSelectedOptions = { ...selectedOptions };
        newSelectedOptions[row] = newSelectedOptions[row] || {};
        newSelectedOptions[row][checkboxLabel] = !newSelectedOptions[row][checkboxLabel]; // Toggle checkbox state
        setSelectedOptions(newSelectedOptions);
    };

    const formatData = (currentSelectedOptions) => {
        return rows.map(row => {
            const rowOptions = currentSelectedOptions[row] || {};
            const formattedRow = { fila: row };
            checkboxes.forEach(checkbox => {
                formattedRow[checkbox] = !!rowOptions[checkbox];
            });
            return formattedRow;
        });
    };

    const toggleColumnCheckbox = (checkboxLabel) => {
        const newSelectedOptions = { ...selectedOptions };
        rows.forEach((item) => {
            newSelectedOptions[item] = newSelectedOptions[item] || {};
            newSelectedOptions[item][checkboxLabel] = !newSelectedOptions[item][checkboxLabel];
        });
        setSelectedOptions(newSelectedOptions);
    };

    return (
        <div className="overflow-auto max-h-[400px] max-w-full">
            <Table className="min-w-full text-center border shadow-2xl mt-6 mb-6">
                <TableHeader>
                    <TableRow>
                        <TableCell className="text-center text-xs">#</TableCell>
                        {checkboxes.map((label) => (
                            <TableCell key={label} onClick={() => toggleColumnCheckbox(label)} className="text-center text-xs max-w-[50px]">{label}</TableCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((item) => (
                        <TableRow
                            key={item}
                            className={`hover:bg-gray-100 ${selectedRow === item ? 'bg-blue-200' : ''}`}
                        >
                            <TableCell className="py-0.5 text-xs" onClick={() => handleRowClick(item)}>{item}</TableCell>
                            {checkboxes.map((checkboxLabel) => (
                                <TableCell key={checkboxLabel} className="py-0.5 text-center text-xs max-w-[50px]">
                                    <Checkbox
                                        onCheckedChange={(checked) => handleCheckboxChange(checkboxLabel, item)}
                                        checked={!!selectedOptions[item]?.[checkboxLabel]}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
