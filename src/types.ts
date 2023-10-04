export interface Category {
  name: string;
}

export interface ExistingCategory extends Category {
  _id: string;
  parentCategory?: ExistingCategory;
  properties?: Property[];
}

export interface Product {
  name: string;
  category?: ExistingCategory;
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

export interface Property {
  name: string;
  values: string[];
}
