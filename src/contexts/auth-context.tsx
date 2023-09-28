'use client';

import { UsuarioToken } from '@/modelos/usuario';
import { loguearUsuario } from '@/servicios/auth';
import { ReactNode, createContext } from 'react';

type AuthContextType = {
  login: (rut: string, clave: string) => Promise<UsuarioToken>;
};

export const AuthContext = createContext<AuthContextType>({
  login: async () => ({}) as UsuarioToken,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const login = async (rut: string, clave: string) => {
    const usuario = await loguearUsuario(rut, clave);

    return usuario;
  };

  return <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>;
};
