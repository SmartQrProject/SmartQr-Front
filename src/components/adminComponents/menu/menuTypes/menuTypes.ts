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
  detail?: string[]
  available?: boolean
  categoryId: string
}

export interface ProductPreviewProps {
  preview: IPreviewData
}

