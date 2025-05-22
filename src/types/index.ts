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
    OWNER = "owner",
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
    payload: {
        id: string;
        email: string;
        slug: string;
        roles: Role[];
    };
}

export type IAdminSessionStorage = {
    token: string;
    payload: any;
};

export interface ICategory {
    id: number;
    name: string;
    products: IProduct[];
    newProductName?: string;
}

export interface IRestaurant {
    id: string;
    name: string;
    slug: string;
    owner_email: string;
    is_active: boolean;
    categories: ICategory[];
    banner: string;
}
export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: ICategory;
    restaurant: IRestaurant;
}

export interface IProductResponse {
    products: IProduct[];
    total: number;
    page: number;
    limit: number;
}

export interface Restaurant {
    id: string;
    name: string;
    slug: string;
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
    id: string;
    code: string;
    is_active: boolean;
    created_at: string | Date; // puede venir como string si es desde JSON
    orders: IOrder[];
    restaurant: {
        id: string;
        name: string;
    };
    exist: boolean;
}

export interface IOrder {
    id: string;
    status: string;
    payStatus: string;
    order_type: string;
    total_price: number;
    created_at: String;
    tableId: string;
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

export interface IUserStaff {
    id: string,
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  slug?: string;
  role?: 'owner' | 'staff';
}

export interface MenuAdminProps {
  role: 'owner' | 'staff';
}
