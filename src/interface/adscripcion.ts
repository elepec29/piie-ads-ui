export interface Welcome {
  empleador: Empleador;
  administrador: Administrador;
}

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

export type user = {
  rutusuario: string;
  nombres: string;
  apellidos: string;
  email: string;
};

export type errorInput = {
  input: string;
  msg: string;
};

export type respLogin = {
  error?: string;
  message: string;
  statusCode: number;
  data?: [];
};

export type formdata = {
  rut?: string | undefined;
  razon?: string | undefined;
  tipoentidademp?: string | undefined;
  ccaf?: string | undefined;
  activlab?: string | undefined;
  ccomuna?: string | undefined;
  calle?: string | undefined;
  numero?: string | undefined;
  bdep?: string | undefined;
  tf1?: string | undefined;
  tf2?: string | undefined;
  cemple?: string | undefined;
  recemple?: string | undefined;
  npersonas?: string | undefined;
  sremun?: string | undefined;
};

export type formdata2 = {
  rutadm: string;
  numserie: string | undefined;
  nombres: string | undefined;
  apellidos: string | undefined;
  cemple: string | undefined;
  recemple: string | undefined;
  captcha: string | undefined;
  terminos?: boolean;
};
