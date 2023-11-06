import { InputClave } from '@/components/form';
import { ClaveTemporalInvalidaError, cambiarClave } from '@/servicios/auth';
import { AlertaError, AlertaExito } from '@/utilidades';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

interface FormularioCambiarClaveTransitoria {
  claveTransitoria: string;
  claveNueva: string;
  confirmaClave: string;
}

interface ModalCambiarClaveTemporalProps {
  show: boolean;
  rutUsuario: string;
  onCerrarModal: () => void;
  onClaveCambiada: () => void;
}

const ModalCambiarClaveTemporal: React.FC<ModalCambiarClaveTemporalProps> = ({
  show,
  rutUsuario,
  onCerrarModal,
  onClaveCambiada,
}) => {
  const formulario = useForm<FormularioCambiarClaveTransitoria>({ mode: 'onBlur' });

  const resetearFormulario = () => formulario.reset();

  const handleCerrarModal = () => {
    resetearFormulario();
    onCerrarModal();
  };

  const cambiarClaveTransitoria: SubmitHandler<FormularioCambiarClaveTransitoria> = async ({
    claveTransitoria,
    claveNueva,
    confirmaClave,
  }) => {
    try {
      await cambiarClave({
        rutUsuario,
        claveTransitoria,
        claveNueva,
        confirmaClaveNueva: confirmaClave,
      });

      AlertaExito.fire({
        html: 'Contraseña actualizada correctamente, vuelva a iniciar sesión',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      resetearFormulario();

      onClaveCambiada();
    } catch (error) {
      if (error instanceof ClaveTemporalInvalidaError) {
        return AlertaError.fire({
          title: 'Error',
          text: 'La clave temporal es inválida',
        });
      }

      return AlertaError.fire({
        title: 'Error',
        text: 'Hubo un error al actualizar la contraseña',
      });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleCerrarModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Clave Transitoria</Modal.Title>
        </Modal.Header>

        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(cambiarClaveTransitoria)}>
            <Modal.Body>
              <h6>
                Tu cuenta posee con una clave transitoria, completa el siguiente formulario para
                activar tu cuenta.
              </h6>
              <br />

              <InputClave
                name="claveTransitoria"
                label="Contraseña transitoria"
                className="mb-3"
                errores={{
                  requerida: 'La contraseña transitoria es obligatoria',
                }}
              />

              <InputClave
                validarFortaleza
                name="claveNueva"
                label="Contraseña Nueva"
                className="mb-3"
                errores={{
                  requerida: 'La contraseña nueva es obligatoria',
                }}
              />

              <InputClave
                name="confirmaClave"
                debeCoincidirCon="claveNueva"
                label="Repetir Contraseña"
                className="mb-3"
                errores={{
                  requerida: 'Debe repetir la contraseña',
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleCerrarModal}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </Modal.Footer>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default ModalCambiarClaveTemporal;
