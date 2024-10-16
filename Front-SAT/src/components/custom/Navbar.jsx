import { useState, useEffect } from "react";
import { Button } from "../shadcn/button";
import { UserRound, Logs, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../img/logoDefinitivo.webp";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenu1Open, setIsMenu1Open] = useState(false);
  const [user, setUser] = useState("");
  const [rol, setRol] = useState("");
  const [fieldsNav, setFieldsNav] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Función para verificar la autenticación y configurar la navegación
    const checkAuthentication = () => {
      // Obtiene los datos almacenados en el localStorage
      const storedUser = localStorage.getItem("user");
      const storedRol = localStorage.getItem("rol");

      if (storedUser && storedRol) {
        try {
          // Intenta analizar los datos del localStorage
          const parsedUser = JSON.parse(storedUser);
          const parsedRol = JSON.parse(storedRol);

          // Establece el estado del usuario y el rol
          setUser(parsedUser);
          setRol(parsedRol);

          // Configura los campos de navegación basados en el rol del usuario
          if (parsedRol === "admin") {
            setFieldsNav([
              { name: "HOME", path: "/HomeAdmin" },
              { name: "USUARIOS", path: "/Users" },
              { name: "OT ASIGNADAS", path: "/OTasign" },
              { name: "PARAMETROS", path: "/Params" },
            ]);
          } else if (parsedRol === "usuario") {
            setFieldsNav([{ name: "HOME", path: "/OTasignUsers" }]);
          }
        } catch (error) {
          // Maneja errores en el análisis de datos y limpia el localStorage en caso de error
          console.error("Error parsing authentication data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("rol");
        }
      } else {
        // Si no hay datos de usuario o rol, limpia el estado y la navegación
        setUser(null);
        setRol(null);
        setFieldsNav([]);
      }
    };

    // Ejecuta la función para verificar la autenticación cuando el componente se monta
    checkAuthentication();
  }, []);

  // Función para alternar el estado de apertura/cierre del menú
  const toggleMenu = () => {
    // Cambia el estado de isMenuOpen de verdadero a falso, o viceversa
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleMenu1 = () => {
    // Cambia el estado de isMenuOpen de verdadero a falso, o viceversa
    setIsMenu1Open(!isMenu1Open);
  };

  // Función para manejar la navegación a una ruta específica
  const handleNavigation = (path) => {
    // Utiliza la función navigate para cambiar la ruta de la aplicación
    navigate(path);
  };

  // Función para manejar el cierre de sesión del usuario
  const handleLogout = () => {
    // Elimina los datos del usuario y el token de autenticación del localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("rol");

    // Limpia el estado del usuario y el rol en la aplicación
    setUser(null);
    setRol(null);

    // Redirige al usuario a la página de inicio después de cerrar sesión
    navigate("/");
  };

  return (
    <div className="">
      <div className=" gap-12 outline border-b-2 ">
        <div className="hidden sm:flex flex-row justify-end ">
          <Button
            onClick={() => navigate("HomeAdmin")}
            variant="ghost"
            className="text-black text-lg font-light rounded-none"
          >
            SAT
          </Button>
          <Button
            onClick={() => navigate("HomeAdmin")}
            variant="ghost"
            className="text-black text-lg font-light rounded-none"
          >
            TDB
          </Button>
          <Button
            onClick={() => navigate("HomeAdmin")}
            variant="ghost"
            className="text-black text-lg font-light rounded-none"
          >
            Variadores
          </Button>
          <Button
            onClick={() => navigate("HomeAdmin")}
            variant="ghost"
            className="text-black text-lg font-light rounded-none"
          >
            Control de horas
          </Button>
        </div>
        <div className="sm:hidden flex items-end justify-end mr-1">
          <Button
            onClick={toggleMenu1}
            variant="link"
            className="text-black text-sm"
          >
            {isMenu1Open ? <Logs /> : <Logs />}
          </Button>
        </div>
        {isMenu1Open && (
          <div className="sm:hidden flex flex-col justify-end items-center  gap-2 bg-white shadow-lg rounded-md z-0">
            <Button
              onClick={() => navigate("SAT")}
              variant="ghost"
              className="text-black text-lg font-light rounded-none"
            >
              SAT
            </Button>
            <Button
              onClick={() => navigate("TDB")}
              variant="ghost"
              className="text-black text-lg font-light rounded-none"
            >
              TDB
            </Button>
            <Button
              onClick={() => navigate("Variadores")}
              variant="ghost"
              className="text-black text-lg font-light rounded-none"
            >
              Variadores
            </Button>
            <Button
              onClick={() => navigate("Controlhs")}
              variant="ghost"
              className="text-black text-lg font-light rounded-none"
            >
              Control de horas
            </Button>
          </div>
        )}
      </div>
      {/* Segundo nav: que acompaña el scroll */}
      <div className="relative flex flex-row z-50 w-full h-20 bg-white text-lg items-center justify-between px-1 shadow-2xl transition-all order-first">
        <div className="flex items-center">
          <img
            className="h-full w-20 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
            src={logo}
            alt="Logo"
          />
          <p className="text-lg ml-2 font-medium truncate w-32 sm:w-auto">

            {!isMenuOpen && user.charAt(0).toUpperCase() + user.slice(1)}
          </p>
        </div>
        <div className="hidden sm:flex space-x-1">
          {user && rol && (
            <>
              {fieldsNav.map((item, index) => (
                <Button
                  key={index}
                  variant="link"
                  className="text-black text-sm !no-underline hover:text-black hover:font-bold hover:scale-105 transition-transform transition-colors duration-700 ease-in-out"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                onClick={handleLogout}
                variant="link"
                className="text-black text-sm"
              >
                <LogOut />
              </Button>
            </>
          )}
        </div>
        <div className="sm:hidden flex items-center">
          <Button
            onClick={toggleMenu}
            variant="link"
            className="text-black text-sm"
          >
            {isMenuOpen ? <Logs /> : <Logs />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg py-4 px-6">
          {user && rol && (
            <div className="flex flex-col mt-4">
              <div className="flex flex-row space-x-4 border items-center justify-center h-20">
                <UserRound size={32} />
                <div className="flex flex-col">
                  <p className="text-lg text-black">
                    {user.charAt(0).toUpperCase() + user.slice(1)}
                  </p>
                  <p className="text-lg text-black">
                    {rol.charAt(0).toUpperCase() + rol.slice(1)}
                  </p>
                </div>
              </div>
              {fieldsNav.map((item, index) => (
                <Button
                  key={index}
                  variant="link"
                  className="text-black text-sm !no-underline hover:text-black hover:font-bold hover:scale-105 hover:border"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                onClick={handleLogout}
                variant="link"
                className="text-black text-sm mt-2 w-full"
              >
                <LogOut />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
