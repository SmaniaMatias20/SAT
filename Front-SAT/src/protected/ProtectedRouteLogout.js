// src/ProtectedRoute.js

import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const baseURL = `${import.meta.env.VITE_API_URL}:${
    import.meta.env.VITE_API_PORT
  }`;
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado inicial null para manejar la carga
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/");
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.post(
          `${baseURL}/usuarios/verificarToken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        navigate("/");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location]); // Verifica la autenticación en función del cambio de ubicación

  return element;
};

export default ProtectedRoute;
