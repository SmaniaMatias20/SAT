import React from "react";
import styled from "styled-components";
import logo from "../../img/logoDefinitivo.webp";

// Define el componente de animación usando styled-components
const SpinnerImage = styled.img`
  width: ${(props) => props.size || "3rem"};
  height: ${(props) => props.size || "3rem"};
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Define el componente LoadingSpinner
const LoadingSpinner = React.forwardRef(({ size, className, ...rest }, ref) => {
  return (
    <SpinnerImage
      ref={ref}
      src={logo} // Ruta de la imagen
      alt="Loading"
      size={size} // Pasa el tamaño como prop
      className={className} // Puedes aplicar más clases si es necesario
      {...rest}
    />
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
