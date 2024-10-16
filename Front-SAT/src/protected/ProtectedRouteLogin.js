// src/ProtectedRoute.js

import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const baseURL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`;

const ProtectedRouteLogin = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado inicial null para manejar la carga
    const location = useLocation();
    const navigate = useNavigate();
  
    useEffect(() => {
   
      const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user')
        const rol = localStorage.getItem('rol')
        try {
          if (token && user && rol) {
            const response = await axios.post(`${baseURL}/usuarios/verificarToken`, {}, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if(response.status == 200)
            {
              if(rol.replace(/"/g, '') == 'admin')
              {
                navigate("/HomeAdmin");
              }
              else
              {
                navigate("/OTasignUsers");
              }
            }
          }
        } catch (error) {
        }
      };
  
      checkAuth();
    }, [location]); // Verifica la autenticación en función del cambio de ubicación
  
    return element;
  
  };
  
  export default ProtectedRouteLogin;
  
