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
    OWNER = "owner"
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


export interface ICategory{
    id: string;
    name: string;
    products: IProduct[];
    newProductName?: string;
}

export interface IRestaurant{
    id: string;
    name: string;
    slug: string;
    owner_email: string;
    is_active: boolean;
    categories: ICategory[];    
}
export interface IProduct{
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
