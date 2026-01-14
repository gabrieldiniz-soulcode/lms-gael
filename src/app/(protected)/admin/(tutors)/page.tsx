"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "react-bootstrap";
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
    <main className="container container-ajuste mt-5 pt-5" style={{ minHeight: `80vh` }}>
      <section className="d-flex justify-content-between mb-3">
        <h1 className="fw-bold">Tutors</h1>

        <Button
          variant="primary"
          onClick={() => {
            setTutor(null);
            setShowModalTutor(true);
          }}
        >
          Criar novo Tutor
        </Button>
      </section>

      <section className="row">
        {tutors.map((t: any) => (
          <div className="col-3" key={t.id}>
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
    </main>
  );
}
