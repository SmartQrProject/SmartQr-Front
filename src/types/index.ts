export interface IAdmin{
    id: number;
    name: string;
    email: string;
    role: Role;
    storeName: string;
    slug: string;
    password: string;

}


enum Role{
    ADMIN = "admin",
    USER = "user"
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
    user:IAdmin;
   
}

export interface IAdminLogin {
    email: string;
    password: string;
}