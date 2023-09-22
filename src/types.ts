export interface Product {
  name: string;
  description: string;
  price: number;
}

export interface ExistingProduct extends Product {
  _id: string;
}
