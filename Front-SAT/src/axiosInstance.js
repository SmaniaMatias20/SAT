import axios from "axios";
import { useMemo } from "react";

// Custom hook para crear una instancia de axios memoizada
export const useAxiosInstance = () => {
  const token = localStorage.getItem("authToken");  // O un estado global si prefieres

  // Memoriza la instancia de axios para evitar recreación innecesaria
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`,
      timeout: 50000,
    });

    // Configurar un interceptor para añadir el token de autorización en cada solicitud
    instance.interceptors.request.use((config) => {
      const currentToken = localStorage.getItem("authToken");
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });

    return instance;
  }, [token]); // Dependencia: se recreará solo cuando el token cambie

  return axiosInstance;
};
