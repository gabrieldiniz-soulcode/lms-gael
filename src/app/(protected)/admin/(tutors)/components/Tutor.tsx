import { LiaEdit, LiaTrashAlt } from "react-icons/lia";

import { Button } from "react-bootstrap";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { useState } from "react";

type TutorProps = {
  name: string;
  welcome_message: string;
  system_prompt: string;
  id: string;
  voice_id?: string;
  setShowModalTutor: (show: boolean) => void;
  setShowModalMapping: (show: boolean) => void;
  setShowModalIngest: (show: boolean) => void;
  setTutor?: (tutor: unknown) => void;
  deleteTutor: (tutor: unknown) => void;
};

function truncateString(str: string, maxLength: number): string {
  const ellipsis = "...";
  if (str.length > maxLength) {
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
  }
  return str;
}

export default function Tutor({
  name,
  welcome_message,
  system_prompt,
  id,
  setShowModalTutor,
  setShowModalMapping,
  setShowModalIngest,
  setTutor,
  voice_id,
  deleteTutor
}: TutorProps) {
  const tutorPayload = { id, name, welcome_message, system_prompt, voice_id };
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="d-flex flex-column p-3 gap-3 container bg-white rounded-3 mb-3 h-100 card">
      <div className="d-flex justify-content-between">
        <span className="fw-bold fs-6">{id}</span>
        <div className="d-flex gap-3">
          <Button
            variant="transparent"
            className="p-0" onClick={() => setShowConfirm(true)}>
            <LiaTrashAlt size={24} />
          </Button>
          <Button
            variant="transparent"
            className="p-0"
            onClick={() => {
              setShowModalTutor(true);
              setTutor?.(tutorPayload);
            }}
          >
            <LiaEdit size={24} />
          </Button>
        </div>
      </div>

      <span>{name}</span>
      <span>{truncateString(welcome_message, 50)}</span>
      <span>{truncateString(system_prompt, 100)}</span>

      <div className="h-100 d-flex justify-content-end align-items-end">
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            style={{ fontSize: 14 }}
            onClick={() => {
              setShowModalIngest(true);
              setTutor?.(tutorPayload);
            }}
          >
            Ingerir dados
          </Button>

          <Button
            variant="primary"
            style={{ fontSize: 14 }}
            onClick={() => {
              setShowModalMapping(true);
              setTutor?.(tutorPayload);
            }}
          >
            Associar um Curso
          </Button>
        </div>
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Deletar mapping"
        message={
          <>
            Tem certeza que deseja deletar o mapping do curso <code>{id}</code>?
          </>
        }
        confirmText="Sim, deletar"
        cancelText="Cancelar"
        variant="danger"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => deleteTutor(id)}
      />
    </div>
  );
}
