import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../../shadcn/form";
import { Input } from "../../shadcn/input";

export function ProfileForm({ iOnSubmit, iFormSchema }) {
  const form = useForm({
    resolver: zodResolver(iFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleChange = (e) => {
    const lowerCaseValue = e.target.value.toLowerCase();
    e.target.value = lowerCaseValue;
  }
  return (
    <Form {...form} className="mt-8">
      <form onSubmit={form.handleSubmit(iOnSubmit)} className="space-y-4 ">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Usuario" {...field} onChange={(e) => {
                  handleChange(e);
                  field.onChange(e); // Asegúrate de llamar a onChange de react-hook-form
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="my-4"
                  type="password"
                  placeholder="Contraseña"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Por favor, ingrese sus credenciales.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          {" "}
          <Button type="submit" className="bg-sky-900 hover:bg-sky-950 mt-4">
            Iniciar sesión
          </Button>
        </div>
      </form>
    </Form>
  );
}
