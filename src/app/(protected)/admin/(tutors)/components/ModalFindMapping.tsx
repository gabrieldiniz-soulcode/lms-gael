import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { AxiosError } from "axios";
import { apiTutor } from "@/shared/api/apiTutor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  course_id: z
    .string()
    .trim()
    .min(2, "Informe o course_id.")
  // .regex(
  //   /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  //   'Use minúsculas e hífen (ex.: "primeiros-passos-com-python").'
  // ),
});

type FormValues = z.infer<typeof schema>;

type ApiGetResponse = { tutor_ids: string[] };
type ApiErrorShape =
  | { message?: string; error?: string }
  | { errors?: Array<{ field?: string; message?: string }> };

export interface ModalFindMappingProps {
  show: boolean;
  onHide: () => void;
  onDeleted?: (courseId: string) => void;
}

const DEFAULT_VALUES: FormValues = { course_id: "" };

function getAxiosErrorMessage(err: unknown): string {
  const ax = err as AxiosError<ApiErrorShape>;
  const data = ax?.response?.data as any;
  return data?.message || data?.error || ax?.message || "Erro na requisição.";
}

export default function ModalFindMapping({
  show,
  onHide,
  onDeleted,
}: ModalFindMappingProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [resultTutorIds, setResultTutorIds] = useState<string[] | null>(null);
  const [searchedCourseId, setSearchedCourseId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!show) return;
    setServerError(null);
    setSubmitting(false);
    setDeleting(false);
    setResultTutorIds(null);
    setSearchedCourseId(null);
    reset(DEFAULT_VALUES);
  }, [show, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setSubmitting(true);
    setServerError(null);
    setResultTutorIds(null);
    setSearchedCourseId(null);

    try {
      const res = await apiTutor.get<ApiGetResponse>(
        `/mappings/course/${encodeURIComponent(values.course_id.trim())}`
      );

      setResultTutorIds(res.data?.tutor_ids ?? null);
      setSearchedCourseId(values.course_id.trim());
    } catch (err) {
      setServerError(getAxiosErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!searchedCourseId) return;

    setDeleting(true);
    setServerError(null);

    try {
      await apiTutor.delete(
        `/mappings/course/${encodeURIComponent(searchedCourseId)}`
      );
      onDeleted?.(searchedCourseId);

      setResultTutorIds(null);
      setSearchedCourseId(null);
      reset(DEFAULT_VALUES);
      onHide();
    } catch (err) {
      setServerError(getAxiosErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (submitting || deleting) return;
    onHide();
  };

  const showResult = useMemo(
    () => !!searchedCourseId && !!resultTutorIds,
    [searchedCourseId, resultTutorIds]
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={!submitting && !deleting}
    >
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton={!submitting && !deleting}>
          <Modal.Title>Buscar mapping do curso</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {serverError ? (
            <Alert variant="danger" className="mb-3">
              {serverError}
            </Alert>
          ) : null}

          <Form.Group className="mb-2" controlId="find-course-id">
            <Form.Label>Course ID</Form.Label>
            <Form.Control
              type="text"
              placeholder='Ex.: "primeiros-passos-com-python"'
              disabled={submitting || deleting}
              isInvalid={!!errors.course_id}
              {...register("course_id")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.course_id?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {showResult ? (
            <div className="mt-3 p-3 rounded-3 bg-light">
              <div className="small text-muted mb-1">Resultado</div>
              <div className="d-flex flex-column gap-1">
                <div>
                  <strong>Course ID:</strong>{" "}
                  <code>{searchedCourseId ?? "—"}</code>
                </div>
                {resultTutorIds?.map((tutor) => (
                  <div key={tutor}>
                    <strong>Tutor ID:</strong> <code>{tutor ?? "—"}</code>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Modal.Body>

        <Modal.Footer>
          {showResult ? (
            <>
              <Button
                variant="danger"
                type="button"
                className="text-white"
                onClick={handleDelete}
                disabled={submitting || deleting}
              >
                {deleting ? (
                  <>
                    <Spinner size="sm" className="me-2" animation="border" />
                    Deletando…
                  </>
                ) : (
                  "Deletar mapping"
                )}
              </Button>

              <Button
                variant="secondary"
                type="button"
                onClick={handleClose}
                disabled={submitting || deleting}
              >
                Fechar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                type="button"
                onClick={handleClose}
                disabled={submitting || deleting}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={submitting || deleting || !isDirty || !isValid}
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" animation="border" />
                    Buscando…
                  </>
                ) : (
                  "Buscar"
                )}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
