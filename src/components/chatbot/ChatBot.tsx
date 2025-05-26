"use client";
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { Message } from "./../../types";
import { usePathname } from "next/navigation";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const pathname = usePathname();

    const isOnRestaurantPage = pathname.startsWith("/menu/");

    if (!isOnRestaurantPage) return null;

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
