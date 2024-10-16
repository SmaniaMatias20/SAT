// useToast.js
import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = useCallback((message, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 2000); // Ocultar después de 5 segundos
  }, []);

  return { toast, showToast };
}
