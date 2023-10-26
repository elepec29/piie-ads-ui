import { useRandomId } from '@/hooks/use-random-id';
import ciold from '@/img/ci-antigua.png';
import cinueva from '@/img/ci-nueva.png';
import { validarNumeroDeSerie } from '@/servicios/validar-numero-de-serie';
import React, { useRef, useState } from 'react';
import { Form, FormGroup, Overlay } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { BaseProps } from './base-props';

interface InputNumeroDeSerieProps extends BaseProps {
  opcional?: boolean;
  rutAsociado: string;
}

export const InputNumeroDeSerie: React.FC<InputNumeroDeSerieProps> = ({
  name,
  label,
  opcional,
  rutAsociado,
  className,
}) => {
  const idInput = useRandomId('numeroSerie');

  const target = useRef(null);

  const [show, setShow] = useState(false);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
  } = useFormContext();

  const validaSerie = async (numeroSerie: string) => {
    if (errors[rutAsociado]) {
      return;
    }

    const [rut, dv] = getValues(rutAsociado).split('-');
    if (!rut || !dv) {
      return;
    }

    try {
      await validarNumeroDeSerie({
        rut,
        dv,
        serie: numeroSerie,
      });

      clearErrors(name);
    } catch (error) {
      setError(name, {
        type: 'custom',
        message: 'Debe ingresar un número de serie válido',
      });
    }
  };

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <Form.Label>
          {`${label} (*) `}

          <i
            ref={target}
            className="text-primary bi bi-question-circle"
            onMouseOver={() => setShow(!show)}
            onMouseLeave={() => setShow(!show)}
            onClick={() => setShow(!show)}></i>
          <Overlay target={target.current} show={show} placement="top">
            {({
              placement: _placement,
              arrowProps: _arrowProps,
              show: _show,
              popper: _popper,
              hasDoneInitialMeasure: _hasDoneInitialMeasure,
              ...props
            }) => (
              <div
                {...props}
                style={{
                  position: 'absolute',
                  backgroundColor: 'var(--color-blue)',
                  padding: '2px 10px',
                  color: 'white',
                  borderRadius: 4,
                  ...props.style,
                }}>
                <img width="220px" src={ciold.src}></img>
                <img width="220px" src={cinueva.src}></img>
              </div>
            )}
          </Overlay>
        </Form.Label>

        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={!!errors[name]}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            minLength: {
              value: 9,
              message: 'No puede tener menos de 9 dígitos',
            },
            maxLength: {
              value: 11,
              message: 'No puede tener más de 11 dígitos',
            },
            pattern: {
              value: /^(\d{9}|A\d{10})$/g,
              message: 'Formato debe ser 111222333 o A1234567890',
            },
            onChange: (e: any) => {
              const regex = /[^0-9aA]/g;
              let numeroSerie = (e.target.value ?? '') as string;

              if (regex.test(numeroSerie)) {
                numeroSerie = numeroSerie.replaceAll(regex, '').toUpperCase();
              }

              if (numeroSerie.length > 11) {
                numeroSerie = numeroSerie.substring(0, 11);
              }

              setValue(name, numeroSerie);
            },
            onBlur: (e) => validaSerie(e.target.value),
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {errors[name]?.message?.toString()}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
