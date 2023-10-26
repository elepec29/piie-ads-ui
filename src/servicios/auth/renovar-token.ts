import { apiUrl } from '@/servicios/environment';
import { runFetchConThrow } from '@/servicios/fetch';
import { setearCookieAutenticacion } from './cookie-autenticacion';
import { obtenerToken } from './obtener-token';

/**
 * Refresca el token de autenticacion y lo guarda
 */
export const renovarToken = async (): Promise<string> => {
  const token = await runFetchConThrow<string>(
    `${apiUrl()}/auth/refresh`,
    {
      headers: {
        Authorization: obtenerToken(),
        'Content-type': 'application/json',
      },
    },
    {
      bodyAs: 'text',
    },
  );

  setearCookieAutenticacion(token);

  return token;
};
