import { useState } from "react";
import styled from "styled-components";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/solid";

// Define el componente estilizado para la alerta
const AlertContainer = styled.div`
  position: relative;
  max-width: ${(props) => props.containerSize || "md"};
  margin: 1rem auto;
  padding: 2rem 1rem 1rem 1rem; /* Añade padding en la parte superior para el icono de cerrar */
  background-color: #d4edda; /* Color de fondo verde claro */
  border: 1px solid #c3e6cb; /* Borde verde claro */
  color: #155724; /* Texto verde oscuro */
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Define el componente estilizado para el icono de confirmación
const AlertIcon = styled(ExclamationTriangleIcon)`
  width: ${(props) => props.size || "1.5rem"};
  height: ${(props) => props.size || "1.5rem"};
  margin-right: 0.75rem;
  color: #155724; /* Color verde oscuro para el icono */
`;

// Define el componente estilizado para el botón de cerrar
const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #155724; /* Color verde oscuro para el botón de cerrar */
  cursor: pointer;
  padding: 0;
  &:hover {
    color: #0c6b43; /* Color verde más oscuro al pasar el mouse */
  }
`;

// Define el componente ConfirmAlert
const ConfirmAlert = ({ title, description, iconSize, containerSize }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AlertContainer containerSize={containerSize}>
            <CloseButton onClick={() => setIsVisible(false)}>
                <XMarkIcon className="w-5 h-5" />
            </CloseButton>
            <div className="flex items-start">
                <AlertIcon size={iconSize} />
                <div>
                    <h4 className="font-semibold text-lg">{title}</h4>
                    <p className="text-sm mt-1">{description}</p>
                </div>
            </div>
        </AlertContainer>
    );
};

export default ConfirmAlert;
