"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import ModalFindMapping from "./components/ModalFindMapping";
import ModalGenerateMultiple from "./components/ModalGenerateMultiple";
import ModalIngest from "./components/ModalIngest";
import ModalMapping from "./components/ModalMapping";
import ModalTutor from "./components/ModalTutor";
import Tutor from "./components/Tutor";
import { apiTutor } from "@/shared/api/apiTutor";

export default function Page() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [tutor, setTutor] = useState<any | null>(null);

  const [showModalTutor, setShowModalTutor] = useState(false);
  const [showModalMapping, setShowModalMapping] = useState(false);
  const [showModalIngest, setShowModalIngest] = useState(false);
  const [showModalGenerate, setShowModalGenerate] = useState(false);
  const [showModalFindMapping, setShowModalFindMapping] = useState(false);

  const fetchTutors = useCallback(async () => {
    try {
      const res = await apiTutor.get("/tutors");
      setTutors(res.data);
    } catch (error) {
      console.error("Erro ao buscar tutores:", error);
    }
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  return (
    <main className="container container-ajuste mt-5 pt-5 d-flex flex-column justify-content-between row-gap-3" style={{ minHeight: `80vh` }}>
      <section className="d-flex justify-content-between mb-3 flex-wrap">
        <h2 className="fw-bold">Tutores educacionais</h2>

        <div className="d-flex gap-3">
          <Button variant="primary" onClick={() => setShowModalGenerate(true)}>Gerar PDF de conteúdo</Button>
          <Button
            variant="primary"
            onClick={() => {
              setTutor(null);
              setShowModalTutor(true);
            }}
          >
            Criar novo Tutor
          </Button>
        </div>
      </section>

      <section className="row row-gap-3">
        {tutors.map((t: any) => (
          <div className="col-xxl-3 col-xl-4 col-md-6" key={t.id}>
            <Tutor
              {...t}
              setTutor={setTutor}
              setShowModalTutor={setShowModalTutor}
              setShowModalMapping={setShowModalMapping}
              setShowModalIngest={setShowModalIngest}
            />
          </div>
        ))}
      </section>

      <section className="mt-auto mb-2">
        <div className="d-flex gap-3 justify-content-end">
          <Button variant="dark" onClick={() => setShowModalFindMapping(true)}>Buscar Mappings</Button>
          {/* <Button
            variant="danger"
            className="text-white"
            onClick={() => {
              setTutor(null);
              setShowModalTutor(true);
            }}
          >
            Desafazer mapping
          </Button> */}
        </div>
      </section>

      <ModalTutor
        show={showModalTutor}
        onHide={() => {
          setShowModalTutor(false);
          setTutor(null);
        }}
        tutor={tutor}
        onSaved={() => {
          fetchTutors();
          setShowModalTutor(false);
          setTutor(null);
        }}
      />

      <ModalMapping
        show={showModalMapping}
        onHide={() => {
          setShowModalMapping(false);
          setTutor(null);
        }}
        tutorId={tutor?.id}
        onSaved={() => {
          fetchTutors();
          setShowModalMapping(false);
          setTutor(null);
        }}
      />

      <ModalIngest
        show={showModalIngest}
        onHide={() => {
          setShowModalIngest(false);
          setTutor(null);
        }}
        tutorId={tutor?.id}
        onIngested={() => {
          fetchTutors();
          setShowModalIngest(false);
          setTutor(null);
        }}
      />

      <ModalGenerateMultiple
        show={showModalGenerate}
        onHide={() => setShowModalGenerate(false)}
      />

      <ModalFindMapping
        show={showModalFindMapping}
        onHide={() => setShowModalFindMapping(false)}
        onDeleted={(courseId) => console.log("Mapping deletado:", courseId)}
      />
    </main>
  );
}
