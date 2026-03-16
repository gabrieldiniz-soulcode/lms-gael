import { useState } from "react";
import {
  ListGroup,
  Button,
  Modal,
  Form} from "react-bootstrap";
import { GoPencil, GoTrash } from "react-icons/go";
import { ChatSummary } from "./Chat";


interface ChatSidebarProps {
  chats: ChatSummary[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export default function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat}: ChatSidebarProps) {
  const [modalChatId, setModalChatId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"rename" | "delete" | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleRename = (chatId: string, currentTitle: string) => {
    setModalChatId(chatId);
    setModalMode("rename");
    setNewTitle(currentTitle);
  };

  const handleDelete = (chatId: string) => {
    setModalChatId(chatId);
    setModalMode("delete");
  };

  const closeModal = () => {
    setModalChatId(null);
    setModalMode(null);
    setNewTitle("");
  };

  return (
    <div className="h-100 d-flex flex-column bg-light-subtle p-3 rounded">
      <div className="mb-3">
        <Button variant="primary" className="w-100" onClick={onNewChat}>
          + Novo Chat
        </Button>
      </div>

      <ListGroup variant="flush" className="overflow-auto flex-grow-1 bg-transparent">
        {chats.map((chat) => (
          <ListGroup.Item
            key={chat.chat_id}
            action
            active={chat.chat_id === currentChatId}
            onClick={() => onSelectChat(chat.chat_id)}
            className={"d-flex justify-content-between align-items-center " + (chat.chat_id !== currentChatId && "bg-transparent")}
          >
            <span className={`text-truncate ${chat.chat_id === currentChatId ? 'text-secondary':'text-primary'}`}>{chat.title || "Chat sem título"}</span>

            <span
              className="ms-2 d-flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                role="button"
                className="text-secondary"
                onClick={() => handleRename(chat.chat_id, chat.title || "")}
              >
                <GoPencil color={chat.chat_id === currentChatId ? '#fff':'#00ff'} size={20} strokeWidth={0.5} />
              </span>
              <span
                role="button"
                className="text-secondary"
                onClick={() => handleDelete(chat.chat_id)}
              >
                <GoTrash color={chat.chat_id === currentChatId ? '#fff':'#00ff'} size={20} strokeWidth={0.5} />
              </span>
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>


      <Modal show={!!modalMode} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "rename" ? "Renomear Chat" : "Excluir Chat"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === "rename" ? (
            <Form.Control
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Digite o novo título"
            />
          ) : (
            <p>Tem certeza que deseja excluir este chat?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          {modalMode === "rename" ? (
            <Button
              variant="primary"
              onClick={() => {
                if (modalChatId && newTitle.trim()) {
                  onRenameChat(modalChatId, newTitle.trim());
                  closeModal();
                }
              }}
            >
              Salvar
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={() => {
                if (modalChatId) {
                  onDeleteChat(modalChatId);
                  closeModal();
                }
              }}
            >
              Excluir
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
