# Proyecto SAT

Este proyecto es una aplicación web que permite digitalizar la revisión de compresores de aire, proporcionando a los clientes un informe detallado sobre el estado de sus equipos. La aplicación se desarrolla utilizando un enfoque de programación funcional, lo que permite una gestión más eficiente del estado y la lógica de la aplicación. A través de un formulario dinámico, los usuarios pueden registrar las revisiones de los compresores y, al finalizar, recibir un informe en formato PDF. Este informe se envía por correo electrónico al cliente utilizando Nodemailer. Además, la aplicación incluye funcionalidades para la gestión de usuarios, parámetros de compresores y órdenes de trabajo.

## Tecnologías Utilizadas

### Frontend

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Tailwind CSS**: Framework CSS para diseño y estilo de la aplicación.
- **Shadcn**: Biblioteca de componentes para mejorar la UI.
- **Lucide-React**: Biblioteca de iconos para enriquecer la interfaz de usuario.
- **Axios**: Biblioteca para realizar solicitudes HTTP.
- **Zod**: Biblioteca para validaciones de datos y esquemas.

### Backend

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **Sequelize**: ORM para Node.js que facilita la interacción con la base de datos.
- **JWT (JSON Web Token)**: Método para la autenticación de usuarios.
- **Nodemailer**: Biblioteca para enviar correos electrónicos a los clientes.
- **Puppeteer**: Biblioteca para la generación de documentos PDF.
- **Docker**: Contenerización de la aplicación para facilitar su despliegue y gestión.
- **Jenkins**: Herramienta de integración continua para automatizar el proceso de construcción y despliegue.
- **Zod**: Biblioteca para validaciones de datos y esquemas.

## Herramientas

- **Postman**: Herramienta para probar y documentar APIs.
- **DBeaver**: Herramienta de administración de bases de datos para gestionar y consultar PostgreSQL.

## Funcionalidades

- **Registro y autenticación de usuarios**: Permite a los usuarios registrarse e iniciar sesión utilizando JWT para asegurar la autenticación.
- **Gestión de usuarios**:
  - **Alta**: Crear nuevos usuarios.
  - **Baja**: Eliminar usuarios existentes.
  - **Modificación**: Actualizar la información de los usuarios.
- **Gestión de parámetros de compresores de aire**:
  - **Alta**: Agregar nuevos parámetros para los compresores de aire.
  - **Baja**: Eliminar parámetros existentes.
  - **Modificación**: Actualizar los parámetros de los compresores de aire.
- **Gestión de órdenes de trabajo**:
  - **Alta**: Crear nuevas órdenes de trabajo.
  - **Baja**: Eliminar órdenes de trabajo existentes.
  - **Modificación**: Actualizar la información de las órdenes de trabajo.
- **Revisión de compresores**:
  - Formulario dinámico para la revisión de compresores de aire.
  - Generación automática de informes en formato PDF al finalizar la revisión utilizando Puppeteer.
  - Envío del informe PDF por correo electrónico al cliente utilizando Nodemailer.

## Imagenes

## Instalación

Para instalar y ejecutar el proyecto en tu máquina local con Linux, sigue estos pasos:

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/SmaniaMatias20/SAT.git
   cd SAT
