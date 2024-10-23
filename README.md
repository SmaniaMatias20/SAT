# Proyecto SAT

Aplicación web que permite digitalizar la revisión de compresores de aire, proporcionando a los clientes un informe detallado sobre el estado de sus equipos. La aplicación se desarrolla utilizando un enfoque de programación funcional, lo que permite una gestión más eficiente del estado y la lógica de la aplicación. A través de un formulario dinámico, los usuarios pueden registrar las revisiones de los compresores y, al finalizar, recibir un informe en formato PDF. Este informe se envía por correo electrónico al cliente utilizando Nodemailer. Además, la aplicación incluye funcionalidades para la gestión de usuarios, parámetros de compresores y órdenes de trabajo.

## Tecnologías Utilizadas

### Frontend
![React](https://img.shields.io/badge/react-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Shadcn](https://img.shields.io/badge/shadcn-%23000000.svg?style=for-the-badge&logoColor=white) ![Lucide-React](https://img.shields.io/badge/lucide-react-%23000000.svg?style=for-the-badge&logoColor=white) ![Axios](https://img.shields.io/badge/axios-%23232B34.svg?style=for-the-badge&logo=axios&logoColor=white) ![Zod](https://img.shields.io/badge/zod-%23000000.svg?style=for-the-badge&logoColor=white)

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Tailwind CSS**: Framework CSS para diseño y estilo de la aplicación.
- **Shadcn**: Biblioteca de componentes para mejorar la UI.
- **Lucide-React**: Biblioteca de iconos para enriquecer la interfaz de usuario.
- **Axios**: Biblioteca para realizar solicitudes HTTP.
- **Zod**: Biblioteca para validaciones de datos y esquemas.

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Express](https://img.shields.io/badge/express-%23404D59.svg?style=for-the-badge&logo=express&logoColor=white) ![Sequelize](https://img.shields.io/badge/sequelize-%23000000.svg?style=for-the-badge&logo=sequelize&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-%2321C7C1.svg?style=for-the-badge&logo=json-web-token&logoColor=white) ![Nodemailer](https://img.shields.io/badge/nodemailer-%23E5E5E5.svg?style=for-the-badge&logo=npm&logoColor=black) ![Puppeteer](https://img.shields.io/badge/puppeteer-%23000000.svg?style=for-the-badge&logo=googlechrome&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white) ![Zod](https://img.shields.io/badge/zod-%23000000.svg?style=for-the-badge&logoColor=white)

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para Node.js que simplifica la creación de aplicaciones web y APIs.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **Sequelize**: ORM para Node.js que facilita la interacción con la base de datos.
- **JWT (JSON Web Token)**: Método para la autenticación de usuarios.
- **Nodemailer**: Biblioteca para enviar correos electrónicos a los clientes.
- **Puppeteer**: Biblioteca para la generación de documentos PDF.
- **Docker**: Contenerización de la aplicación para facilitar su despliegue y gestión.

- **Zod**: Biblioteca para validaciones de datos y esquemas.


## Herramientas

![Postman](https://img.shields.io/badge/postman-%23FF6C37.svg?style=for-the-badge&logo=postman&logoColor=white) ![DBeaver](https://img.shields.io/badge/dbeaver-%23000000.svg?style=for-the-badge&logoColor=white) ![Jenkins](https://img.shields.io/badge/jenkins-%23D24939.svg?style=for-the-badge&logo=jenkins&logoColor=white)

- **Postman**: Herramienta para probar y documentar APIs.
- **DBeaver**: Herramienta de administración de bases de datos para gestionar y consultar PostgreSQL.
- **Jenkins**: Herramienta de integración continua para automatizar el proceso de construcción y despliegue.

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
