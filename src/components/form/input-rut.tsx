'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import IfContainer from '../if-container';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputRutProps extends InputReciclableBase {
  /** Define si usar RUT o RUN en los mensajes de error (defecto: `rut`) */
  tipo?: 'rut' | 'run';

  omitirSignoObligatorio?: boolean;

  children?: React.ReactNode;

  omitirLabel?: boolean;
}

export const InputRut: React.FC<InputRutProps> = ({
  name,
  className,
  label,
  children,
  tipo,
  deshabilitado,
  opcional,
  omitirSignoObligatorio,
  omitirLabel,
}) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    name,
    prefijoId: 'rut',
    label: {
      texto: label,
      opcional,
      omitirSignoObligatorio,
    },
  });

  const tipoInput = () => (!tipo || tipo === 'rut' ? 'RUT' : 'RUN');

  return (
    <>
      <Form.Group className={`${className ?? ''} position-relative`} controlId={idInput}>
        <IfContainer show={!omitirLabel}>
          <Form.Label>{children ?? textoLabel}</Form.Label>
        </IfContainer>

        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          disabled={deshabilitado}
          {...register(name, {
            required: {
              value: !opcional,
              message: `El ${tipoInput()} es obligatorio`,
            },
            validate: {
              esRut: (rut) => {
                if (opcional && rut === '') {
                  return;
                }

                if (!validateRut(rut)) {
                  return `El ${tipoInput()} es inválido`;
                }
              },
            },
            onChange: (event: any) => {
              const regex = /[^0-9kK\-]/g; // solo números, guiones y la letra K
              let rut = event.target.value as string;

              if (regex.test(rut)) {
                rut = rut.replaceAll(regex, '');
              }

              if (rut.length > 10) {
                rut = rut.substring(0, 10);
              }

              setValue(name, rut.length > 2 ? formatRut(rut, false) : rut);
            },
            onBlur: (event) => {
              const rut = event.target.value;
              if (validateRut(rut)) {
                setValue(name, formatRut(rut, false));
              }
            },
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeError}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
};
