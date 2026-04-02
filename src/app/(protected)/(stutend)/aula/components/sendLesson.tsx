"use client";

import { useRef, useState } from "react";
import { db, storage } from "@/lib/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface SendLessonProps {
  email: string;
  lessonId: string;
}

export default function SendLesson({ email, lessonId }: SendLessonProps) {
  const [type, setType] = useState<"link" | "img">("img");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (type === "link" && !link.trim()) {
      setError("Informe um link válido.");
      return;
    }

    if (type === "img" && !file) {
      setError("Selecione uma imagem.");
      return;
    }

    setLoading(true);
    try {
      let finalLink = link;
      let isImg = false;

      if (type === "img" && file) {
        isImg = true;
        const storageRef = ref(
          storage,
          `uploadActivities/${lessonId}/${email}/${Date.now()}_${file.name}`,
        );
        const snapshot = await uploadBytes(storageRef, file);
        finalLink = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "uploadActivities"), {
        email,
        lessonId,
        created_at: serverTimestamp(),
        link: finalLink,
        isImg,
      });

      setSuccess(true);
      setLink("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 p-4 border rounded bg-white">
      <div className="row w-100 p-0 m-0 align-items-center">
        <div className="col-12 col-md-7 border border-top-0 border-bottom-0 border-start-0 border-end-1 p-4">
          <h5>Fala, pessoal! 🚀</h5>
          <p> Chegou o momento de formalizar a conclusão do curso!</p>
          <p>  Para isso, você precisa enviar um print que comprove que finalizou o projeto completo.
            O print deve mostrar:
            •	A tela da plataforma <strong>Godot Engine</strong> aberta
            •	O layout desenvolvido (motoboy + cidade estruturada com segurança)</p>

          <p>
            Depois disso, é só anexar esse print no formulário disponível logo abaixo.
          </p>
          <h6 className="fw-bold">
            ⚠️ Atenção: esse passo é essencial para validar oficialmente a conclusão do seu curso.
          </h6>
        </div>
        <div className="col-12 col-md-5 p-4">
          <h5 className="fw-700 mb-3">Envie sua tarefa</h5>
          <div className="d-flex gap-3 mb-3">
            <button
              type="button"
              className={`btn btn-sm ${type === "img" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => {
                setType("img");
                setError("");
              }}
            >
              Enviar foto
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {type === "link" ? (
              <input
                key="link-input"
                type="url"
                className="form-control mb-3"
                placeholder="Cole o link aqui"
                value={link ?? ""}
                onChange={(e) => setLink(e.target.value)}
              />
            ) : (
              <input
                key="file-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            )}
            {error && <p className="text-danger small mb-2">{error}</p>}
            {success && (
              <p className="text-success small mb-2">Tarefa enviada com sucesso!</p>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
