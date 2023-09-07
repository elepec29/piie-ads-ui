import { apiUrl } from '@/servicios/environment';

interface ValidarNumeroDeSerieRequest {
  rut: string;
  dv: string;
  serie: string;
}

export const validarNumeroDeSerie = async (request: ValidarNumeroDeSerieRequest): Promise<void> => {
  const respuesta = await fetch(`${apiUrl()}/fonasa/seriecedula`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (respuesta.status < 200 || respuesta.status > 300) {
    throw new Error('Numero de serie inválido');
  }
};
