'use client';

import { Stepper } from '@/components/stepper/stepper';
import Titulo from '@/components/titulo';
import { InscribeContext } from '@/contexts';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/interface/adscripcion';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { formatRut, validateRut } from 'rutlib';
import isEmail from 'validator/es/lib/isEmail';
import { CamposAdscripcionPaso1 } from './(modelos)/campos-adscripcion-paso-1';
import { buscarActividadesLaborales } from './(servicios)/buscar-actividades-laborales';
import { buscarCajasDeCompensacion } from './(servicios)/buscar-cajas-de-compensacion';
import { buscarComunas } from './(servicios)/buscar-comunas';
import { buscarRegiones } from './(servicios)/buscar-regiones';
import { buscarSistemasDeRemuneracion } from './(servicios)/buscar-sistemas-de-remuneracion';
import { buscarTamanosEmpresa } from './(servicios)/buscar-tamanos-empresa';
import { buscarTiposDeEmpleadores } from './(servicios)/buscar-tipo-de-empleadores';
import { buscarRespaldoPaso1, respaldarPaso1 } from './(servicios)/respaldar-formularios';

const AdscripcionPage: React.FC<{}> = ({}) => {
  const step = [
    { label: 'Datos Entidad Empleadora', num: 1, active: true, url: '/adscripcion' },
    { label: 'Datos Persona Administradora', num: 2, active: false, url: '/adscripcion/pasodos' },
  ];

  const valoresPorDefecto: CamposAdscripcionPaso1 = {
    run: '',
    razonSocial: '',
    tipoEntidadId: -1,
    cajaCompensacionId: -1,
    actividadLaboralId: -1,
    regionId: '',
    comunaId: '',
    calle: '',
    numero: '',
    block: '',
    telefono1: '',
    telefono2: '',
    email: '',
    emailConfirma: '',
    tamanoEmpresaId: -1,
    sistemaRemuneracionId: -1,
  };

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [
    _,
    [
      tiposDeEmpleadores,
      cajasDeCompensacion,
      actividadesLaborales,
      regiones,
      comunas,
      sistemasDeRemuneracion,
      tamanosDeEmpresas,
    ],
    loading,
  ] = useMergeFetchArray([
    buscarTiposDeEmpleadores(),
    buscarCajasDeCompensacion(),
    buscarActividadesLaborales(),
    buscarRegiones(),
    buscarComunas(),
    buscarSistemasDeRemuneracion(),
    buscarTamanosEmpresa(),
  ]);

  const router = useRouter();

  const { datosAdmin } = useContext(InscribeContext);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CamposAdscripcionPaso1>({
    defaultValues: valoresPorDefecto,
    mode: 'onBlur',
  });

  const regionSeleccionada = watch('regionId');

  useEffect(() => {
    // Parchar formulario
    if (loading) {
      return;
    }

    const campos = buscarRespaldoPaso1();
    if (!campos) {
      setMostrarSpinner(false);
      return;
    }

    setMostrarSpinner(true);
    for (const key of Object.keys(campos) as [keyof CamposAdscripcionPaso1]) {
      setValue(key, campos[key]);
    }

    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      setValue('comunaId', campos.comunaId);
      setMostrarSpinner(false);
    }, 1000);
  }, [loading]);

  useEffect(() => {
    // Guardar cambios al formulario
    const subscripcion = watch(
      (campos) => respaldarPaso1(campos as CamposAdscripcionPaso1),
      valoresPorDefecto,
    );

    return () => {
      subscripcion.unsubscribe();
    };
  }, []);

  const onSiguiente: SubmitHandler<CamposAdscripcionPaso1> = async (data) => {
    const tipoEmpleador = tiposDeEmpleadores!.find((x) => x.idtipoempleador === data.tipoEntidadId);
    const cajaCompensacion = cajasDeCompensacion!.find((x) => x.idccaf === data.cajaCompensacionId);
    const actividadLaboral = actividadesLaborales!.find(
      (x) => x.idactividadlaboral === data.actividadLaboralId,
    );
    const comuna = comunas!.find((x) => x.idcomuna.toString() === data.comunaId);
    const sistemaRemuneracion = sistemasDeRemuneracion!.find(
      (x) => x.idsistemaremuneracion === data.sistemaRemuneracionId,
    );
    const tamanoEmpresa = tamanosDeEmpresas!.find(
      (x) => x.idtamanoempresa === data.tamanoEmpresaId,
    );

    if (
      !tipoEmpleador ||
      !cajaCompensacion ||
      !actividadLaboral ||
      !comuna ||
      !sistemaRemuneracion ||
      !tamanoEmpresa
    ) {
      throw new Error('No se encontraron los valores en los combos');
    }

    const datosEmpleador: Empleador = {
      rutempleador: data.run,
      razonsocial: data.razonSocial,
      telefonohabitual: data.telefono1,
      telefonomovil: data.telefono2,
      email: data.email,
      emailconfirma: data.emailConfirma,
      tipoempleador: tipoEmpleador,
      ccaf: cajaCompensacion,
      actividadlaboral: actividadLaboral,
      tamanoempresa: tamanoEmpresa,
      sistemaremuneracion: sistemaRemuneracion,
      direccionempleador: {
        calle: data.calle,
        depto: data.block,
        numero: data.numero,
        comuna: {
          idcomuna: comuna.idcomuna.toString(),
          nombre: comuna.nombre,
        },
      },
    };

    datosAdmin(datosEmpleador);

    router.push('/adscripcion/pasodos');
  };

  const validarComboObligatorio = (mensaje?: string) => {
    return (valor: number | string) => {
      if (typeof valor === 'number' && valor === -1) {
        return mensaje ?? 'Este campo es obligatorio';
      }

      if (typeof valor === 'string' && valor === '') {
        return mensaje ?? 'Este campo es obligatorio';
      }
    };
  };

  const onChangeRunEntidadEmpleadora = (event: any) => {
    const regex = /[^0-9kK\-\.]/g; // solo números, puntos, guiones y la letra K
    const run = event.target.value as string;

    if (regex.test(run)) {
      const soloCaracteresValidos = run.replaceAll(regex, '');
      setValue('run', soloCaracteresValidos);
    }
  };

  const trimInput = (campo: keyof CamposAdscripcionPaso1) => {
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
          display: loading || mostrarSpinner ? '' : 'none',
        }}>
        <ClipLoader
          color={'var(--color-blue)'}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>

      <form
        className={
          'pb-3 px-3 pb-md-4 px-md-4 px-lg-5 bgads needs-validation animate__animated animate__fadeIn' +
          (loading ? ' blur' : '')
        }
        onSubmit={handleSubmit(onSiguiente)}>
        <div>
          <Titulo manual="Manual" url="#">
            Inscribe Entidad Empleadora / Datos Entidad Empleadora
          </Titulo>
        </div>

        <div className="mt-3 mb-4 mx-0 mx-md-5">
          <Stepper Options={step} />
        </div>

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
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="runEntidadEmpleadora" className="form-label">
              <span>RUN Entidad Empleadora /</span>
              <br />
              <span>Persona Trabajadora Independiente (*)</span>
            </label>
            <input
              id="runEntidadEmpleadora"
              type="text"
              autoComplete="new-custom-value"
              className={`form-control ${errors.run ? 'is-invalid' : ''}`}
              {...register('run', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio',
                },
                validate: {
                  esRut: (run) => (validateRut(run) ? undefined : 'Debe ingresar un RUN válido'),
                },
                onChange: onChangeRunEntidadEmpleadora,
                onBlur: (event) => {
                  const run = event.target.value;
                  if (validateRut(run)) {
                    setValue('run', formatRut(run, false));
                  }
                },
              })}
            />
            {errors.run && <div className="invalid-tooltip">{errors.run?.message}</div>}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="razonSocial" className="form-label">
              Razón Social / Nombre (*)
            </label>
            <input
              id="razonSocial"
              type="text"
              autoComplete="new-custom-value"
              className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
              {...register('razonSocial', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio',
                },
                minLength: {
                  value: 4,
                  message: 'Debe tener al menos 4 caracteres',
                },
                maxLength: {
                  value: 120,
                  message: 'No puede tener más de 120 caracteres',
                },
                onBlur: () => trimInput('razonSocial'),
              })}
            />
            {errors.razonSocial && (
              <div className="invalid-tooltip">{errors.razonSocial?.message}</div>
            )}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="tipoEntidadEmpleadora" className="form-label">
              Tipo de Entidad Empleadora (*)
            </label>
            <select
              id="tipoEntidadEmpleadora"
              className={`form-select ${errors.tipoEntidadId ? 'is-invalid' : ''}`}
              {...register('tipoEntidadId', {
                setValueAs: (v) => parseInt(v, 10),
                validate: validarComboObligatorio(),
              })}>
              <option value={-1}>Seleccionar</option>
              {tiposDeEmpleadores &&
                tiposDeEmpleadores.map(({ idtipoempleador, tipoempleador }) => (
                  <option key={idtipoempleador} value={idtipoempleador}>
                    {tipoempleador}
                  </option>
                ))}
            </select>
            {errors.tipoEntidadId && (
              <div className="invalid-tooltip">{errors.tipoEntidadId?.message}</div>
            )}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="cajaCompensacion" className="form-label">
              Seleccione CCAF a la cual está afiliada (*)
            </label>
            <select
              id="cajaCompensacion"
              className={`form-select ${errors.cajaCompensacionId ? 'is-invalid' : ''}`}
              {...register('cajaCompensacionId', {
                setValueAs: (v) => parseInt(v, 10),
                validate: validarComboObligatorio(),
              })}>
              <option value={-1}>Seleccionar</option>
              {cajasDeCompensacion &&
                cajasDeCompensacion.map((value) => (
                  <option key={value.idccaf} value={value.idccaf}>
                    {value.nombre}
                  </option>
                ))}
            </select>
            {errors.cajaCompensacionId && (
              <div className="invalid-tooltip">{errors.cajaCompensacionId?.message}</div>
            )}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="actividadLaboral" className="form-label">
              Actividad Laboral Entidad Empleadora (*)
            </label>
            <select
              id="actividadLaboral"
              className={`form-select ${errors.actividadLaboralId ? 'is-invalid' : ''}`}
              {...register('actividadLaboralId', {
                setValueAs: (v) => parseInt(v, 10),
                validate: validarComboObligatorio(),
              })}>
              <option value={-1}>Seleccionar</option>
              {actividadesLaborales &&
                actividadesLaborales.map((value) => (
                  <option key={value.idactividadlaboral} value={value.idactividadlaboral}>
                    {value.actividadlaboral}
                  </option>
                ))}
            </select>
            {errors.actividadLaboralId && (
              <div className="invalid-tooltip">{errors.actividadLaboralId?.message}</div>
            )}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="region" className="form-label">
              Región (*)
            </label>
            <select
              id="region"
              className={`form-select ${errors.regionId ? 'is-invalid' : ''}`}
              {...register('regionId', {
                validate: validarComboObligatorio(),
                onChange: () => setValue('comunaId', ''),
              })}>
              <option value={''}>Seleccionar</option>
              {regiones &&
                regiones.map(({ idregion, nombre }) => (
                  <option key={idregion} value={idregion}>
                    {nombre}
                  </option>
                ))}
            </select>
            {errors.regionId && <div className="invalid-tooltip">{errors.regionId?.message}</div>}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="comuna" className="form-label">
              Comuna (*)
            </label>
            <select
              id="comuna"
              className={`form-select ${errors.comunaId ? 'is-invalid' : ''}`}
              {...register('comunaId', {
                validate: validarComboObligatorio(),
              })}>
              <option value={''}>Seleccionar</option>
              {comunas &&
                comunas
                  .filter(({ region: { idregion } }) => idregion == regionSeleccionada)
                  .map((value) => (
                    <option key={value.idcomuna} value={value.idcomuna}>
                      {value.nombre}
                    </option>
                  ))}
            </select>
            {errors.comunaId && <div className="invalid-tooltip">{errors.comunaId?.message}</div>}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="calle" className="form-label">
              Calle (*)
            </label>
            <input
              id="calle"
              type="text"
              autoComplete="new-custom-value"
              className={`form-control ${errors.calle ? 'is-invalid' : ''}`}
              {...register('calle', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio',
                },
                minLength: {
                  value: 2,
                  message: 'Debe tener al menos 2 caracteres',
                },
                maxLength: {
                  value: 80,
                  message: 'No puede tener más de 80 caracteres',
                },
                onBlur: () => trimInput('calle'),
              })}
            />
            {errors.calle && <div className="invalid-tooltip">{errors.calle?.message}</div>}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="numero" className="form-label">
              Número (*)
            </label>
            <input
              id="numero"
              type="text"
              className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
              {...register('numero', {
                required: {
                  value: true,
                  message: 'Este campo es obligatorio',
                },
                pattern: {
                  value: /^\d{1,20}$/g,
                  message: 'Debe contener solo dígitos',
                },
                maxLength: {
                  value: 20,
                  message: 'No puede tener más de 20 dígitos',
                },
                onChange: (event) => {
                  const regex = /[^0-9]/g; // Hace match con cualquier caracter que no sea un numero
                  const valor = event.target.value as string;

                  if (regex.test(valor)) {
                    setValue('numero', valor.replaceAll(regex, ''));
                  }
                },
              })}
            />
            {errors.numero && <div className="invalid-tooltip">{errors.numero?.message}</div>}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="blockDepartamento" className="form-label">
              Block / Departamento
            </label>
            <input
              id="blockDepartamento"
              type="text"
              autoComplete="new-custom-value"
              className={`form-control ${errors.block ? 'is-invalid' : ''}`}
              {...register('block', {
                maxLength: {
                  value: 20,
                  message: 'No puede tener más de 20 carcateres',
                },
                pattern: {
                  value: /^[a-zA-Z0-9#]+$/g,
                  message: 'Solo debe tener números, letras o #',
                },
                onBlur: () => trimInput('block'),
              })}
            />
            {errors.block && <div className="invalid-tooltip">{errors.block?.message}</div>}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label className="form-label" htmlFor="telefono1">
              Teléfono 1 (*)
            </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">+56</div>
              </div>
              <input
                id="telefono1"
                type="text"
                autoComplete="new-custom-value"
                className={`form-control ${errors.telefono1 ? 'is-invalid' : ''}`}
                {...register('telefono1', {
                  required: {
                    value: true,
                    message: 'Este campo es obligatorio',
                  },
                  pattern: {
                    value: /^[0-9]{9}$/, // Exactamente 9 digitos
                    message: 'Debe tener 9 dígitos',
                  },
                  onChange: (event: any) => {
                    const regex = /[^0-9]/g; // Hace match con cualquier caracter que no sea un numero
                    let valorFinal = event.target.value as string;

                    if (regex.test(valorFinal)) {
                      valorFinal = valorFinal.replaceAll(regex, '');
                    }

                    if (valorFinal.length > 9) {
                      valorFinal = valorFinal.substring(0, 9);
                    }

                    setValue('telefono1', valorFinal);
                  },
                })}
              />
              {errors.telefono1 && (
                <div className="invalid-tooltip">{errors.telefono1?.message}</div>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label className="form-label" htmlFor="telefono2">
              Teléfono 2
            </label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">+56</div>
              </div>
              <input
                id="telefono2"
                type="text"
                autoComplete="new-custom-value"
                className={`form-control ${errors.telefono2 ? 'is-invalid' : ''}`}
                {...register('telefono2', {
                  pattern: {
                    value: /^[0-9]{9}$/, // Exactamente 9 digitos
                    message: 'Debe tener 9 dígitos',
                  },
                  onChange: (event: any) => {
                    const regex = /[^0-9]/g; // Hace match con cualquier caracter que no sea un numero
                    let valorFinal = event.target.value as string;

                    if (regex.test(valorFinal)) {
                      valorFinal = valorFinal.replaceAll(regex, '');
                    }

                    if (valorFinal.length > 9) {
                      valorFinal = valorFinal.substring(0, 9);
                    }

                    setValue('telefono2', valorFinal);
                  },
                })}
              />
              {errors.telefono2 && (
                <div className="invalid-tooltip">{errors.telefono2?.message}</div>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="position-relative">
              <label htmlFor="email" className="form-label">
                Correo electrónico entidad empleadora (*)
              </label>
              <input
                id="email"
                type="mail"
                placeholder="ejemplo@ejemplo.cl"
                autoComplete="new-custom-value"
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
                    esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
                  },
                })}
              />
              {errors.email && <div className="invalid-tooltip">{errors.email?.message}</div>}
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="emailConfirma" className="form-label">
              Repetir correo electrónico entidad empleadora (*)
            </label>
            <input
              id="emailConfirma"
              type="mail"
              placeholder="ejemplo@ejemplo.cl"
              autoComplete="new-custom-value"
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
                  esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
                  emailCoinciden: (emailConfirmar) => {
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

          {/* NOTA: Columna "fantasma" para mover la parte del numero de personas a una nueva linea */}
          <div className="d-none d-lg-block col-lg-4 d-xl-none"></div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="tamanoEmpresa" className="form-label">
              N° de personas trabajadoras (*)
            </label>
            <select
              id="tamanoEmpresa"
              className={`form-select ${errors.tamanoEmpresaId ? 'is-invalid' : ''}`}
              {...register('tamanoEmpresaId', {
                setValueAs: (v) => parseInt(v, 10),
                validate: validarComboObligatorio(),
              })}>
              <option value={-1}>Seleccionar</option>
              {tamanosDeEmpresas &&
                tamanosDeEmpresas.map(({ idtamanoempresa, descripcion }) => (
                  <option key={idtamanoempresa} value={idtamanoempresa}>
                    {descripcion}
                  </option>
                ))}
            </select>
            {errors.tamanoEmpresaId && (
              <div className="invalid-tooltip">{errors.tamanoEmpresaId?.message}</div>
            )}
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
            <label htmlFor="sistemaRemuneracion" className="form-label">
              Sistema de Remuneración
            </label>
            <select
              id="sistemaRemuneracion"
              className={`form-select ${errors.sistemaRemuneracionId ? 'is-invalid' : ''}`}
              {...register('sistemaRemuneracionId', {
                setValueAs: (v) => parseInt(v, 10),
                validate: validarComboObligatorio(),
              })}>
              <option value={-1}>Seleccionar</option>
              {sistemasDeRemuneracion &&
                sistemasDeRemuneracion.map(({ idsistemaremuneracion, descripcion }) => (
                  <option key={idsistemaremuneracion} value={idsistemaremuneracion}>
                    {descripcion}
                  </option>
                ))}
            </select>
            {errors.sistemaRemuneracionId && (
              <div className="invalid-tooltip">{errors.sistemaRemuneracionId?.message}</div>
            )}
          </div>
        </div>

        <div className="row mt-4">
          <div className="d-flex flex-row-reverse">
            <button type="submit" className={'btn btn-primary'}>
              Siguiente
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AdscripcionPage;
