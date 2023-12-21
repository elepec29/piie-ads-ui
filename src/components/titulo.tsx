import { InscribeContext } from '@/contexts';
import { ReactNode, useContext } from 'react';
import styles from './titulo.module.css';

type MyPropsApp = {
  children: ReactNode;
  manual: string;
  url: string;
};

const Titulo: React.FC<MyPropsApp> = ({ children, manual, url }) => {
  const { activaDesactivaGuia, guia } = useContext(InscribeContext);
  return (
    <div className={`row mt-2 ${styles.stagepue}`}>
      <div className="pb-3 border-bottom d-flex align-items-baseline justify-content-between flex-wrap">
        <div>{children}</div>
        <div
          className="mt-2 mt-xs-0 d-none d-sm-block"
          onClick={() => activaDesactivaGuia()}
          style={{ cursor: 'pointer' }}
          title={guia ? 'Desactivar guía' : 'Activar guía'}>
          <h1>
            {guia ? (
              <i className="bi bi-info-circle-fill" style={{ color: 'var(--color-blue)' }}></i>
            ) : (
              <i className="bi bi-info-circle" style={{ color: 'var(--color-blue)' }}></i>
            )}
          </h1>
        </div>
        <div
          className="mt-2 mt-xs-0 d-block d-sm-none"
          onClick={() => activaDesactivaGuia()}
          title={guia ? 'Desactivar guía' : 'Activar guía'}
          style={{ cursor: 'pointer' }}>
          {guia ? (
            <i className="bi bi-info-circle-fill" style={{ color: 'var(--color-blue)' }}></i>
          ) : (
            <i className="bi bi-info-circle" style={{ color: 'var(--color-blue)' }}></i>
          )}
        </div>
      </div>
    </div>
  );
};

export default Titulo;
