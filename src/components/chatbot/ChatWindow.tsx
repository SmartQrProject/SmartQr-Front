import React, { useState, useEffect } from "react";
import { socket } from "../../lib/socket";
import { Message, ChatWindowProps } from "./../../types";

export default function ChatWindow({
  messages,
  setMessages,
  close,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.connect();

    const handleReply = (msg: string) => {
      const botMessage: Message = { sender: "bot", text: msg };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    };

    socket.on("bot_reply", handleReply);

    socket.on("connect_error", () => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error de conexión al servidor." },
      ]);
    });

    return () => {
      socket.off("bot_reply", handleReply);
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input) return;
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    socket.emit("chat_message", input);
    setInput("");
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <span>Chat Bot</span>
        <button onClick={close} className="text-xl">
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((m, i) => {
          console.log("🧾 Mensaje recibido:", m); // debug opcional
          return (
            <div
              key={i}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  m.sender === "user"
                    ? "chatbot-message-user"
                    : "chatbot-message-bot"
                }`}
              >
                {typeof m.text === "string" && m.text.trim()
                  ? m.text
                  : "[Mensaje vacío]"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-2 border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe algo..."
          className="chatbot-input"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="chatbot-send-button"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
