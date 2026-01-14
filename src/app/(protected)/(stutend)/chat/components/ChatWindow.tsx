import { useEffect, useRef, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Message } from "./Chat";
import ReactMarkdown from "react-markdown";
import modeloAvatar from "/public/modelo-ia.jpeg";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import CopyButton from "./CopyButton";
import axios from "axios";

interface ChatWindowProps {
  chatId: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userId: string;
  onChatCreated: (chatId: string) => void;
}

export default function ChatWindow({
  chatId,
  messages,
  setMessages,
  userId,
  onChatCreated,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const pergunta = input.trim();

    const novaMensagem: Message = {
      sender: "user",
      text: pergunta,
      timestamp: Date.now() / 1000,
    };

    setMessages([...messages, novaMensagem]);
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage({
        pergunta,
        user_id: String(userId),
        chat_id: chatId || undefined,
      });

      const resposta: Message = {
        sender: "model",
        text: res.data.resposta,
        timestamp: Date.now() / 1000,
      };

      setMessages((prev) => [...prev, resposta]);

      if (!chatId && res.data.chat_id) {
        onChatCreated(res.data.chat_id);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (data: {
    pergunta: string;
    user_id: string;
    chat_id?: string;
  }) => axios.post(`${process.env.NEXT_PUBLIC_TUTOR_API_URL}/chat`, data);

  return (
    <div
      className="d-flex flex-column h-100 px-3"
      style={{ maxHeight: "calc(100vh - 270px)" }}
    >
      <div className="flex-grow-1 mb-3 bg-body-tertiary rounded p-3 chat-messages-container">
        {messages.length === 0 && (
          <div className="d-flex align-items-center justify-content-center flex-column">
            <Image
              src={modeloAvatar.src}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-circle me-2 flex-shrink-0"
              style={{ objectFit: "cover" }}
            />
            <div className="bg-light p-3 rounded">
              <p className="mb-0 text-muted">
                Olá! Eu sou seu tutor. Me pergunte qualquer coisa.
              </p>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-${msg.sender === "user" ? "end" : "start d-flex"
              } mb-2`}
          >
            {msg.sender === "model" && (
              <Image
                src={modeloAvatar.src}
                alt="Modelo"
                className="me-2 rounded-circle flex-shrink-0 d-none d-md-block"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px", objectFit: "cover" }}
              />
            )}
            <div
              className={`d-inline-block px-3 py-2 rounded ${msg.sender === "user"
                ? "bg-primary text-white"
                : "bg-light message"
                }`}
            >
              {msg.sender === "model" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children, ...props }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    code({
                      inline,
                      className,
                      children,
                      ...props
                    }: {
                      inline?: boolean;
                      className?: string;
                      children?: React.ReactNode;
                    }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");
                      return !inline && match ? (
                        <div className="relative">
                          <CopyButton code={codeString} />
                          <SyntaxHighlighter
                            style={theme}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              borderRadius: "8px",
                              padding: "12px",
                              maxWidth: "100%",
                            }}
                            wrapLongLines={true}
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code
                          className="bg-light px-1 py-0 rounded text-danger"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <Form onSubmit={handleSend}>
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="ms-2">
            {loading ? (
              <Spinner className="text-light" animation="border" size="sm" />
            ) : (
              "Enviar"
            )}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
