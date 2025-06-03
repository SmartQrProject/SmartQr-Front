import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../../lib/socket";
import { Message, ChatWindowProps } from "./../../types";
import { X } from "lucide-react";

export default function ChatWindow({ messages, setMessages, close }: ChatWindowProps) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        socket.connect();

        const handleReply = (msg: string) => {
            const botMessage: Message = { sender: "bot", text: msg };
            setMessages((prev) => [...prev, botMessage]);
            setLoading(false);
        };

        socket.on("bot_reply", handleReply);

        socket.on("connect_error", () => {
            setMessages((prev) => [...prev, { sender: "bot", text: "❌ Server connection error." }]);
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

        // const slug = window.location.pathname.split("/").pop() || "default";
        const slug = localStorage.getItem("slug");

        socket.emit("chat_message", { message: input, slug: slug });
        setInput("");
    };

    return (
        <div className="chatbot-window">
            <div className="chatbot-header">
                <span>Chat Bot</span>
                <button onClick={close} className="text-xl cursor-pointer">
                    <X />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`${m.sender === "user" ? "chatbot-message-user" : "chatbot-message-bot"} break-words whitespace-pre-wrap`}>
                            {typeof m.text === "string" && m.text.trim() ? m.text : "[Empty message]"}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-2  flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type something..."
                    className="chatbot-input"
                />
                <button onClick={sendMessage} disabled={loading} className="chatbot-send-button">
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}
