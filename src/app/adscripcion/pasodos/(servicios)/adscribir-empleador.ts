import { Administrador, Empleador } from '@/interface/adscripcion';
import { apiUrl } from '@/servicios/environment';

interface AdscribirEmpleadorRequest {
  empleador: Empleador;
  administrador: Administrador;
}

export class UsuarioYaExisteError extends Error {}

export class EmpleadorYaExisteError extends Error {}

export const adscribirEmpleador = async (request: AdscribirEmpleadorRequest) => {
  const data: Response = await fetch(`${apiUrl()}/empleador/adscribir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (data.ok || (data.status > 200 && data.status < 300)) {
    return;
  }

  const resp = await data.json();

  if (resp.message.length > 0) {
    if (resp.message.includes('usuario ya existe')) {
      throw new UsuarioYaExisteError();
    }

    resp.message?.map((msg: any) => {
      if (msg.includes('empleador.rutempleador|ya existe')) {
        throw new EmpleadorYaExisteError();
      }
    });
  }

  throw new Error('Error desconocido');
};
