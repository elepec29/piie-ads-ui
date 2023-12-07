import { Comuna } from './comuna';

export interface DireccionEmpleador {
  calle: string | undefined;
  numero: string | undefined;
  depto: string | undefined;
  comuna: Comuna;
}
