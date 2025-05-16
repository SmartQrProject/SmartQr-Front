import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface IAdmin {
    id: number;
    name: string;
    email: string;
    role: Role;
    storeName: string;
    slug: string;
    password: string;
}

enum Role {
    ADMIN = "admin",
    USER = "user",
}

export interface IAdminRegister {
    name: string;
    email: string;
    storeName: string;
    slug: string;
    password: string;
    confirmPassword: string;
}

export interface IAdminSession {
    token: string;
}

export interface IAdminLogin {
    email: string;
    password: string;
}

export interface IAdminSession {
    token: string;
    IAdmin: {
        id: string;
        name: string;
        email: string;
    };
}

export interface ITables {
    id?: number;
    rest_id?: number;
    code?: string;
    is_active?: boolean;
    created_at?: number;
    exist: boolean;
}

export interface IOrder {
    id: string;
    status: string;
    payStatus: string;
    order_type: string;
    total_price: number;
    created_at: string;
    tableId: number;
    customerId: string;
    restaurantId: string;
    exist: boolean;
}

// Chat bot

export type Message = {
    sender: "user" | "bot";
    text: string;
};

export type ChatWindowProps = {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    close: () => void;
};
