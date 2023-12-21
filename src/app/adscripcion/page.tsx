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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { GuiaUsuario } from '@/components/guia-usuario';
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

let InitialGuia = [
  {
    indice: 1,
    nombre: 'Formulario',
    activo: true,
  },
  {
    indice: 2,
    nombre: 'Tipo entidad empleadora',
    activo: false,
  },
  {
    indice: 3,
    nombre: 'CCAF',
    activo: false,
  },
  {
    indice: 4,
    nombre: 'Tamaño Empresa',
    activo: false,
  },
];

const SpinnerPantallaCompleta = React.lazy(() => import('@/components/spinner-pantalla-completa'));

const AdscripcionPage: React.FC<{}> = ({}) => {
  const step = [
    { label: 'Datos Entidad Empleadora', num: 1, active: true, url: '/adscripcion' },
    { label: 'Datos Persona Administradora', num: 2, active: false, url: '/adscripcion/pasodos' },
  ];

  const [listaGuia, setlistaGuia] =
    useState<{ indice: number; nombre: string; activo: boolean }[]>(InitialGuia);

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

  const { datosAdmin, guia, activaDesactivaGuia } = useContext(InscribeContext);

  useEffect(() => {
    setlistaGuia(InitialGuia);
  }, [guia]);

  const target = useRef(null);
  const tipo = useRef(null);
  const CCAF = useRef(null);
  const tamano = useRef(null);

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

    if (typeof window !== 'undefined') {
      if (localStorage.getItem('guia') === null) {
        activaDesactivaGuia();
        localStorage.setItem('guia', '1');
      }
    }

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
          <GuiaUsuario guia={guia && listaGuia[0].activo} placement="top-start" target={target}>
            Datos de la nueva entidad empleadora <br />
            que se desea adscribir &nbsp;
            <br />
            <div className="text-end">
              <button
                className="btn btn-sm text-white"
                onClick={() =>
                  setlistaGuia([
                    { indice: 1, nombre: 'Formulario', activo: false },
                    { indice: 2, nombre: 'Tipo entidad empleadora', activo: true },
                    { indice: 3, nombre: 'CCAF', activo: false },
                    { indice: 4, nombre: 'Tamaño Empresa', activo: false },
                  ])
                }
                style={{
                  border: '1px solid white',
                }}>
                Continuar &nbsp;
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </GuiaUsuario>

          <div
            className={`row mt-3 g-3 align-items-baseline ${
              guia && listaGuia[0].activo && 'overlay-marco'
            }`}
            ref={target}>
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

            <GuiaUsuario guia={guia && listaGuia[1].activo} placement="top-start" target={tipo}>
              Sector al que pertenece la entidad empleadora <br />
              <br />
              <div className="text-end">
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    setlistaGuia([
                      { indice: 1, nombre: 'Formulario', activo: true },
                      { indice: 2, nombre: 'Tipo entidad empleadora', activo: false },
                      { indice: 3, nombre: 'CCAF', activo: false },
                      { indice: 4, nombre: 'Tamaño Empresa', activo: false },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  <i className="bi bi-arrow-left"></i>
                  &nbsp; Anterior
                </button>
                &nbsp;
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    setlistaGuia([
                      { indice: 1, nombre: 'Formulario', activo: false },
                      { indice: 2, nombre: 'Tipo entidad empleadora', activo: false },
                      { indice: 3, nombre: 'CCAF', activo: true },
                      { indice: 4, nombre: 'Tamaño Empresa', activo: false },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  Continuar &nbsp;
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </GuiaUsuario>

            <div
              className={`col-12 col-md-6 col-lg-4 col-xl-3 ${
                guia && listaGuia[1].activo && 'overlay-marco'
              }`}
              ref={tipo}>
              <ComboSimple
                name="tipoEntidadId"
                datos={tiposDeEmpleadores}
                idElemento={'idtipoempleador'}
                descripcion={'tipoempleador'}
                label="Tipo de Entidad Empleadora"
              />
            </div>

            <GuiaUsuario guia={guia && listaGuia[2].activo} placement="top-start" target={CCAF}>
              Cajas de Compensación de Asignación Familiar (CCAF) <br />
              <br />
              <div className="text-end">
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    setlistaGuia([
                      { indice: 1, nombre: 'Formulario', activo: false },
                      { indice: 2, nombre: 'Tipo entidad empleadora', activo: true },
                      { indice: 3, nombre: 'CCAF', activo: false },
                      { indice: 4, nombre: 'Tamaño Empresa', activo: false },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  <i className="bi bi-arrow-left"></i>
                  &nbsp; Anterior
                </button>
                &nbsp;
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    setlistaGuia([
                      { indice: 1, nombre: 'Formulario', activo: false },
                      { indice: 2, nombre: 'Tipo entidad empleadora', activo: false },
                      { indice: 3, nombre: 'CCAF', activo: false },
                      { indice: 4, nombre: 'Tamaño Empresa', activo: true },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  Continuar &nbsp;
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </GuiaUsuario>
            <div
              className={`col-12 col-md-6 col-lg-4 col-xl-3 ${
                guia && listaGuia[2].activo && 'overlay-marco'
              }`}
              ref={CCAF}>
              <ComboSimple
                name="cajaCompensacionId"
                label="Seleccione CCAF a la cual está afiliada"
                datos={cajasDeCompensacion}
                descripcion={'nombre'}
                idElemento={'idccaf'}
              />
            </div>

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

            <GuiaUsuario guia={guia && listaGuia[3].activo} placement="top-start" target={tamano}>
              Cantidad de personas trabajadoras en la entidad empleadora <br />
              <br />
              <div className="text-end">
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    setlistaGuia([
                      { indice: 1, nombre: 'Formulario', activo: false },
                      { indice: 2, nombre: 'Tipo entidad empleadora', activo: false },
                      { indice: 3, nombre: 'CCAF', activo: true },
                      { indice: 4, nombre: 'Tamaño Empresa', activo: false },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  <i className="bi bi-arrow-left"></i>
                  &nbsp; Anterior
                </button>
                &nbsp;
                <button
                  className="btn btn-sm text-white"
                  onClick={() =>
                    setlistaGuia([
                      { indice: 1, nombre: 'Formulario', activo: true },
                      { indice: 2, nombre: 'Tipo entidad empleadora', activo: false },
                      { indice: 3, nombre: 'CCAF', activo: false },
                      { indice: 4, nombre: 'Tamaño Empresa', activo: false },
                    ])
                  }
                  style={{
                    border: '1px solid white',
                  }}>
                  Continuar &nbsp;
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </GuiaUsuario>

            <div
              className={`col-12 col-md-6 col-lg-4 col-xl-3 ${
                guia && listaGuia[3].activo && 'overlay-marco'
              }`}
              ref={tamano}>
              <ComboSimple
                name="tamanoEmpresaId"
                label="Tamaño Entidad Empleadora"
                datos={tamanosDeEmpresas}
                descripcion={'descripcion'}
                idElemento={'idtamanoempresa'}
              />
            </div>

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
