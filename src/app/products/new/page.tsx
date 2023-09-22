"use client";

import ProductForm from "@/components/product-form";

const NewProductPage = () => {
  return (
    <ProductForm
      productInfo={{ name: "", description: "", price: 0 }}
      type="create"
    />
  );
};

export default NewProductPage;
