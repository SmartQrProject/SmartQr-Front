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
