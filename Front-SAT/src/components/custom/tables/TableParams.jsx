import { TableGeneric } from './TableGeneric'


export function TablaDinamica() {
  return (
    <section className="flex flex-col items-center min-h-screen w-full bg-white p-0 md:p-0 lg:p-0">
      <TableGeneric
        endpoint="parametros/tablaParametros"
        filtro="nombre_parametro"
        entity="parametros"
      />
    </section>
  );
}



