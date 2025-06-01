"use client";
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { Message } from "./../../types";
import { usePathname } from "next/navigation";
import { GiChatBubble } from "react-icons/gi";
import { Bot, BotIcon, BotMessageSquare, MessageCircle, MessageCircleCodeIcon, MessageCircleDashed, MessageCircleHeart, MessageCircleOff, MessageCircleQuestion, MessageCircleReply, MessageSquare, MessageSquareDot } from "lucide-react";
import { CgBot } from "react-icons/cg";

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
                    <MessageSquare className="h-8 w-8"/>
                </button>
            )}
        </div>
    );
}
