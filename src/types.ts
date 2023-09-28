export interface Category {
  name: string;
}

export interface ExistingCategory extends Category {
  _id: string;
  parentCategory?: ExistingCategory;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  images?: string[];
}

export interface ExistingProduct extends Product {
  _id: string;
}

export enum ToastType {
  Success = "success",
  Error = "error",
}
