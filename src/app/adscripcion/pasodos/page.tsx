'use client';

import { Stepper } from '@/components/stepper/stepper';
import Titulo from '@/components/titulo';
import { InscribeContext } from '@/contexts/inscribir-context';
import StepContext from '@/contexts/step-context';
import { Administrador } from '@/interface/adscripcion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { Overlay } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import isEmail from 'validator/lib/isEmail';
import { CamposAdscripcionPaso2 } from '../(modelos)/campos-adscripcion-paso-2';
import {
  borrarRespaldos,
  buscarRespaldoPaso1,
  buscarRespaldoPaso2,
  respaldarPaso2,
} from '../(servicios)/respaldar-formularios';
import ciold from '../../../img/ci-antigua.png';
import cinueva from '../../../img/ci-nueva.png';
import ModalTerminosAndCondiciones from './(componentes)/modal-terminos-y-condiciones';
import {
  EmpleadorYaExisteError,
  UsuarioYaExisteError,
  adscribirEmpleador,
} from './(servicios)/adscribir-empleador';
import { validarNumeroDeSerie } from './(servicios)/validar-numero-de-serie';
const PasoDosPage: React.FC<{}> = ({}) => {
  const step = [
    { label: 'Datos Entidad Empleadora', num: 1, active: false, url: '/adscripcion' },
    { label: 'Datos persona Administradora', num: 2, active: true, url: '/adscripcion/pasodos' },
  ];

  const [show, setShow] = useState(false);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const target = useRef(null);

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

  const { empleador, administrador, datosPasodos, datosAdmin } = useContext(InscribeContext);

  const [abrirModal, setAbrirModal] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CamposAdscripcionPaso2>({
    defaultValues: valoresPorDefecto,
    mode: 'onBlur',
  });

  useEffect(() => {
    // Respalda cambios al formulario
    const subscripcion = watch(
      (campos: any) => respaldarPaso2(campos as CamposAdscripcionPaso2),
      valoresPorDefecto,
    );

    return () => {
      subscripcion.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Parcha el formulario
    const campos = buscarRespaldoPaso2();

    if (!campos) {
      return;
    }

    for (const key of Object.keys(campos) as [keyof CamposAdscripcionPaso2]) {
      setValue(key, campos[key]);
    }
  }, []);

  useEffect(() => {
    // Parchar contexto empleador
    const respaldoEmpleador = buscarRespaldoPaso1();

    if (!respaldoEmpleador) {
      Swal.fire({
        icon: 'error',
        title: 'Paso 1 Incompleto',
        text: 'Debe ingresar los datos de la entidad empleadora antes de continuar',
        showConfirmButton: true,
        confirmButtonText: 'Completar',
        confirmButtonColor: 'var(--color-blue)',
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

  // TODO: Parece que sirve para cargar a la persona administradora cuando existe y precargar
  // const ObtieneUsuario = async (e: KeyboardEvent<HTMLInputElement>) => {
  //   if (!e.currentTarget.value) return;
  //   if (e.key == 'Tab') {
  //     try {
  //       const query: Response = await fetch(
  //         `${apiUrl()}/empleador/usuario/rut/{rutusuario}?rutusuario=` +
  //           formIni.rutadm,
  //       );
  //       const data: user = await query.json();
  //       setdatoUsuario(data);
  //     } catch (error: any) {
  //       Swal.fire({
  //         title: 'Error',
  //         icon: 'error',
  //         text: error?.message,
  //       });
  //     }
  //   }
  // };

  const permitirSoloNumeros = (campo: keyof CamposAdscripcionPaso2) => {
    return (event: any) => {
      /** Hace match con cualquier caracter que no sea un numero */
      const regex = /[^0-9]/g;
      const valor = event.target.value as string;

      if (regex.test(valor)) {
        const valorSoloDigitos = valor.replaceAll(regex, '');
        setValue(campo, valorSoloDigitos);
      }
    };
  };

  const validaSerie = async () => {
    if (errors.runAdmin) {
      return;
    }

    const [rut, dv] = getValues('runAdmin').split('-');
    if (!rut || !dv) {
      return;
    }

    try {
      await validarNumeroDeSerie({
        rut,
        dv,
        serie: getValues('numeroSerie'),
      });

      clearErrors('numeroSerie');
    } catch (error) {
      setError('numeroSerie', {
        type: 'custom',
        message: 'Debe ingresar un número de serie válido',
      });
    }
  };

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
        Swal.fire({
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
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
        await Swal.fire({
          title: 'Persona administradora ya existe',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonColor: 'var(--color-blue)',
        });

        setError('runAdmin', {
          type: 'custom',
          message: 'RUN ya existe',
        });
      } else if (error instanceof EmpleadorYaExisteError) {
        await Swal.fire({
          title: 'RUN del empleador ya existe',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonColor: 'var(--color-blue)',
        });
      } else {
        await Swal.fire({
          title: 'Error en la adscripción',
          text: 'Por favor confirme que todos los datos hayan sido ingresados y esten correctos',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonColor: 'var(--color-blue)',
        });
      }
    }
  };

  const onChangeRunPersonaAdministradora: ((event: any) => void) | undefined = (event) => {
    const regex = /[^0-9kK\-\.]/g; // solo números, puntos, guiones y la letra K
    const run = event.target.value as string;
    if (event.target.value.length > 10) return;

    if (regex.test(run)) {
      const soloCaracteresValidos = run.replaceAll(regex, '');
      setValue('runAdmin', soloCaracteresValidos);
    }
  };

  const trimInput = (campo: keyof CamposAdscripcionPaso2) => {
    const value = getValues(campo);

    if (typeof value === 'string') {
      setValue(campo, value.trim(), { shouldValidate: true });
    }
  };

  return (
    <>
      <div
        className={'spinner'}
        style={{
          display: mostrarSpinner ? '' : 'none',
        }}>
        <ClipLoader
          color={'var(--color-blue)'}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      <div className="pb-3 px-3 pb-md-4 px-md-4 px-lg-5 bgads ">
        <form
          className="needs-validation mx-auto"
          onSubmit={handleSubmit(confirmarAdscripcion)}
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
              <div className="col-12 col-md-6 position-relative">
                <label htmlFor="runAdministrador" className="form-label">
                  RUN de la persona Administradora
                </label>
                <input
                  id="runAdministrador"
                  type="text"
                  maxLength={10}
                  autoComplete="new-custom-value"
                  className={`form-control ${errors.runAdmin ? 'is-invalid' : ''}`}
                  {...register('runAdmin', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    validate: {
                      esRut: (run: string) =>
                        validateRut(run) ? undefined : 'Debe ingresar un RUN válido',
                    },
                    maxLength: {
                      value: 10,
                      message: 'Debe ingresar menos de 10 digitos',
                    },
                    onChange: onChangeRunPersonaAdministradora,
                    onBlur: (event: any) => {
                      const run = event.target.value;
                      if (validateRut(run)) {
                        setValue('runAdmin', formatRut(run, false));
                      }

                      if (!errors.runAdmin) {
                        clearErrors('runAdmin');
                      }
                    },
                  })}
                />
                {errors.runAdmin && (
                  <div className="invalid-tooltip">{errors.runAdmin?.message}</div>
                )}
              </div>

              <div className={`col-12 col-md-6 position-relative`}>
                <label htmlFor="numeroSerie" className="form-label">
                  N° Documento Cedula Identidad &nbsp;
                </label>
                <i
                  ref={target}
                  className="text-primary bi bi-question-circle"
                  onMouseOver={() => setShow(!show)}
                  onMouseLeave={() => setShow(!show)}
                  onClick={() => setShow(!show)}></i>
                <Overlay target={target.current} show={show} placement="top">
                  {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...props
                  }) => (
                    <div
                      {...props}
                      style={{
                        position: 'absolute',
                        backgroundColor: 'var(--color-blue)',
                        padding: '2px 10px',
                        color: 'white',
                        borderRadius: 4,
                        ...props.style,
                      }}>
                      <img width="220px" src={ciold.src}></img>
                      <img width="220px" src={cinueva.src}></img>
                    </div>
                  )}
                </Overlay>

                <input
                  id="numeroSerie"
                  type="text"
                  autoComplete="new-custom-value"
                  placeholder="EJ: 111222333 O A1234567890"
                  maxLength={11}
                  className={`form-control ${errors.numeroSerie ? 'is-invalid' : ''}`}
                  {...register('numeroSerie', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    minLength: {
                      value: 9,
                      message: 'No puede tener menos de 9 dígitos',
                    },
                    maxLength: {
                      value: 11,
                      message: 'No puede tener más de 11 dígitos',
                    },
                    pattern: {
                      value: /^(\d{9}|A\d{10})$/g,
                      message: 'Formato debe ser 111222333 o A1234567890',
                    },
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      const regex = /[^0-9aA]/g;
                      const valor = e.target.value.toUpperCase() as string;

                      if (regex.test(valor)) {
                        const formatvalue = valor.replaceAll(regex, '');
                        setValue('numeroSerie', formatvalue.toUpperCase());
                      }
                    },
                    onBlur: () => validaSerie(),
                  })}
                />
                {errors.numeroSerie && (
                  <div className="invalid-tooltip">{errors.numeroSerie?.message}</div>
                )}
              </div>

              <div className="col-12 col-md-6 position-relative">
                <label htmlFor="nombres" className="form-label">
                  Nombres
                </label>
                <input
                  id="nombres"
                  type="text"
                  autoComplete="new-password"
                  className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                  {...register('nombres', {
                    required: {
                      message: 'Este campo es obligatorio',
                      value: true,
                    },
                    minLength: {
                      value: 4,
                      message: 'Debe tener al menos 4 caracteres',
                    },
                    maxLength: {
                      value: 80,
                      message: 'Debe tener a lo más 80 caracteres',
                    },
                    onBlur: () => trimInput('nombres'),
                  })}
                />
                {errors.nombres && <div className="invalid-tooltip">{errors.nombres?.message}</div>}
              </div>

              <div className="col-12 col-md-6 position-relative">
                <div className="form-group">
                  <label htmlFor="apellidos" className="form-label">
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    type="text"
                    autoComplete="new-password"
                    className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                    {...register('apellidos', {
                      required: {
                        message: 'Este campo es obligatorio',
                        value: true,
                      },
                      minLength: {
                        value: 4,
                        message: 'Debe tener al menos 4 caracteres',
                      },
                      maxLength: {
                        value: 80,
                        message: 'Debe tener a lo más 80 caracteres',
                      },
                      onBlur: () => trimInput('apellidos'),
                    })}
                  />
                  {errors.apellidos && (
                    <div className="invalid-tooltip">{errors.apellidos?.message}</div>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6 position-relative">
                <label htmlFor="email" className="form-label">
                  Correo electrónico de la persona Administradora (*)
                </label>
                <input
                  id="email"
                  type="mail"
                  autoComplete="new-password"
                  placeholder="ejemplo@ejemplo.cl"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    maxLength: {
                      value: 250,
                      message: 'No puede tener más de 250 caracteres',
                    },
                    validate: {
                      esEmail: (email: string) => (isEmail(email) ? undefined : 'Correo inválido'),
                    },
                  })}
                />
                {errors.email && <div className="invalid-tooltip">{errors.email?.message}</div>}
              </div>

              <div className="col-12 col-md-6 position-relative">
                <label htmlFor="emailConfirma" className="form-label">
                  Repetir correo electrónico de la persona Administradora (*)
                </label>
                <input
                  id="emailConfirma"
                  type="mail"
                  autoComplete="new-custom-value"
                  placeholder="ejemplo@ejemplo.cl"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  className={`form-control ${errors.emailConfirma ? 'is-invalid' : ''}`}
                  {...register('emailConfirma', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    maxLength: {
                      value: 250,
                      message: 'No puede tener más de 250 caracteres',
                    },
                    validate: {
                      esEmail: (email: string) => (isEmail(email) ? undefined : 'Correo inválido'),
                      emailCoinciden: (emailConfirmar: string) => {
                        if (getValues('email') !== emailConfirmar) {
                          return 'Correos no coinciden';
                        }
                      },
                    },
                  })}
                />
                {errors.emailConfirma && (
                  <div className="invalid-tooltip">{errors.emailConfirma?.message}</div>
                )}
              </div>
            </div>

            <div className="row my-4">
              <div className="col-12">
                <div className="form-check position-relative">
                  <input
                    id="aceptaTerminos"
                    type="checkbox"
                    className={`form-check-input ${errors.aceptaTerminos ? 'is-invalid' : ''}`}
                    {...register('aceptaTerminos', {
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
                  {errors.aceptaTerminos && (
                    <div className="invalid-tooltip">{errors.aceptaTerminos.message}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="d-flex flex-column flex-md-row-reverse">
                <button
                  type="submit"
                  // disabled={!terminosCheck}
                  className="btn btn-primary">
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
      </div>

      {abrirModal && (
        <ModalTerminosAndCondiciones
          onTerminosAceptados={() => {
            setValue('aceptaTerminos', true, {
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
            setValue('aceptaTerminos', false, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
            setAbrirModal(false);
          }}
        />
      )}
    </>
  );
};

export default PasoDosPage;
