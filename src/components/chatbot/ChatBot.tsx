"use client";
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { Message } from "./../../types";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <ChatWindow messages={messages} setMessages={setMessages} close={() => setIsOpen(false)} />
            ) : (
                <button onClick={() => setIsOpen(true)} className="chatbot-button">
                    💬
                </button>
            )}
        </div>
    );
}
