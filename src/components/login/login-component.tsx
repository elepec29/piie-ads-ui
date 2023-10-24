'use client';

import { AuthContext } from '@/contexts/auth-context';
import {
  AutenticacionTransitoriaError,
  LoginPasswordInvalidoError,
  RutInvalidoError,
  UsuarioNoExisteError,
} from '@/servicios/auth';
import { urlTramitacion } from '@/servicios/environment';
import { AlertaError, AlertaExito } from '@/utilidades';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import IfContainer from '../if-container';
import SpinnerPantallaCompleta from '../spinner-pantalla-completa';
import styles from './login.module.css';
import ModalCambiarClaveTemporal from './modal-cambiar-clave-temporal';
import ModalClaveEnviada from './modal-clave-enviada';
import ModalRecuperarClave from './modal-recuperar-clave';

interface FormularioLogin {
  rut: string;
  clave: string;
}

export const LoginComponent: React.FC<{}> = ({}) => {
  const [verClave, setVerClave] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

  const [showModalCambiarClave, setShowModalCambiarClave] = useState(false);

  const [showModalRecuperarClave, setShowModalRecuperarClave] = useState(false);

  const [showModalClaveEnviada, setShowModalClaveEnviada] = useState(false);

  const router = useRouter();

  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<FormularioLogin>({
    mode: 'onBlur',
  });

  const rutUsuario = watch('rut');

  const handleLoginUsuario: SubmitHandler<FormularioLogin> = async ({ rut, clave }) => {
    try {
      setShowSpinner(true);

      await login(rut, clave);

      AlertaExito.fire({ text: 'Sesión iniciada correctamente' });

      router.push(`${urlTramitacion()}/tramitacion`);
    } catch (error) {
      let messageError = '';

      if (error instanceof RutInvalidoError) {
        messageError = `<br/> Rut Invalido`;
      } else if (
        error instanceof LoginPasswordInvalidoError ||
        error instanceof UsuarioNoExisteError
      ) {
        messageError = 'Contraseña invalida';
      } else if (error instanceof AutenticacionTransitoriaError) {
        setShowModalCambiarClave(true);
      } else {
        messageError = 'Ocurrió un problema en el sistema';
      }

      if (messageError != '')
        AlertaError.fire({
          title: 'Error',
          icon: 'error',
          html: messageError,
          confirmButtonColor: 'var(--color-blue)',
        });
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <>
      <IfContainer show={showSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <form onSubmit={handleSubmit(handleLoginUsuario)} className={styles.formlogin}>
        <label style={{ fontWeight: 'bold' }}>
          Ingresa tus credenciales de acceso al Portal Integrado para Entidades Empleadoras
        </label>
        <br />

        <div className="mb-3 mt-3 position-relative">
          <label className="form-label" htmlFor="rutUsuario">
            RUN Persona Usuaria:
          </label>
          <input
            id="rutUsuario"
            type="text"
            className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
            minLength={9}
            maxLength={10}
            {...register('rut', {
              required: 'El RUN es obligatorio',
              validate: {
                esRut: (rut) => (validateRut(rut) ? undefined : 'El RUN es inválido'),
              },
              onChange: (event: any) => {
                const regex = /[^0-9kK\-]/g; // solo números, guiones y la letra K
                let rut = event.target.value as string;

                if (regex.test(rut)) {
                  rut = rut.replaceAll(regex, '');
                }

                setValue('rut', rut.length > 2 ? formatRut(rut, false) : rut);
              },
              onBlur: (event) => {
                const rut = event.target.value;
                if (validateRut(rut)) {
                  setValue('rut', formatRut(rut, false));
                }
              },
            })}
          />
          <IfContainer show={errors.rut}>
            <div className="invalid-tooltip">{errors.rut?.message}</div>
          </IfContainer>
        </div>

        <div className="mb-3 position-relative">
          <label className="form-label" htmlFor="password">
            Clave de acceso:
          </label>
          <div className="input-group mb-3">
            <input
              id="password"
              type={verClave ? 'text' : 'password'}
              className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
              {...register('clave', {
                required: 'La clave es obligatoria',
              })}
            />
            <IfContainer show={errors.clave}>
              <div className="invalid-tooltip">{errors.clave?.message}</div>
            </IfContainer>
            <button
              className="btn btn-primary"
              tabIndex={-1}
              type="button"
              id="button-addon2"
              title={verClave ? 'Ocultar clave' : 'Ver clave'}
              onClick={() => setVerClave((x) => !x)}>
              <i className={`bi ${verClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
            </button>
          </div>
        </div>

        <div className={'mt-2 ' + styles.btnlogin}>
          <label
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: 'blue',
              marginRight: '50px',
            }}
            onClick={() => setShowModalRecuperarClave(true)}>
            Recuperar clave de acceso
          </label>{' '}
          &nbsp;
          <button type="submit" className="btn btn-primary">
            Ingresar
          </button>
        </div>
      </form>

      <ModalCambiarClaveTemporal
        rutUsuario={rutUsuario}
        show={showModalCambiarClave}
        onCerrarModal={() => {
          setShowModalCambiarClave(false);
        }}
        onClaveCambiada={() => {
          setShowModalCambiarClave(false);
          setValue('clave', '', { shouldValidate: false });
          setFocus('clave');
        }}
      />

      <ModalRecuperarClave
        show={showModalRecuperarClave}
        onCerrarModal={() => setShowModalRecuperarClave(false)}
        onClaveEnviada={() => {
          setShowModalRecuperarClave(false);
          setShowModalClaveEnviada(true);
        }}
      />

      <ModalClaveEnviada
        show={showModalClaveEnviada}
        onCerrarModal={() => setShowModalClaveEnviada(false)}
      />
    </>
  );
};
