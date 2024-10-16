import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/shadcn/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

export default function TableDialog() {
  <Dialog>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem>
          <DialogTrigger>Eliminar</DialogTrigger>
        </DropdownMenuItem>
        <DropdownMenuItem>Modificar</DropdownMenuItem>
        <DropdownMenuItem>Crear Nuevo Usuario</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-lg md:text-xl lg:text-2xl">
          Estas seguro que deseas eliminar este usuario
        </DialogTitle>
        <DialogDescription className="text-sm md:text-base lg:text-lg">
          Esta acción no puede ser deshecha ¿estás seguro que deseas borrar este
          usuario de nuestro sistema?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-col md:flex-row md:justify-end">
        <Button
          type="button"
          variant="outline"
          className="mt-2 md:mt-0 md:mr-2"
        >
          Cancelar
        </Button>
        <Button type="submit" className="mt-2 md:mt-0">
          Confirmar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
