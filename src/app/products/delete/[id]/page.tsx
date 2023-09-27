"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExistingProduct, ToastType } from "@/types";
import axios from "axios";
import { notify } from "@/utils/notify";
import { ToastContainer } from "react-toastify";

const DeleteProductPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const { id } = params;

  const [product, setProduct] = useState<ExistingProduct | null>(null);

  const goBack = () => {
    router.push("/products");
  };

  const deleteProduct = async () => {
    await axios.delete(`/api/products/${id}`);
    notify("Prouct successfully deleted", ToastType.Success);
    setTimeout(() => {
      goBack();
    }, 2000);
  };

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1 className="text-center">
        Are you sure you want to delete this product?
      </h1>
      <h2 className="text-center">{product?.name}</h2>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DeleteProductPage;
