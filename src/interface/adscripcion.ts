export interface Administrador {
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  emailconfirma: string;
  seriecedula: string;
  terminos: boolean;
}

export interface Empleador {
  rutempleador: string | undefined;
  razonsocial: string | undefined;
  telefonohabitual: string | undefined;
  telefonomovil: string | undefined;
  email: string | undefined;
  emailconfirma: string | undefined;
  tipoempleador: Tipoempleador;
  ccaf: Ccaf;
  actividadlaboral: Actividadlaboral;
  tamanoempresa: Tamanoempresa;
  sistemaremuneracion: Sistemaremuneracion;
  direccionempleador: DireccionEmpleador;
}

export interface DireccionEmpleador {
  calle: string | undefined;
  numero: string | undefined;
  depto: string | undefined;
  comuna: Comuna;
}

export interface Actividadlaboral {
  idactividadlaboral: number;
  actividadlaboral: string | undefined;
}

export interface Ccaf {
  idccaf: number;
  nombre: string | undefined;
}

export interface Comuna {
  idcomuna: string | undefined;
  nombre: string | undefined;
}

export interface Sistemaremuneracion {
  idsistemaremuneracion: number;
  descripcion: string | undefined;
}

export interface Tamanoempresa {
  idtamanoempresa: number;
  nrotrabajadores: number;
  descripcion: string | undefined;
}

export interface Tipoempleador {
  idtipoempleador: number;
  tipoempleador: string | undefined;
}
