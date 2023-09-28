import { UsuarioToken } from '@/modelos/usuario';

export const apiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL!;
};

export const urlRedirigirEnLogin = (usuario: UsuarioToken) => {
  return usuario.tieneRol('admin')
    ? process.env.NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ADMIN!
    : process.env.NEXT_PUBLIC_URL_DIRIGIR_EN_LOGIN_ASISTENTE!;
};
