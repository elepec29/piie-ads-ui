'use client';

import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputEmail,
  InputNumero,
  InputRazonSocial,
  InputRut,
  InputTelefono,
} from '@/components/form';

import { Stepper } from '@/components/stepper/stepper';
import Titulo from '@/components/titulo';
import { InscribeContext } from '@/contexts';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { Empleador } from '@/modelos/adscripcion';
import { CamposAdscripcionPaso1 } from './(modelos)';
import {
  buscarActividadesLaborales,
  buscarCajasDeCompensacion,
  buscarComunas,
  buscarRegiones,
  buscarRespaldoPaso1,
  buscarSistemasDeRemuneracion,
  buscarTamanosEmpresa,
  buscarTiposDeEmpleadores,
  respaldarPaso1,
} from './(servicios)';

const SpinnerPantallaCompleta = React.lazy(() => import('@/components/spinner-pantalla-completa'));

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

  const formulario = useForm<CamposAdscripcionPaso1>({
    defaultValues: valoresPorDefecto,
    mode: 'onBlur',
  });

  const regionSeleccionada = formulario.watch('regionId');

  // Parchar formulario con datos del local storage
  useEffect(() => {
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
      formulario.setValue(key, campos[key]);
    }

    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      formulario.setValue('comunaId', campos.comunaId);
      setMostrarSpinner(false);
    }, 1000);
  }, [loading]);

  // Guardar cambios al formulario
  useEffect(() => {
    const subscripcion = formulario.watch(
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

  return (
    <>
      <SpinnerPantallaCompleta show={loading || mostrarSpinner} />

      <FormProvider {...formulario}>
        <form
          className={
            'pb-3 px-3 pb-md-4 px-md-4 px-lg-5 bgads needs-validation animate__animated animate__fadeIn' +
            (loading ? ' blur' : '')
          }
          onSubmit={formulario.handleSubmit(onSiguiente)}>
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
            <InputRut name="run" tipo="run" className="col-12 col-md-6 col-lg-4 col-xl-3">
              RUN Entidad Empleadora /
              <br />
              Persona Trabajadora Independiente
            </InputRut>

            <InputRazonSocial
              name="razonSocial"
              label="Razón Social / Nombre"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <ComboSimple
              name="tipoEntidadId"
              datos={tiposDeEmpleadores}
              idElemento={'idtipoempleador'}
              descripcion={'tipoempleador'}
              label="Tipo de Entidad Empleadora"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <ComboSimple
              name="cajaCompensacionId"
              label="Seleccione CCAF a la cual está afiliada"
              datos={cajasDeCompensacion}
              descripcion={'nombre'}
              idElemento={'idccaf'}
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <ComboSimple
              name="actividadLaboralId"
              label="Actividad Laboral Entidad Empleadora"
              datos={actividadesLaborales}
              descripcion={'actividadlaboral'}
              idElemento={'idactividadlaboral'}
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <ComboSimple
              name="regionId"
              label="Región"
              datos={regiones}
              idElemento={'idregion'}
              descripcion={'nombre'}
              tipoValor="string"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <ComboComuna
              name="comunaId"
              label="Comuna"
              comunas={comunas}
              regionSeleccionada={regionSeleccionada}
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <InputCalle name="calle" label="Calle" className="col-12 col-md-6 col-lg-4 col-xl-3" />

            <InputNumero
              name="numero"
              label="Número"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <InputBlockDepartamento
              name="block"
              label="Block / Departamento"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <InputTelefono
              label="Teléfono"
              name="telefono1"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <InputTelefono
              opcional
              name="telefono2"
              label="Teléfono 2"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <InputEmail
              name="email"
              label="Correo electrónico entidad empleadora"
              debeCoincidirCon="emailConfirma"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <InputEmail
              label="Repetir correo electrónico entidad empleadora"
              name="emailConfirma"
              debeCoincidirCon="email"
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            {/* NOTA: Columna "fantasma" para mover la parte del numero de personas a una nueva linea */}
            <div className="d-none d-lg-block col-lg-4 d-xl-none"></div>

            <ComboSimple
              name="tamanoEmpresaId"
              label="Tamaño Entidad Empleadora"
              datos={tamanosDeEmpresas}
              descripcion={'descripcion'}
              idElemento={'idtamanoempresa'}
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />

            <ComboSimple
              name="sistemaRemuneracionId"
              label="Sistema de Remuneración"
              datos={sistemasDeRemuneracion}
              descripcion={'descripcion'}
              idElemento={'idsistemaremuneracion'}
              className="col-12 col-md-6 col-lg-4 col-xl-3"
            />
          </div>

          <div className="row mt-5">
            <div className="d-flex flex-column flex-sm-row flex-sm-row-reverse">
              <button type="submit" className="btn btn-primary">
                Siguiente
              </button>
              <Link href="/" className="btn btn-danger mt-2 mt-sm-0 me-0 me-sm-2">
                Volver
              </Link>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AdscripcionPage;
