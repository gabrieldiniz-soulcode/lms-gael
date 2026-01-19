import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { apiTutor } from "@/shared/api/apiTutor";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const tutorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(80, "Máximo de 80 caracteres."),
  system_prompt: z
    .string()
    .trim()
    .min(10, "O system prompt deve ter pelo menos 10 caracteres.")
    .max(4000, "Máximo de 4000 caracteres."),
  welcome_message: z
    .string()
    .trim()
    .min(2, "A mensagem de boas-vindas deve ter pelo menos 2 caracteres.")
    .max(500, "Máximo de 500 caracteres."),
  voice_id: z
    .string()
    .trim()
    .optional()
});

const DEFAULT_VALUES = {
  name: "",
  system_prompt: "",
  welcome_message: "Saudações, {user_name}!",
  voice_id: "pt-BR-Wavenet-B"
};

type ModalTutorProps = {
  show: boolean;
  onHide: () => void;
  tutor?: any | null;
  onSaved?: (data?: any) => void;
};

export default function ModalTutor({
  show,
  onHide,
  tutor,
  onSaved
}: ModalTutorProps) {
  const [serverError, setServerError] = useState<any>();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(tutorSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (show) {
      setServerError(null);
      if (tutor) {
        reset(tutor);
        return;
      }
      reset(DEFAULT_VALUES);
    }
  }, [show, reset]);

  async function onSubmit(values: any) {
    setSubmitting(true);
    setServerError(null);

    console.log(values)

    const payload = {
      name: values.name.trim(),
      system_prompt: values.system_prompt.trim(),
      welcome_message: values.welcome_message.trim(),
      voice_id: values.voice_id.trim(),
    };

    try {
      if (tutor) {
        await apiTutor.put(`/tutors/${tutor.id}`, payload);
        onSaved?.();
      }
      else {
        await apiTutor.post(`/tutors`, payload);
        onSaved?.();
      }


      reset(DEFAULT_VALUES);
      onHide?.();
    } catch (err) {
      reset(DEFAULT_VALUES);
      setSubmitting(false);
      setServerError(JSON.stringify(err || {}));
    } finally {
      setSubmitting(false);
    }
  }

  const handleClose = () => {
    if (submitting) return;
    onHide?.();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={!submitting}>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>{tutor ? "Editar" : "Cadastrar"} tutor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {serverError ? (
            <Alert variant="danger" className="mb-3">
              {serverError}
            </Alert>
          ) : null}

          <Form.Group className="mb-3" controlId="tutor-name">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder='Ex.: "Professor Newton"'
              autoComplete="off"
              disabled={submitting}
              isInvalid={!!errors.name}
              {...register("name")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="tutor-system-prompt">
            <Form.Label>System prompt</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder='Ex.: "Você é o Professor Newton..."'
              disabled={submitting}
              isInvalid={!!errors.system_prompt}
              {...register("system_prompt")}
            />
            <Form.Text className="text-muted">
              Dica: defina persona, regras e estilo do tutor.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.system_prompt?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="tutor-welcome-message">
            <Form.Label>Mensagem de boas-vindas</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex.: Saudações, {user_name}!"
              disabled={submitting}
              isInvalid={!!errors.welcome_message}
              {...register("welcome_message")}
            />
            <Form.Text className="text-muted">
              Você pode usar <code>{"{user_name}"}</code> para personalizar.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.welcome_message?.message}
            </Form.Control.Feedback>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={submitting || !isDirty || !isValid}
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="me-2" animation="border" />
                Salvando…
              </>
            ) : (
              tutor ? "Editar" : "Cadastrar"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
