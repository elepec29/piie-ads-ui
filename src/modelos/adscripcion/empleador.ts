import { ActividadLaboral } from './actividad-laboral';
import { CajaDeCompensacion } from './caja-de-compensacion';
import { DireccionEmpleador } from './direccion-empleador';
import { SistemaRemuneracion } from './sistema-remuneracion';
import { TamanoEmpresa } from './tamano-empresa';
import { TipoEmpleador } from './tipo-empleador';

export interface Empleador {
  rutempleador: string | undefined;
  razonsocial: string | undefined;
  telefonohabitual: string | undefined;
  telefonomovil: string | undefined;
  email: string | undefined;
  emailconfirma: string | undefined;
  tipoempleador: TipoEmpleador;
  ccaf: CajaDeCompensacion;
  actividadlaboral: ActividadLaboral;
  tamanoempresa: TamanoEmpresa;
  sistemaremuneracion: SistemaRemuneracion;
  direccionempleador: DireccionEmpleador;
}
