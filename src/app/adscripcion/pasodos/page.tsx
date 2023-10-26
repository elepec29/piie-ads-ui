'use client';

import {
  InputApellidos,
  InputEmail,
  InputNombres,
  InputNumeroDeSerie,
  InputRut,
} from '@/components/form';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { Stepper } from '@/components/stepper/stepper';
import Titulo from '@/components/titulo';
import { InscribeContext } from '@/contexts/inscribir-context';
import StepContext from '@/contexts/step-context';
import { Administrador } from '@/interface/adscripcion';
import { AlertaError, AlertaExito } from '@/utilidades';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { CamposAdscripcionPaso2 } from '../(modelos)/campos-adscripcion-paso-2';
import {
  borrarRespaldos,
  buscarRespaldoPaso1,
  buscarRespaldoPaso2,
  respaldarPaso2,
} from '../(servicios)/respaldar-formularios';
import ModalTerminosAndCondiciones from './(componentes)/modal-terminos-y-condiciones';
import {
  EmpleadorYaExisteError,
  UsuarioYaExisteError,
  adscribirEmpleador,
} from './(servicios)/adscribir-empleador';

const PasoDosPage: React.FC<{}> = ({}) => {
  const step = [
    { label: 'Datos Entidad Empleadora', num: 1, active: false, url: '/adscripcion' },
    { label: 'Datos persona Administradora', num: 2, active: true, url: '/adscripcion/pasodos' },
  ];

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const valoresPorDefecto: CamposAdscripcionPaso2 = {
    runAdmin: '',
    numeroSerie: '',
    nombres: '',
    apellidos: '',
    email: '',
    emailConfirma: '',
    aceptaTerminos: false,
  };

  const router = useRouter();

  const { stepper } = useContext(StepContext);

  const { empleador, datosPasodos, datosAdmin } = useContext(InscribeContext);

  const [abrirModal, setAbrirModal] = useState(false);

  const formulario = useForm<CamposAdscripcionPaso2>({
    defaultValues: valoresPorDefecto,
    mode: 'onBlur',
  });

  // Respalda cambios al formulario en el local storage
  useEffect(() => {
    const subscripcion = formulario.watch(
      (campos: any) => respaldarPaso2(campos as CamposAdscripcionPaso2),
      valoresPorDefecto,
    );

    return () => {
      subscripcion.unsubscribe();
    };
  }, []);

  // Parcha el formulario
  useEffect(() => {
    const campos = buscarRespaldoPaso2();

    if (!campos) {
      return;
    }

    for (const key of Object.keys(campos) as [keyof CamposAdscripcionPaso2]) {
      formulario.setValue(key, campos[key]);
    }
  }, []);

  // Parchar contexto empleador
  useEffect(() => {
    const respaldoEmpleador = buscarRespaldoPaso1();

    if (!respaldoEmpleador) {
      AlertaError.fire({
        title: 'Paso 1 Incompleto',
        text: 'Debe ingresar los datos de la entidad empleadora antes de continuar',
      }).then(() => {
        router.push('/adscripcion');
      });
      return;
    }

    // En las descripciones estan se usa usa un espacio en blanco en lugar de un string vacio para
    // que el backend no tire un error de "requerido", lo que importa es la ID
    datosAdmin({
      rutempleador: respaldoEmpleador.run,
      razonsocial: respaldoEmpleador.razonSocial,
      telefonohabitual: respaldoEmpleador.telefono1,
      telefonomovil: respaldoEmpleador.telefono2,
      email: respaldoEmpleador.email,
      emailconfirma: respaldoEmpleador.emailConfirma,
      tipoempleador: {
        idtipoempleador: respaldoEmpleador.tipoEntidadId,
        tipoempleador: ' ',
      },
      ccaf: {
        idccaf: respaldoEmpleador.cajaCompensacionId,
        nombre: ' ',
      },
      actividadlaboral: {
        idactividadlaboral: respaldoEmpleador.actividadLaboralId,
        actividadlaboral: ' ',
      },
      tamanoempresa: {
        idtamanoempresa: respaldoEmpleador.tamanoEmpresaId,
        nrotrabajadores: 0,
        descripcion: ' ',
      },
      sistemaremuneracion: {
        idsistemaremuneracion: respaldoEmpleador.sistemaRemuneracionId,
        descripcion: ' ',
      },
      direccionempleador: {
        calle: respaldoEmpleador.calle,
        depto: respaldoEmpleador.block,
        numero: respaldoEmpleador.numero,
        comuna: {
          idcomuna: respaldoEmpleador.comunaId,
          nombre: ' ',
        },
      },
    });
  }, []);

  const confirmarAdscripcion: SubmitHandler<CamposAdscripcionPaso2> = async (data: any) => {
    if (!data.aceptaTerminos) {
      throw new Error('No se han aceptado los terminos y condiciones');
    }

    const datosPersonaAdministradora: Administrador = {
      rut: data.runAdmin,
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      emailconfirma: data.emailConfirma,
      seriecedula: data.numeroSerie,
      terminos: data.aceptaTerminos,
    };

    datosPasodos(datosPersonaAdministradora);

    setMostrarSpinner(true);
    try {
      await adscribirEmpleador({
        empleador: empleador,
        administrador: datosPersonaAdministradora,
      });

      setTimeout(() => {
        AlertaExito.fire({
          text: 'Adscripción realizada con éxito',
          willClose: () => {
            datosPasodos({
              rut: '',
              nombres: '',
              apellidos: '',
              email: '',
              emailconfirma: '',
              seriecedula: '',
              terminos: false,
            });

            datosAdmin({
              rutempleador: '',
              razonsocial: '',
              telefonohabitual: '',
              telefonomovil: '',
              email: '',
              emailconfirma: '',
              tipoempleador: {
                idtipoempleador: 0,
                tipoempleador: '',
              },
              ccaf: {
                idccaf: 0,
                nombre: '',
              },
              actividadlaboral: {
                idactividadlaboral: 0,
                actividadlaboral: '',
              },
              tamanoempresa: {
                idtamanoempresa: 0,
                nrotrabajadores: 0,
                descripcion: '',
              },
              sistemaremuneracion: {
                idsistemaremuneracion: 0,
                descripcion: '',
              },
              direccionempleador: {
                calle: '',
                depto: '',
                numero: '',
                comuna: {
                  idcomuna: '',
                  nombre: '',
                },
              },
            });

            borrarRespaldos();

            router.push('/adscripcion/finalizar');
          },
        });
      }, 3000);
      setTimeout(() => {
        setMostrarSpinner(false);
      }, 2000);
    } catch (error) {
      setMostrarSpinner(false);
      if (error instanceof UsuarioYaExisteError) {
        AlertaError.fire({ title: 'Persona administradora ya existe' });

        formulario.setError('runAdmin', {
          type: 'custom',
          message: 'RUN ya existe',
        });
      } else if (error instanceof EmpleadorYaExisteError) {
        AlertaError.fire({ title: 'RUN del empleador ya existe' });
      } else {
        AlertaError.fire({
          title: 'Error en la adscripción',
          text: 'Por favor confirme que todos los datos hayan sido ingresados y esten correctos',
        });
      }
    }
  };

  return (
    <>
      <SpinnerPantallaCompleta show={mostrarSpinner} />

      <div className="pb-3 px-3 pb-md-4 px-md-4 px-lg-5 bgads ">
        <FormProvider {...formulario}>
          <form
            className="needs-validation mx-auto"
            onSubmit={formulario.handleSubmit(confirmarAdscripcion)}
            noValidate>
            <Titulo manual="Manual" url="#">
              Inscribe tu empresa / Datos Administrador
            </Titulo>

            <div className="mt-3 mb-4 mx-0 mx-md-5">
              <Stepper Options={step} />
            </div>

            <div className="mx-auto" style={{ maxWidth: '768px' }}>
              <div className="row my-3">
                <div className="col-12 d-flex justify-content-end">
                  <div style={{ color: 'blueviolet' }}>
                    <span>
                      <small>(*) Son campos obligatorios.</small>
                    </span>
                  </div>
                </div>
              </div>

              <div className="row mt-3 g-3 align-items-baseline">
                <InputRut
                  name="runAdmin"
                  label="RUN de la persona Administradora"
                  tipo="rut"
                  className="col-12 col-md-6"
                />

                <InputNumeroDeSerie
                  name="numeroSerie"
                  label="N° Documento Cedula Identidad"
                  rutAsociado="runAdmin"
                  className="col-12 col-md-6"
                />

                <InputNombres name="nombres" label="Nombres" className="col-12 col-md-6" />

                <InputApellidos name="apellidos" label="Apellidos" className="col-12 col-md-6" />

                <InputEmail
                  name="email"
                  label="Correo electrónico de la persona Administradora"
                  className="col-12 col-md-6"
                />

                <InputEmail
                  name="emailConfirma"
                  label="Repetir correo electrónico de la persona Administradora"
                  className="col-12 col-md-6"
                  debeCoincidirCon="email"
                />
              </div>

              <div className="row my-4">
                <div className="col-12">
                  <div className="form-check position-relative">
                    <input
                      id="aceptaTerminos"
                      type="checkbox"
                      className={`form-check-input ${
                        formulario.formState.errors.aceptaTerminos ? 'is-invalid' : ''
                      }`}
                      {...formulario.register('aceptaTerminos', {
                        required: {
                          value: true,
                          message: 'Se deben aceptar los términos y condiciones',
                        },
                      })}
                    />
                    <label className="form-check-label" htmlFor="aceptaTerminos">
                      He leído y acepto los{' '}
                      <span
                        className="text-primary form-check-label"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.preventDefault(); // previene que se haga marque/desmarque el checkbox al abrir el modal
                          setAbrirModal(true);
                        }}>
                        Términos y Condiciones del servicio
                      </span>
                    </label>
                    <IfContainer show={formulario.formState.errors.aceptaTerminos}>
                      <div className="invalid-tooltip">
                        {formulario.formState.errors.aceptaTerminos?.message}
                      </div>
                    </IfContainer>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="d-flex flex-column flex-md-row-reverse">
                  <button type="submit" className="btn btn-primary">
                    Confirmar Adscripción
                  </button>
                  <Link
                    href={'/adscripcion'}
                    className="mt-2 mt-md-0 me-md-2 btn btn-danger"
                    onClick={() => stepper(1)}>
                    Volver
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      <ModalTerminosAndCondiciones
        show={abrirModal}
        onTerminosAceptados={() => {
          formulario.setValue('aceptaTerminos', true, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          setAbrirModal(false);
        }}
        onCerrar={() => {
          setAbrirModal(false);
        }}
        onRechazarTerminos={() => {
          formulario.setValue('aceptaTerminos', false, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          setAbrirModal(false);
        }}
      />
    </>
  );
};

export default PasoDosPage;
