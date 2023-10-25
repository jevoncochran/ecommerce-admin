"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ExistingProduct } from "@/types";
import ProductForm from "@/components/product-form";

const EditProductPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [product, setProduct] = useState<ExistingProduct | null>(null);

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    product && (
      <ProductForm productInfo={product} productId={product._id} type="edit" />
    )
  );
};

export default EditProductPage;
