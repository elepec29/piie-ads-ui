import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './titulo.module.css';

type MyPropsApp = {
  children: ReactNode;
  manual: string;
  url: string;
};

const Titulo: React.FC<MyPropsApp> = ({ children, manual, url }) => {
  return (
    <div className={`row mt-2 ${styles.stagepue}`}>
      <div className="pb-3 border-bottom d-flex align-items-baseline justify-content-between flex-wrap">
        <div>{children}</div>
        <div className="mt-2 mt-xs-0 d-none d-sm-block">
          <Link href={url} target="_blank">
            <h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="var(--color-blue)"
                className="bi bi-info-circle"
                viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </h1>
          </Link>
        </div>
        <div className="mt-2 mt-xs-0 d-block d-sm-none" style={{ marginLeft: 'auto' }}>
          <Link href={url} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="var(--color-blue)"
              className="bi bi-info-circle"
              viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Titulo;
