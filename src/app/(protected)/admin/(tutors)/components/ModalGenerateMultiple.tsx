import { Alert, Badge, Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { apiConteudo } from "@/shared/api/apiConteudo";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ApiGenerateItem = { pdf_name?: string };
type ApiGenerateResponse = { success?: boolean; count?: number; data?: ApiGenerateItem[] };

const MAX_TOPICS = 10;

const schema = z.object({
  course: z.string().trim().min(2, "Informe o curso."),
  module: z.string().trim().min(2, "Informe o módulo."),
  topics: z.array(z.string().trim().min(1)).min(1, "Inclua pelo menos 1 tópico."),
});

type FormValues = z.infer<typeof schema>;

export interface ModalGenerateMultipleProps {
  show: boolean;
  onHide: () => void;
  defaultCourse?: string;
  defaultModule?: string;
  onDownloaded?: (pdfNames: string[]) => void;
}

const DEFAULT_VALUES: FormValues = {
  course: "",
  module: "",
  topics: [],
};

function normalizeTopic(v: string) {
  return v.trim().replace(/\s+/g, " ");
}

async function downloadPdfByName(pdfName: string) {
  const res = await apiConteudo.get(`/api/download/${encodeURIComponent(pdfName)}`, {
    responseType: "blob",
    headers: { Accept: "application/pdf" },
  });

  const blob = res.data as Blob;
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = pdfName;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 60_000);
}

export default function ModalGenerateMultiple({
  show,
  onHide,
  defaultCourse,
  defaultModule,
  onDownloaded,
}: ModalGenerateMultipleProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [topicInput, setTopicInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  const topics = watch("topics");

  useEffect(() => {
    if (!show) return;

    setServerError(null);
    setSubmitting(false);
    setTopicInput("");

    reset({
      course: defaultCourse?.trim() || "",
      module: defaultModule?.trim() || "",
      topics: [],
    });
  }, [show, reset, defaultCourse, defaultModule]);

  const canAddTopic = useMemo(() => {
    const t = normalizeTopic(topicInput);
    if (!t) return false;
    if ((topics ?? []).includes(t)) return false;
    if ((topics ?? []).length >= MAX_TOPICS) return false;
    return true;
  }, [topicInput, topics]);

  const addTopic = () => {
    const t = normalizeTopic(topicInput);
    if (!t) return;

    const current = topics ?? [];
    if (current.includes(t)) {
      setTopicInput("");
      return;
    }

    if (current.length >= MAX_TOPICS) return;

    setValue("topics", [...current, t], { shouldDirty: true, shouldValidate: true });
    setTopicInput("");
  };

  const removeTopic = (t: string) => {
    const current = topics ?? [];
    setValue(
      "topics",
      current.filter((x) => x !== t),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const clearTopics = () => {
    setValue("topics", [], { shouldDirty: true, shouldValidate: true });
    setTopicInput("");
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await apiConteudo.post<ApiGenerateResponse>("/api/generate-multiple", {
        course: values.course,
        module: values.module,
        topics: values.topics,
      });

      const pdfNames =
        res.data?.data
          ?.map((i) => (i?.pdf_name ?? "").trim())
          .filter((n) => n.length > 0) ?? [];

      if (pdfNames.length === 0) {
        throw new Error("Nenhum pdf_name retornado pela API.");
      }

      for (const name of pdfNames) {
        await downloadPdfByName(name);
      }

      onDownloaded?.(pdfNames);

      reset({
        course: defaultCourse?.trim() || values.course,
        module: defaultModule?.trim() || values.module,
        topics: [],
      });
      setTopicInput("");
      onHide();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível gerar/baixar os PDFs.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onHide();
  };

  const topicsCount = topics?.length ?? 0;

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={!submitting} size="lg">
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Gerar conteúdo e baixar PDFs</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {serverError ? (
            <Alert variant="danger" className="mb-3">
              {serverError}
            </Alert>
          ) : null}

          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="gen-course">
                <Form.Label>Curso</Form.Label>
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
            </div>

            <div className="col-12 col-md-6">
              <Form.Group className="mb-3" controlId="gen-module">
                <Form.Label>Module</Form.Label>
                <Form.Control
                  type="text"
                  placeholder='Ex.: "primeiros passos com python"'
                  disabled={submitting}
                  isInvalid={!!errors.module}
                  {...register("module")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.module?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mb-2">
            <Form.Label className="mb-0">Tópicos</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">
                {topicsCount}/{MAX_TOPICS}
              </span>
              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                disabled={submitting || topicsCount === 0}
                onClick={clearTopics}
              >
                Limpar tudo
              </Button>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder='Digite um tópico e clique em "Incluir"'
              disabled={submitting}
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (canAddTopic) addTopic();
                }
              }}
            />
            <Button
              variant="outline-primary"
              type="button"
              disabled={submitting || !canAddTopic}
              onClick={addTopic}
            >
              Incluir
            </Button>
          </div>

          {errors.topics ? (
            <div className="text-danger small mt-2">{String(errors.topics.message)}</div>
          ) : (
            <div className="text-muted small mt-2">Adicione pelo menos 1 tópico.</div>
          )}

          <div className="d-flex flex-wrap gap-2 mt-3">
            {topicsCount === 0 ? (
              <span className="text-muted small">Nenhum tópico incluído ainda.</span>
            ) : (
              topics.map((t) => (
                <Badge
                  key={t}
                  bg="secondary"
                  className="d-inline-flex align-items-center gap-2"
                  style={{ padding: "8px 10px" }}
                >
                  <span>{t}</span>
                  <Button
                    type="button"
                    variant="light"
                    size="sm"
                    disabled={submitting}
                    onClick={() => removeTopic(t)}
                    style={{ lineHeight: 1, padding: "0 6px" }}
                    aria-label={`Remover tópico ${t}`}
                  >
                    ×
                  </Button>
                </Badge>
              ))
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={submitting || !isDirty || !isValid || topicsCount === 0}
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="me-2" animation="border" />
                Gerando…
              </>
            ) : (
              "Gerar e baixar"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
