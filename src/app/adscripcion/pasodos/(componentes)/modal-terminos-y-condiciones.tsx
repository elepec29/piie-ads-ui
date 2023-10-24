import React from 'react';
import { Modal } from 'react-bootstrap';

interface ModalTerminosAndCondicionesProps {
  show: boolean;

  /** Modal se cierra desde la `X` en el titulo, se presiona el backdrop o se prsiona `ESC` */
  onCerrar: () => void;

  /** Cuando se presiona el boton `Aceptar` */
  onTerminosAceptados: () => void;

  /** Cuando se presiona el boton `Rechazar` */
  onRechazarTerminos: () => void;
}

const ModalTerminosAndCondiciones: React.FC<ModalTerminosAndCondicionesProps> = ({
  show,
  onCerrar,
  onTerminosAceptados,
  onRechazarTerminos,
}) => {
  return (
    <>
      <Modal
        show={show}
        size="xl"
        scrollable
        centered
        keyboard
        onHide={onCerrar}
        onEscapeKeyDown={onCerrar}>
        <Modal.Header closeButton>Términos y Condiciones</Modal.Header>

        <Modal.Body>
          <div style={{ fontSize: '16px' }}>
            <p>
              {' '}
              1° El acceso a la plataforma de tramitación de licencia médica electrónica de FONASA,
              la navegación y uso del mismo, así como cualquier espacio habilitado para
              interaccionar, conferirá a las personas la condición de “usuario”. Por lo tanto, desde
              el momento de acceder a la plataforma o a sus contenidos, el usuario acepta los
              presentes Términos y Condiciones, así como también todo tipo de futuras modificaciones
              que se hicieran a los Términos y Condiciones, sin pericio de lo que pudiera establecer
              futura legislación dictada en la República de Chile destinada a regular esta clase de
              documentos o que fuera aplicable al uso de la plataforma.
            </p>
            <p>
              {' '}
              2° El acceso y uso de la plataforma así como su contenido, se regirá íntegramente por
              las Leyes de la República de Chile; por consiguiente, las visitas y accesos que los
              usuarios realicen a la plataforma y los efectos jurídicos que estos pudieran tener,
              quedan sometidos a las leyes y a la jurisdicción de los Tribunales de Justicia de la
              República de Chile. De particular importancia resultan la aplicación de la Ley de
              Protección de Datos Personales N° 19.628.
            </p>
            <p>
              {' '}
              3° Al ingresar a la plataforma el “usuario” asume su responsabilidad por el correcto
              uso de la misma y sus contenidos. Así, esta responsabilidad se extenderá, de forma NO
              taxativa, a:{' '}
            </p>
            <p>
              {' '}
              a. Usar la información, contenidos y/o servicios ofrecidos por la plataforma de
              acuerdo a estos Términos y Condiciones, así como al ordenamiento jurídico chileno, de
              manera correcta, evitando actos o conductas que de cualquier forma pudieran acarrear
              la vulneración de derechos de terceros, o el funcionamiento y operaciones normales de
              la plataforma.{' '}
            </p>
            <p>
              {' '}
              b. La veracidad y licitud de los datos e información aportados por el “usuario” tanto
              en el registro como en el uso de la plataforma. Al acceder a la plataforma, los
              usuarios garantizan que la información que proporcionan para ingresar es veraz,
              completa, exacta y actualizada. FONASA presume que los datos incorporados por los
              usuarios son correctos y exactos.{' '}
            </p>
            <p>
              {' '}
              4° El acceso y uso de la plataforma, no supone una relación comercial entre FONASA y
              el “usuario”.{' '}
            </p>
            <p>
              {' '}
              5° El “usuario” declara ser mayor de edad y, en consecuencia, tener la capacidad legal
              suficiente y necesaria para vincularse a los Términos y Condiciones. Por lo tanto, la
              plataforma no se dirige a menores de edad, declinando cualquier responsabilidad por el
              incumplimiento de este requisito. Aun así, las reglas generales sobre capacidad
              establecidas en el ordenamiento jurídico regirán en todos aquellos casos donde su
              aplicación sea pertinente. Por tanto, si una persona no tiene capacidad legal para
              contratar, debe abstenerse de utilizar los servicios de la plataforma, so pena de
              suspender en cualquier momento de manera temporal o definitiva, la participación de
              usuarios sobre los cuales se compruebe que carecen de capacidad legal para usar los
              servicios y contenidos de la plataforma, o que proporcionen información falsa,
              inexacta o fraudulenta a la plataforma.
            </p>
            <p>
              {' '}
              6° El usuario gozará de todos los derechos que le reconoce la legislación
              adicionalmente a los derechos que le otorgan estos Términos y Condiciones; además el
              usuario dispondrá en todo momento de los derechos de información, rectificación y
              cancelación de los datos personales conforme a la Ley N° 19.628 sobre Protección de
              Datos Personales.
            </p>
            <p> 7° FONASA no responderá, en ningún caso por los siguientes hechos:</p>
            <p>
              {' '}
              a. Uso indebido que los “usuarios” realicen del contenido almacenado, así como de los
              derechos de propiedad industrial o intelectual contenidos en la plataforma.
            </p>
            <p>
              {' '}
              b. Daños y perjuicios, concretos o eventuales, causados a “usuarios” derivados del
              funcionamiento de las herramientas de la plataforma, así como errores generados por
              elementos técnicos de la plataforma.
            </p>
            <p>
              {' '}
              c. Perdida, mal uso o uso no autorizado de contraseñas, sea por parte del “usuario” o
              de un tercero. De la misma forma, se deja constancia que el soporte computacional
              entregado por la plataforma no es infalible, por lo tanto, pueden verificarse
              circunstancias ajenas a la voluntad de FONASA que puedan causar que la plataforma no
              se encuentre operativa durante un cierto período de tiempo; no obstante, se adoptarán
              todas las medidas para restablecer el correcto funcionamiento de la plataforma lo más
              pronto posible, sin que pudiera imputársele algún tipo de responsabilidad por aquello.
              FONASA no asegura disponibilidad ni continuidad de funcionamiento de la plataforma, y
              tampoco que en cualquier momento, los “usuarios” puedan acceder a ella.
            </p>
            <p>
              {' '}
              d. FONASA tampoco es responsable por la existencia de virus u otros elementos
              perjudiciales en los documentos o archivos almacenados en los sistemas informáticos de
              propiedad de los “usuarios”. FONASA no responderá de perjuicios causados al “usuario”,
              derivados del uso indebido de las tecnologías y plataformas puestas a su disposición,
              cualquiera sea la forma en que se utilicen inadecuadamente estos elementos
              tecnológicos. Asimismo, FONASA no responderá por daños producidos por el uso indebido
              o mala fe de los “usuarios” al utilizar la plataforma.
            </p>
            <p>
              {' '}
              8° FONASA y el administrador de la plataforma, adoptarán todas las medidas necesarias
              para resguardar los datos de sus “usuarios” evitando la existencia de posibles
              fraudes. De acuerdo a lo establecido en la Ley N° 19.628 de Protección de Datos
              Personales, los datos de este tipo que se suministren a la plataforma, pasan a formar
              parte de una base de datos perteneciente exclusivamente a FONASA, y serán destinado
              única y exclusivamente para los fines que motivaron su entrega, esto es, la
              tramitación de la licencia médica electrónica.
            </p>
            <p>
              {' '}
              9° Una vez que los “usuarios” se inscriban en este portal para la tramitación de las
              licencias médicas electrónicas, será responsabilidad de los usuarios tramitarla
              oportunamente en dicho portal de manera de garantizar su pago al trabajador.
            </p>
            <p>
              {' '}
              10° Una vez que los “usuarios” se inscriban en el portal, aceptan que las licencias
              médicas electrónicas sean tramitadas por los operadores con los cuales FONASA tenga
              suscrito convenios para estos efectos. Se recomienda al usuario leer detenidamente el
              contenido de estos Términos y Condiciones para su conveniencia y seguridad.
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex flex-column flex-md-row align-items-end align-items-md-baseline justify-content-between">
          <div className="text-primary mb-2 mb-md-0 align-self-start" style={{ cursor: 'pointer' }}>
            {/* Descomentar la descarga cuando se implemente */}
            {/* <small className="text-break">Descargar términos y condiciones</small> */}
          </div>
          <div>
            <button type="button" className="btn btn-danger" onClick={onRechazarTerminos}>
              Rechazar
            </button>
            <button type="button" className="ms-2 btn btn-primary" onClick={onTerminosAceptados}>
              Aceptar
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalTerminosAndCondiciones;
