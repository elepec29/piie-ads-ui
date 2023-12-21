'use client';

import {
  ActividadLaboral,
  Administrador,
  CajaDeCompensacion,
  Comuna,
  DireccionEmpleador,
  Empleador,
  SistemaRemuneracion,
  TamanoEmpresa,
  TipoEmpleador,
} from '@/modelos/adscripcion';
import { ReactNode, createContext, useState } from 'react';

type myAppProps = {
  children: ReactNode;
};

type InscribeContextType = {
  empleador: Empleador;
  administrador: Administrador;
  datosAdmin: (entidadEmpleadora: Empleador) => void;
  datosPasodos: (adminEmpleador: Administrador) => void;
  activaDesactivaGuia: () => void;
  guia: boolean;
};

let tipoEmpleador: TipoEmpleador = {
  idtipoempleador: 0,
  tipoempleador: '',
};

let ccaf: CajaDeCompensacion = {
  idccaf: 0,
  nombre: '',
};

let ActividadLaboral: ActividadLaboral = {
  idactividadlaboral: 0,
  actividadlaboral: '',
};

let TamanoEmpresa: TamanoEmpresa = {
  idtamanoempresa: 0,
  nrotrabajadores: 0,
  descripcion: '',
};

let Comuna: Comuna = {
  idcomuna: '',
  nombre: '',
};

let SistemaRemuneracion: SistemaRemuneracion = {
  idsistemaremuneracion: 0,
  descripcion: '',
};

let DireccionEmpleador: DireccionEmpleador = {
  calle: '',
  depto: '',
  comuna: Comuna,
  numero: '',
};

let empleadors: Empleador = {
  rutempleador: '',
  razonsocial: '',
  telefonohabitual: '',
  telefonomovil: '',
  email: '',
  emailconfirma: '',
  tipoempleador: tipoEmpleador,
  ccaf: ccaf,
  actividadlaboral: ActividadLaboral,
  tamanoempresa: TamanoEmpresa,
  sistemaremuneracion: SistemaRemuneracion,
  direccionempleador: DireccionEmpleador,
};

let administradors: Administrador = {
  rut: '',
  nombres: '',
  apellidos: '',
  email: '',
  emailconfirma: '',
  seriecedula: '',
  terminos: false,
};

export const InscribeContext = createContext<InscribeContextType>({
  empleador: empleadors,
  administrador: administradors,
  datosAdmin: () => {},
  datosPasodos: () => {},
  activaDesactivaGuia: () => {},
  guia: false,
});

export const InscribeProvider: React.FC<myAppProps> = ({ children }) => {
  const [emp, setemp] = useState(empleadors);
  const [admin, setadmin] = useState(administradors);
  const [guia, setguia] = useState(false);

  const datosAdmin = (entidadEmpleadora: Empleador) => setemp(entidadEmpleadora);
  const datosPasodos = (adminEmpleador: Administrador) => setadmin(adminEmpleador);
  const activaDesactivaGuia = () => setguia(!guia);

  return (
    <InscribeContext.Provider
      value={{
        administrador: admin,
        empleador: emp,
        datosAdmin,
        datosPasodos,
        guia,
        activaDesactivaGuia,
      }}>
      {children}
    </InscribeContext.Provider>
  );
};
