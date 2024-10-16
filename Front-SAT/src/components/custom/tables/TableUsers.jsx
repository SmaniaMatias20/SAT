import { TableGeneric } from "./TableGeneric";

export function TableUsers() {
  return (
    <section className="flex flex-col items-center min-h-screen w-full bg-white p-0 md:p-0 lg:p-0">
      <TableGeneric
        endpoint="usuarios/tablaUsuarios"
        filtro="usuario"
        entity="usuarios"
      />
    </section>
  );
}
