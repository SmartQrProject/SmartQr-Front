'use client'
import { useState, useEffect } from 'react';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null | undefined>(undefined); // undefined = cargando

  useEffect(() => {
    const stored = localStorage.getItem('adminSession');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const userRole = parsed.payload?.roles || null;
        setRole(userRole);
        console.log('User role from adminSession:', userRole);
      } catch (error) {
        console.error('Error parsing adminSession:', error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  return role;
};


