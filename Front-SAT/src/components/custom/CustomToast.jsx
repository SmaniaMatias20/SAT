import React from 'react';
import { X } from 'lucide-react'; // Icono de cierre, si quieres usar un ícono de cierre

const toastStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  default: 'bg-gray-800 text-white',
};

const CustomToast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded shadow-lg flex items-center ${toastStyles[type]}`}
      role="alert"
    >
      <div className="flex-grow">{message}</div>
      <button onClick={onClose} className="ml-4 p-1" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CustomToast;
