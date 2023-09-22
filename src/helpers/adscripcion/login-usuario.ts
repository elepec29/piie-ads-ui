import { UsuarioLogin } from '@/contexts/interfaces/types';
import { respLogin } from '@/interface/adscripcion';
import { apiUrl } from '@/servicios/environment';
import jwt_decode from 'jwt-decode';
import { setCookie } from 'nookies';

let respuesta: respLogin = {
  data: [],
  message: '',
  statusCode: 0,
};

export const LoginUsuario = async (usuario: UsuarioLogin) => {
  let resp: respLogin;

  try {
    const data = await fetch(`${apiUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (data.ok) {
      let token = await data.text();

      if (token.includes('Bearer')) {
        const tokenDecodificado: any = jwt_decode(token.substring('Bearer '.length));
        const maxAge = tokenDecodificado.exp - tokenDecodificado.iat;

        setCookie(null, 'token', token, { maxAge, path: '/' });

        return {
          resp: {
            message: token,
            statusCode: 200,
          },
        };
      }
    }

    resp = await data.json();

    return {
      resp,
    };
  } catch (error) {
    console.log(error);
  }
};