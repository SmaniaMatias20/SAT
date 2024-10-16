import { TableGeneric } from "../tables/TableGeneric";

export function FormOTAsignadas() {
  return (
    <section className="flex flex-col items-center min-h-screen w-full bg-white p-0 md:p-0 lg:p-0">
      <TableGeneric
        endpoint="ordenes/tablaOtAsignadas"
        filtro="titulo"
        entity="ordenes"
      />
    </section>
  );
}
