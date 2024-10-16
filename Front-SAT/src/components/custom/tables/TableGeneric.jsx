import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/shadcn/button';
import { DataTable } from './DataTable';
import { LoadingSpinner } from '../Spinner';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import DropDownMenuTable from './DropdownMenuTable';
import { useAxiosInstance } from '../../../axiosInstance';
import CustomToast from '../CustomToast'; // Importa el componente CustomToast
import { useToast } from '../../../hooks/use-toast'; // Importa el hook useToast


// Funciones auxiliares
const jsonBufferToArrayBuffer = (bufferJson) => {
  return new Uint8Array(bufferJson.data).buffer;
};

const bufferToDataUrl = (buffer, mimeType) => {
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
};

const fetchData = async (endpoint, axiosInstance, handleAdd, handleEdit, handleDeleteConfirm, entity) => {
  try {
    const response = await axiosInstance.get(endpoint);
    const columnsArray = response.data.columnArray
      .map((item) => ({
        accessorKey: item,
        header: ({ column }) => (
          <Button
            className="text-xl text-left"
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            {item.toUpperCase()}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (row) => {
          const value = row.getValue();

          if (item === "archivo") {
            // Verifica si el objeto tiene un buffer y si el array de datos está vacío
            if (value && value.data && value.data.length > 0) {
              const arrayBuffer = jsonBufferToArrayBuffer(value);
              const dataUrl = bufferToDataUrl(arrayBuffer, 'application/pdf');
              return (
                <a href={dataUrl} target="_blank" rel="noopener noreferrer">
                  Ver PDF
                </a>
              );
            } else {
              // Si el array de datos está vacío, muestra el mensaje correspondiente
              return <div className="text-md text-red-500">No se cargaron archivos aún</div>;
            }
          }
          // Para otras celdas
          return <div className="text-lg text-blue">{value}</div>;
        },


        meta: { visible: item !== 'password' && item !== 'id' && item !== 'firma'  },

      }))
      .concat({
        accessorKey: "actions",
        header: () => <div className="text-center text-xl">ACCIONES</div>,
        cell: ({ row }) => (
          <DropDownMenuTable
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={() => handleDeleteConfirm(row.original)}
            row={row.original}
            entity={entity}
            fields={response.data.columnArray}
            labels={response.data.columnArray}
            hideAddOption={entity === "ordenesCargadas"}

          />
        ),
      });

    const elements = response.data.elementsArray;
    return {
      elements,
      columns: columnsArray,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { elements: [], columns: [] };
  }
};

// Componente de Paginación
const Pagination = ({ page, totalPages, onPageChange }) => {
  const handlePageChange = useCallback(
    (newPage) => {
      onPageChange(newPage);
    },
    [onPageChange]
  );

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <Button
        className="px-3 py-2 rounded-l-md bg-gray-800 text-white hover:bg-blue-600"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
        Page {page} of {totalPages}
      </span>
      <Button
        className="px-3 py-2 rounded-r-md bg-gray-800 text-white hover:bg-blue-600"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

const MemoPagination = React.memo(Pagination);

export default function TableGeneric({ entity, endpoint, filtro }) {
  const axiosInstance = useAxiosInstance();
  const { toast, showToast } = useToast();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 30;

  const paginatedData = useMemo(
    () => data.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [data, page, itemsPerPage]
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleAdd = useCallback(async (newData) => {
    try {
      await axiosInstance.post(`${entity}/cargar`, newData);
      showToast('Elemento añadido exitosamente.', 'success');
      await processData(); // Actualiza los datos después de añadir
    } catch (error) {
      // Captura el mensaje de error específico del backend, si existe
      const errorMessage = error.response?.data?.error || 'Error al añadir el elemento. Inténtalo de nuevo más tarde.';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  }, [entity, axiosInstance, showToast,]);


  const handleEdit = useCallback(async (editData,) => {
    let id = parseInt(editData.id, 10);
    if (entity == "parametros") {
      id = parseInt(editData[0].id, 10);
    }
    if (isNaN(id)) {
      showToast('El ID no es un número válido', 'error');
      throw new Error("ID is not a valid number");
    }
    try {
      await axiosInstance.put(`${entity}/modificar/${id}`, editData);
      showToast('Elemento editado exitosamente.', 'success');
      await processData(); // Actualizar los datos después de editar

    } catch (error) {
      // Captura el mensaje de error específico del backend, si existe
      const errorMessage = error.response?.data?.error || 'Error al añadir el elemento. Inténtalo de nuevo más tarde.';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  }, [entity, axiosInstance, showToast]);

  const handleDeleteConfirm = useCallback(async (deleteData) => {
    try {
      if (entity === "ordenesCargadas") {
        await axiosInstance.delete(`${entity}/borrar/${deleteData.id_ot}`);
        showToast('Elemento eliminado exitosamente.', 'success');
        await processData();
      } else if (entity === "parametros") {
        await axiosInstance.delete(`${entity}/borrar/${deleteData.id_parametro}`);
        showToast('Elemento eliminado exitosamente.', 'success');
        await processData();
      } else {
        await axiosInstance.delete(`${entity}/borrar/${deleteData.id}`);
        showToast('Elemento eliminado exitosamente.', 'success');
        await processData(); // Actualiza los datos después de eliminar
      }
    } catch (error) {
      // Captura el mensaje de error específico del backend, si existe
      const errorMessage = error.response?.data?.error || 'Error al añadir el elemento. Inténtalo de nuevo más tarde.';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  }, [entity, axiosInstance, showToast]);


  const processData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(endpoint, axiosInstance, handleAdd, handleEdit, handleDeleteConfirm, entity);
      setColumns(result.columns);
      setData(result.elements);
    } catch (error) {
      // Captura el mensaje de error específico del backend, si existe
      const errorMessage = error.response?.data?.error || 'Error al añadir el elemento. Inténtalo de nuevo más tarde.';
      showToast(`Error: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [endpoint, axiosInstance, handleAdd, handleEdit, handleDeleteConfirm, entity, showToast]);

  useEffect(() => {
    processData();
  }, [processData]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  return (
    <div className="container mx-auto py-10">
      {/* Mostrar el toast aquí */}
      <CustomToast message={toast.message} type={toast.type} />

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <LoadingSpinner size="100px" />
        </div>
      ) : error ? (
        <div className="text-red-500">{error.message}</div>
      ) : (
        <>
          <DataTable columns={columns} data={paginatedData} filtro={filtro} />
          <MemoPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}


export { TableGeneric };
