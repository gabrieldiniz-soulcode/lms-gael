import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export interface ChatSummary {
  chat_id: string;
  title: string;
  created_at: number;
};

export interface Message {
  sender: string;
  text: string;
  timestamp: number;
};

export default function Chat() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) return;
    getChatsByUser(userId).then((res) => setChats(res.data.chats));
  }, [userId]);

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    const res = await getChatById(chatId);
    setMessages(res.data.messages || []);
  };

  const getChatsByUser = (userId: string) =>
    axios.get(`${process.env.NEXT_PUBLIC_TUTOR_API_URL}/chat/user/${userId}`);

  const getChatById = (chatId: string) =>
    axios.get(`${process.env.NEXT_PUBLIC_TUTOR_API_URL}/chat/${chatId}`);

  const renameChat = (chatId: string, nome: string) =>
    axios.patch(`${process.env.NEXT_PUBLIC_TUTOR_API_URL}/chat/${chatId}`, {
      nome});

  const deleteChat = (chatId: string) =>
    axios.delete(`${process.env.NEXT_PUBLIC_TUTOR_API_URL}/chat/${chatId}`);

  return (
    <Row className="h-100 py-3 g-3">
      <Col md={3} className="p-0">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={() => {
            setCurrentChatId(null);
            setMessages([]);
          }}
          onDeleteChat={(id) => {
            deleteChat(id).then(() => {
              if (id === currentChatId) {
                setCurrentChatId(null);
                setMessages([]);
              }
              getChatsByUser(userId).then((res) => setChats(res.data.chats));
            });
          }}
          onRenameChat={(id, title) => {
            renameChat(id, title).then(() => {
              getChatsByUser(userId).then((res) => setChats(res.data.chats));
            });
          }}
        />
      </Col>
      <Col md={9} className="d-flex flex-column h-100 p-0">
        <ChatWindow
          chatId={currentChatId}
          messages={messages}
          setMessages={setMessages}
          userId={userId}
          onChatCreated={(newChatId) => {
            setCurrentChatId(newChatId);
            getChatsByUser(userId).then((res) => setChats(res.data.chats));
          }}
        />
      </Col>
    </Row>
  );
}
