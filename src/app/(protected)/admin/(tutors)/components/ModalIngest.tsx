import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { AxiosError } from "axios";
import { apiTutor } from "@/shared/api/apiTutor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE_MB = 50;

const ACCEPTED_MIME = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/json",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const METADATA_TEMPLATE = `{
  "course": "",
  "module": "",
  "title": "",
  "language": "pt-BR",
  "topics_covered": [],
  "key_concepts": []
}`;

const metadataSchema = z
  .string()
  .trim()
  .min(2, "Metadata é obrigatório.")
  .superRefine((val, ctx) => {
    let parsed: any;

    try {
      parsed = JSON.parse(val);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Metadata deve ser um JSON válido.",
      });
      return;
    }

    const reqString = (key: string) => {
      if (typeof parsed?.[key] !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Campo "${key}" deve ser string.`,
        });
        return;
      }
      if (!parsed[key].trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Campo "${key}" é obrigatório.`,
        });
      }
    };

    reqString("course");
    reqString("module");
    reqString("title");

    if (parsed?.language !== "pt-BR") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Campo "language" deve ser "pt-BR".`,
      });
    }

    if (!Array.isArray(parsed?.topics_covered)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Campo "topics_covered" deve ser um array.`,
      });
    }

    if (!Array.isArray(parsed?.key_concepts)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Campo "key_concepts" deve ser um array.`,
      });
    }
  });


const ingestSchema = z.object({
  file: z
    .custom<FileList>()
    .refine((fl) => fl instanceof FileList && fl.length > 0, "Selecione um arquivo.")
    .refine(
      (fl) => {
        const f = fl?.item?.(0) ?? (fl as any)?.[0];
        if (!f) return true;
        return f.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
      },
      `Arquivo muito grande (máx. ${MAX_FILE_SIZE_MB}MB).`
    )
    .refine(
      (fl) => {
        const f = fl?.item?.(0) ?? (fl as any)?.[0];
        if (!f) return true;
        return !f.type || ACCEPTED_MIME.includes(f.type);
      },
      "Tipo de arquivo não suportado."
    ),

  metadata: metadataSchema,
  module_id: z.string().trim().optional(),
  course: z.string().trim().optional(),

  doc_type_override: z.string().trim().optional(),
  trail: z.string().trim().optional(),
  career: z.string().trim().optional(),
});

type IngestFormValues = z.infer<typeof ingestSchema>;

type ApiErrorShape =
  | { message?: string; error?: string }
  | { errors?: Array<{ field?: string; message?: string }> };

export interface ModalIngestProps {
  show: boolean;
  onHide: () => void;
  tutorId: string | null | undefined;
  onIngested?: (data: unknown) => void;
}


const DEFAULT_VALUES: Partial<IngestFormValues> = {
  metadata: METADATA_TEMPLATE,
  module_id: "",
  course: "",
  doc_type_override: "",
  trail: "",
  career: "",
};

function getAxiosErrorMessage(err: unknown): string {
  const ax = err as AxiosError<ApiErrorShape>;
  const data = ax?.response?.data as any;
  return data?.message || data?.error || ax?.message || "Não foi possível ingerir.";
}

export default function ModalIngest({
  show,
  onHide,
  tutorId,
  onIngested,
}: ModalIngestProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [fileInputKey, setFileInputKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<IngestFormValues>({
    resolver: zodResolver(ingestSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES as any,
  });

  useEffect(() => {
    if (!show) return;
    setServerError(null);
    reset(DEFAULT_VALUES as any);
    setFileInputKey((k) => k + 1);
  }, [show, reset]);

  const fileList = watch("file");
  const selectedFile: File | null =
    fileList instanceof FileList && fileList.length > 0 ? fileList[0] : null;

  const fileHint = useMemo(() => {
    if (!selectedFile) return "Selecione um arquivo para ingestão.";
    const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);
    return `${selectedFile.name} • ${sizeMb} MB`;
  }, [selectedFile]);

  const onSubmit: SubmitHandler<IngestFormValues> = async (values) => {
    if (!tutorId) {
      setServerError("Tutor ID não informado.");
      return;
    }

    const f =
      values.file instanceof FileList && values.file.length > 0
        ? values.file[0]
        : null;

    if (!f) {
      setServerError("Selecione um arquivo.");
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const form = new FormData();
    form.append("file", f);
    form.append("tutor_id", tutorId);

    const opt = (key: string, val?: string) => {
      const v = (val ?? "").trim();
      if (v) form.append(key, v);
    };

    opt("metadata", values.metadata);
    opt("module_id", values.module_id);
    opt("course", values.course);

    try {
      const res = await apiTutor.post("/ingest/file", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onIngested?.(res.data);

      reset(DEFAULT_VALUES as any);
      setFileInputKey((k) => k + 1);
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
          <Modal.Title>Ingestão de dados</Modal.Title>
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
          </div>

          <Form.Group className="mb-3" controlId="ingest-file">
            <Form.Label>Arquivo</Form.Label>
            <Form.Control
              key={fileInputKey}
              type="file"
              disabled={submitting}
              isInvalid={!!errors.file}
              // accept=".pdf,.txt,.md,.json,.csv,.doc,.docx"
              {...register("file")}
            />
            <Form.Text className="text-muted">{fileHint}</Form.Text>
            <Form.Control.Feedback type="invalid">
              {String(errors.file?.message ?? "")}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="ingest-course">
            <Form.Label>Course (opcional)</Form.Label>
            <Form.Control
              type="text"
              placeholder='Ex.: "desenvolvedor python"'
              disabled={submitting}
              isInvalid={!!errors.course}
              {...register("course")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.course?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="ingest-module-id">
            <Form.Label>Module ID (opcional)</Form.Label>
            <Form.Control
              type="text"
              placeholder='Ex.: "primeiros passos com python"'
              disabled={submitting}
              isInvalid={!!errors.module_id}
              {...register("module_id")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.module_id?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-0" controlId="ingest-metadata">
            <Form.Label>Metadata</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder={METADATA_TEMPLATE}
              disabled={submitting}
              isInvalid={!!errors.metadata}
              {...register("metadata")}
            />
            <Form.Text className="text-muted">
              Preencha os campos <code>course</code>, <code>module</code> e <code>title</code>.{" "}
              <code>language</code> deve ficar como <code>pt-BR</code>.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {String(errors.metadata?.message ?? "")}
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
                Enviando…
              </>
            ) : (
              "Ingerir"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
