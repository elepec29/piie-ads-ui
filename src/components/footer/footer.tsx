import React from 'react';
import styles from './footer.module.css';

interface AppFooterProps {
  children: React.ReactNode;
}

const AppFooter: React.FC<AppFooterProps> = ({ children }) => {
  return (
    <footer className={styles['footer-container']}>
      <div className={styles['footer-background']}>
        <div className={styles['footer-top']}></div>
        <div className="row" style={{ height: '125px' }}>
          <div className="col-12">
            <div className={styles['footer-content']}>
              <div className={styles['contact']}>
                <span>Teléfono:</span>&nbsp;<a href="tel:+56227149554">+56227149554</a> -{' '}
                <span>Email:</span>{' '}
                <a href="mailto:soportempleador@fonasa.gov.cl">soportempleador@fonasa.gov.cl</a>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
