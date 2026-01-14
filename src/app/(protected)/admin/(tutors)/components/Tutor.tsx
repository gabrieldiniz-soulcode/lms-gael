import { Button } from "react-bootstrap";
import { LiaEdit } from "react-icons/lia";

type TutorProps = {
  name: string;
  welcome_message: string;
  system_prompt: string;
  id: string;
  voice_id?: string;
  setShowModalTutor: (show: boolean) => void;
  setShowModalMapping: (show: boolean) => void;
  setShowModalIngest: (show: boolean) => void; // ✅ novo
  setTutor?: (tutor: any) => void;
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
  setShowModalIngest, // ✅ novo
  setTutor,
  voice_id,
}: TutorProps) {
  const tutorPayload = { id, name, welcome_message, system_prompt, voice_id };

  return (
    <div className="d-flex flex-column p-3 gap-3 container bg-white rounded-3 mb-3 h-100 card">
      <div className="d-flex justify-content-between">
        <span className="fw-bold fs-6">{id}</span>

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
    </div>
  );
}
