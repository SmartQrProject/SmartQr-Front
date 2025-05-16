export interface IMenuCreateForm{
  id?: number;
  name: string;
  description: string;
  price: number;
  imageFile: string;
  detail: string[];
  available: boolean;
  category: number;
}

export interface ICategories {
  id: number,
  name: string
}