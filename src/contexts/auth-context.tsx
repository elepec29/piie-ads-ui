'use client';

import { loguearUsuario } from '@/servicios/auth';
import { ReactNode, createContext } from 'react';

type AuthContextType = {
  login: (rut: string, clave: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  login: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const login = async (rut: string, clave: string) => {
    await loguearUsuario(rut, clave);
  };

  return <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>;
};
