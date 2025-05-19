export interface IProducts{
  id?: number;
  name: string;
  description: string;
  price: number;
  image_url: File;
  detail?: string[];
  available?: boolean;
  categoryId: string;
}

export interface ICategories {
  id: number,
  name: string
}

export interface IPreviewData {
  name: string
  description: string
  price: number
  imageUrl?: string
  details?: string[]
  is_available?: boolean
  categoryId: string
}

export interface ProductPreviewProps {
  preview: IPreviewData
}

export interface ICategoryWithProducts {
  id: string;
  name: string;
  products: IProducts[];
}
