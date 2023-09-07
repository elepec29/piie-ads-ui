'use client';

import { createContext, useState } from 'react';
import { LoginUsuario } from '../helpers/adscripcion/login-usuario';
import { ChildrenApp, UsuarioLogin } from './interfaces/types';

type AuthContextType = {
  rutusuario: string;
  clave: string;
  error: string;
  login: (usuario: UsuarioLogin) => void;
};

export const AuthContext = createContext<AuthContextType>({
  rutusuario: '',
  clave: '',
  error: '',
  login: () => {},
});

export const AuthProvider: React.FC<ChildrenApp> = ({ children }) => {
  const [usuario, setusuario] = useState({
    rutusuario: '',
    clave: '',
    error: '',
  });

  const Login = async (usuario: UsuarioLogin) => {
    if (usuario.rutusuario == '')
      return setusuario({ ...usuario, error: 'El usuario no puede estar Vació' });

    const respLogin = await LoginUsuario(usuario);
    console.log(respLogin);
    return respLogin;
  };

  return (
    <AuthContext.Provider
      value={{
        ...usuario,
        login: Login,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
