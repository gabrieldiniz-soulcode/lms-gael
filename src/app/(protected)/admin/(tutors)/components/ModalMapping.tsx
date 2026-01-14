import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import { apiTutor } from "@/shared/api/apiTutor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const mappingSchema = z.object({
  course_id: z
    .string()
    .trim()
    .min(2, "Informe o Course ID.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Use apenas minúsculas, números e hífen (ex.: "desenvolvedor-python").'
    ),
  course_name: z
    .string()
    .trim()
    .min(2, "Informe o nome do curso.")
    .max(120, "Máximo de 120 caracteres."),
});

type MappingFormValues = z.infer<typeof mappingSchema>;

type VoiceMappingApiResponse = unknown;

type ApiErrorShape =
  | { message?: string; error?: string }
  | { errors?: Array<{ field?: string; message?: string }> };

export interface ModalCourseTutorMappingProps {
  show: boolean;
  onHide: () => void;
  tutorId: string | null | undefined;
  onSaved?: (data: VoiceMappingApiResponse) => void;
}

const DEFAULT_VALUES: MappingFormValues = {
  course_id: "",
  course_name: "",
};

function slugify(text: string): string {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getAxiosErrorMessage(err: unknown): string {
  const ax = err as AxiosError<ApiErrorShape>;
  const data = ax?.response?.data as any;
  return (
    data?.message ||
    data?.error ||
    ax?.message ||
    "Não foi possível salvar o mapeamento."
  );
}

export default function ModalMapping({
  show,
  onHide,
  tutorId,
  onSaved,
}: ModalCourseTutorMappingProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<MappingFormValues>({
    resolver: zodResolver(mappingSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!show) return;
    setServerError(null);
    reset(DEFAULT_VALUES);
  }, [show, reset]);

  const courseName = watch("course_name");
  const courseId = watch("course_id");

  useEffect(() => {
    if (!show) return;
    const currentId = (courseId ?? "").trim();
    if (courseName && !currentId) {
      setValue("course_id", slugify(courseName), { shouldDirty: true });
    }
  }, [courseName, courseId, setValue, show]);

  const hintExample = useMemo(
    () => 'Ex.: "Desenvolvedor Python" → desenvolvedor-python',
    []
  );

  const onSubmit: SubmitHandler<MappingFormValues> = async (values) => {
    if (!tutorId) {
      setServerError("Tutor ID não informado.");
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const payload = {
      course_id: values.course_id.trim(),
      tutor_id: tutorId,
      course_title: values.course_name.trim(),
    };

    try {
      const res = await apiTutor.post('/mappings', payload);
      onSaved?.(res.data);
      reset(DEFAULT_VALUES);
      onHide();
    } catch (err) {
      setServerError(getAxiosErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={!submitting}
    >
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Mapear curso para tutor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {serverError ? (
            <Alert variant="danger" className="mb-3">
              {serverError}
            </Alert>
          ) : null}

          <div className="small text-muted mb-3">
            <div>
              <strong>Tutor ID:</strong> <code>{tutorId ?? "—"}</code>
            </div>
            <div className="mt-1">
              <strong>Course ID</strong> é o nome do curso em minúsculo com{" "}
              <code>-</code>.
              <div className="mt-1">{hintExample}</div>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="mapping-course-name">
            <Form.Label>Course name</Form.Label>
            <Form.Control
              type="text"
              placeholder='Ex.: "Desenvolvedor Python"'
              autoComplete="off"
              disabled={submitting}
              isInvalid={!!errors.course_name}
              {...register("course_name")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.course_name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2" controlId="mapping-course-id">
            <Form.Label>Course ID</Form.Label>
            <Form.Control
              type="text"
              placeholder='Ex.: "desenvolvedor-python"'
              autoComplete="off"
              disabled={submitting}
              isInvalid={!!errors.course_id}
              {...register("course_id")}
            />
            <Form.Text className="text-muted">
              Use minúsculas e hífen. {hintExample}
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.course_id?.message}
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
            disabled={submitting || !tutorId || !isDirty || !isValid}
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="me-2" animation="border" />
                Salvando…
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
