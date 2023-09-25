export interface FetchOptions {
  /** Como se deberia interpretar la respuesta de la petición HTTP. (defecto: `json`) */
  bodyAs: 'text' | 'json';
}

export const defaultFetchOptions: Readonly<FetchOptions> = {
  bodyAs: 'json',
};
