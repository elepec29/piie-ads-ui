'use client';

import { UsuarioToken } from '@/modelos/usuario';
import {
  desloguearUsuario,
  esTokenValido,
  loguearUsuario,
  obtenerToken,
  obtenerUsuarioDeCookie,
} from '@/servicios/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  estaLogueado: boolean;
  usuario?: UsuarioToken;
  login: (rut: string, clave: string) => Promise<UsuarioToken>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  estaLogueado: false,
  usuario: undefined,
  login: async () => ({}) as any,
  logout: async () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [estaLogueado, setEstaLogueado] = useState(false);

  const [usuario, setUsuario] = useState<UsuarioToken | undefined>(undefined);

  const router = useRouter();

  // Recargar usuario del token
  useEffect(() => {
    const usuario = obtenerUsuarioDeCookie();
    if (!usuario) {
      return;
    }

    (async () => {
      try {
        const tokenValido = await esTokenValido(obtenerToken());

        if (!tokenValido) {
          throw new Error('Token invalido');
        }

        onLoginExitoso(usuario);
      } catch (error) {
        logout();

        router.push('/');
      }
    })();
  }, []);

  const login = async (rut: string, clave: string) => {
    const usuario = await loguearUsuario(rut, clave);

    onLoginExitoso(usuario);

    return usuario;
  };

  const logout = async () => {
    try {
      await desloguearUsuario();
    } catch (error) {
      console.error('ERROR EN LOGOUT: ', error);
    } finally {
      setUsuario(undefined);
      setEstaLogueado(false);
    }
  };

  const onLoginExitoso = (nuevoUsuario: UsuarioToken) => {
    setUsuario(nuevoUsuario);
    setEstaLogueado(true);
  };

  return (
    <AuthContext.Provider
      value={{
        estaLogueado,
        usuario,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
