'use client';

import Link from 'next/link';

export default function Finalizar() {
  return (
    <div
      className="bgads"
      style={{
        paddingTop: '2%',
      }}>
      <div className="container text-center">
        <div
          className="row mt-2"
          style={{
            placeContent: 'center',
          }}>
          {/* <img style={{
                    height: '250px',
                    width: '300px',
                }} src="/4.png"></img> */}
        </div>
        <div className="row mt-3">
          <h4>¡Datos cargados exitosamente!</h4>
          <p>
            Se ha enviado un mail de confirmación al correo del Administrador, para que pueda
            ingresar al Portal de Tramitación de Licencias Médicas de empleadores.
            <br />
            Verifique su correo para validar su cuenta.
          </p>
        </div>

        <div className="row justify-content-md-center">
          <div className="col-md-4 mb-5">
            <Link href={'/'} className={'btn btn-primary'}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
