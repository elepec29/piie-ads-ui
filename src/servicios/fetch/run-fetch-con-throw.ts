import { ErrorFetchDesconocido, HttpError } from './errores';
import { FetchOptions, defaultFetchOptions } from './fetch-options';

/**
 * una llamada a `fetch` y devuelve el valor de esta o lanza un error si algo sale mal.
 *
 * Se considera como error lo siguiente:
 *  - Que no se puede parsear el json del cuerpo
 *  - Codigo de respuesta no esta en el rango de los 200.
 *
 * Se puede pasar el tipo de dato esperado al que va a resolver el fetch, pero no se verificará
 * que en efecto corresponda a ese tipo de dato, solo es una ayuda para typescript.
 *
 * En caso de que la respuesta sea exitosa, pero el cuerpo de la respuesta venga vacio la promesa
 * resuelve correctamente a `undefined`, por lo tanto hay que tipear la respuesta con `void` o
 * para evitar problemas por tipos.
 *
 * @param url
 * La misma URL que `fetch`
 *
 * @param init
 * El mismo que `fetch`
 *
 * @param options
 * Opciones para configurar el fetch
 *
 * @returns
 * Una promesa que resuelve al valor del fetch envuelto. El error sera de tipo {@link FetchError}
 */
export const runFetchConThrow = async <T = any>(
  url: RequestInfo | URL,
  init?: RequestInit,
  options?: FetchOptions,
): Promise<T> => {
  const opts = {
    ...defaultFetchOptions,
    ...options,
  };
  const fetchRequest = !init ? fetch(url) : fetch(url, init);

  try {
    const res = await fetchRequest;

    if (!res.ok) {
      throw new HttpError(
        res.status,
        res.statusText,
        'Error en la respuesta',
        res.url,
        await res.json(),
      );
    }

    const contentLengthHeader = res.headers.get('Content-Length');
    if (contentLengthHeader && parseInt(contentLengthHeader) !== 0) {
      if (opts.bodyAs === 'text') {
        return res.text() as Promise<T>;
      } else {
        return res.json() as Promise<T>;
      }
    } else {
      return undefined as unknown as Promise<any>;
    }
  } catch (err) {
    const fetchError =
      err instanceof HttpError ? err : new ErrorFetchDesconocido('Error desconocido', err);

    throw fetchError;
  }
};
