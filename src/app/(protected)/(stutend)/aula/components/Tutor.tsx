import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { AiOutlineSend } from "react-icons/ai";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "react-bootstrap";
import { LuBotMessageSquare } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import { apiTutor } from "@/shared/api/apiTutor";
import axios from "axios";

interface TutorProps {
  curso?: string | null;
  carreira?: string | null;
}

type Sender = "user" | "tutor";

interface Message {
  sender: Sender;
  text: string;
}

interface InitResponse {
  initial_message?: string;
  user_name?: string;
  tutor_name?: string;
}

interface ChatResponse {
  answer?: string;
  selected_tutor_id: string;
}

type ChatHistoryPair = [string, string];

function buildChatHistory(messages: Message[], maxPairs = 12): ChatHistoryPair[] {
  const pairs: ChatHistoryPair[] = [];
  let pendingUser: string | null = null;

  for (const m of messages) {
    if (m.sender === "user") {
      pendingUser = m.text;
    } else if (m.sender === "tutor" && pendingUser !== null) {
      pairs.push([pendingUser, m.text]);
      pendingUser = null;
    }
  }

  return pairs.slice(-maxPairs);
}

export default function Tutor({ curso, carreira }: TutorProps) {
  const { user, perfil } = useContext(AuthContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [userName, setUserName] = useState("Você");
  const [tutorName, setTutorName] = useState("Tutor");
  const [tutorIds, setTutorsIds] = useState();
  const [selectTutorId, setSelectTutorId] = useState<string | null>(null);

  const TUTOR_URL = process.env.NEXT_PUBLIC_TUTOR1_API_URL;

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  // const cursoKey = useMemo(() => (curso ?? "").trim().toLocaleLowerCase().replace(/\s+/g, "-"), [curso]);

  const slugify = (s: string | null | undefined) =>
    (s ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const carreiraKey = useMemo(() => slugify(carreira), [carreira]);

  useEffect(() => {
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!user?.token || !user?.id || !TUTOR_URL || !carreiraKey || !perfil) return;

    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setMessages([]);
      setUserName("Você");
      setTutorName("Tutor");

      try {
        const resTutorId = await apiTutor.get(`/mappings/course/${carreiraKey}`)

        setTutorsIds(resTutorId.data.tutor_ids);

        const res = await axios.get<InitResponse>(`${TUTOR_URL}/chat/init`, {
          params: {
            user_id: perfil.firstname.toLocaleLowerCase(),
            tutor_id: resTutorId.data.tutor_ids[0],
            _ts: Date.now()
          },
        });

        if (cancelled) return;

        const initText = res.data?.initial_message ?? "Olá! 🙂";
        setUserName(res.data?.user_name ?? "Você");
        setTutorName(res.data?.tutor_name ?? "Tutor");
        setMessages([{ sender: "tutor", text: initText }]);
      } catch (err) {
        if (cancelled) return;
        console.error("[chat:init] ERROR", err);
        setMessages([{ sender: "tutor", text: "Olá! 🙂" }]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.token, TUTOR_URL, carreiraKey, perfil]);

  const handleSend = async () => {
    if (!input.trim() || !user?.token || !user?.id || !TUTOR_URL || !curso) return;

    const text = input.trim();
    setInput("");
    setSending(true);

    const userMessage: Message = { sender: "user", text };
    const optimistic = [...messages, userMessage];
    setMessages(optimistic);

    try {
      const chat_history = buildChatHistory(optimistic);

      const res = await axios.post<ChatResponse>(
        `${TUTOR_URL}/chat`,
        {
          user_id: perfil.firstname.toLocaleLowerCase(),
          tutor_id: selectTutorId,
          module_id: curso,
          message: text,
          candidate_tutor_ids: tutorIds,
          chat_history,
          hints: { boost_terms: ["string"], filters: { additionalProp1: {} }, top_k: 8 }
        },
        {
          headers: {

            "Content-Type": "application/json"
          }
        }
      );

      setSelectTutorId(res.data.selected_tutor_id);

      const tutorText = res.data?.answer ?? "...";
      setMessages((prev) => [...prev, { sender: "tutor", text: tutorText }]);
    } catch (err) {
      console.error("[chat] send ERROR", err);
      setMessages((prev) => [...prev, { sender: "tutor", text: "Tive um problema ao responder 😕" }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="row notas">
      <div className="col-12 position-relative">
        <span className="fw-700">
          Chat <LuBotMessageSquare /> Tutor SoulCode
        </span>

        <div className="bg-white p-3 rounded-3 mt-2">
          <div
            ref={chatBoxRef}
            className="chat-box mt-2 p-3 rounded-3"
            style={{ minHeight: 200, maxHeight: 300, overflowY: "auto" }}
          >
            {loading ? (
              <div className="text-center text-muted">Carregando Tutor...</div>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex flex-column ${msg.sender === "user" ? "align-items-end" : "align-items-start"
                    } mb-2`}
                >
                  <p className="mb-1 px-2 fw-bold text-capitalize">
                    {msg.sender === "user" ? userName : tutorName}
                  </p>

                  <div
                    className={`p-2 message-tutor rounded-3 ${msg.sender === "user" ? "bg-primary text-white" : "text-dark"
                      }`}
                    style={{ maxWidth: "75%" }}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">Tire suas dúvidas com {tutorName}!</div>
            )}
          </div>

          <div className="position-relative mt-3 d-flex gap-2">
            <input
              className="w-100 rounded-3 bg-auxiliary6-project p-3 border-0 text-dark"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              placeholder="Pergunte-me qualquer coisa."
            />
            <Button onClick={handleSend} className="send-btn px-3" disabled={sending}>
              {sending ?
                <div className="spinner-border text-white p-1 spinner-border-sm" role="status">
                </div>
                : <AiOutlineSend />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
