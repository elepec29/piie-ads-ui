import svg from '@/img/logo-fonasa.svg';
import Link from 'next/link';
import React from 'react';
import styles from './header.module.css';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = ({}) => {
  const nombreCorto = 'Portal Tramitación';

  return (
    <header>
      <nav
        className={`py-3 navbar navbar-expand-lg navbar-dark bg-dark ${styles['navbar-background']}`}>
        <div className="container-lg">
          <div className="w-100 d-flex align-items-center justify-content-between">
            <Link href="/">
              <img src={svg.src} alt="Fonasa" className={styles['logo-fonasa'] + ' img-fluid'} />
            </Link>

            <div
              className={`${styles['spanheader']} d-none d-md-inline-block flex-grow-1 text-center`}>
              <p>Portal Integrado para Entidades Empleadoras (PIEE) de </p>
              <p className="m-0">Tramitación de Licencias Médicas</p>
            </div>

            <div className="w-100 ms-4 d-block d-md-none text-left">
              <p className={'m-0 ' + styles['spanheader']}>{nombreCorto}</p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
