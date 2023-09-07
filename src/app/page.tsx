import insemp from '@/img/inscribeem.png';

import { ButtonImage } from '@/components/button-image';
import { LoginComponent } from '@/components/login/login-component';

// metadata.title +='- Inicio';

export default function Home() {
  return (
    <div className="bgads">
      <div className="row">
        <div className="col-md-6">
          <ButtonImage url="/adscripcion" text="Inscribe Entidad Empleadora" img={insemp.src} />
        </div>
        <div className="col-md-6">
          {/* <ButtonImage url='/tramitacion' text='Ingreso al portal' img={redcross.src} /> */}

          <LoginComponent buttonText="Ingresar" />
        </div>
      </div>
    </div>
  );
}
