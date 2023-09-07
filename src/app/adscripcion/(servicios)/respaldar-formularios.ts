import { CamposAdscripcionPaso1 } from '../(modelos)/campos-adscripcion-paso-1';
import { CamposAdscripcionPaso2 } from '../(modelos)/campos-adscripcion-paso-2';

const keyPaso1 = 'adscripcion.paso1';
const keyPaso2 = 'adscripcion.paso2';

export const respaldarPaso1 = (campos: CamposAdscripcionPaso1) => {
  localStorage.setItem(keyPaso1, JSON.stringify(campos));
};

export const buscarRespaldoPaso1 = (): CamposAdscripcionPaso1 | null => {
  const respaldo = localStorage.getItem(keyPaso1);

  return !respaldo ? null : (JSON.parse(respaldo) as CamposAdscripcionPaso1);
};

export const respaldarPaso2 = (campos: CamposAdscripcionPaso2) => {
  localStorage.setItem(keyPaso2, JSON.stringify(campos));
};

export const buscarRespaldoPaso2 = (): CamposAdscripcionPaso2 | null => {
  const respaldo = localStorage.getItem(keyPaso2);

  return !respaldo ? null : (JSON.parse(respaldo) as CamposAdscripcionPaso2);
};

export const borrarRespaldos = () => {
  localStorage.removeItem(keyPaso1);
  localStorage.removeItem(keyPaso2);
};
