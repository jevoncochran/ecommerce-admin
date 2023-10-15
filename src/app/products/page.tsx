"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ExistingProduct } from "@/types";
import EditButton from "@/components/edit-button";
import DeleteButton from "@/components/delete-button";
import { useRouter } from "next/navigation";
import { useRedirect } from "@/hooks/useRedirect";

const ProductsPage = () => {
  useRedirect();

  const router = useRouter();

  const [products, setProducts] = useState<ExistingProduct[]>([]);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Link href="/products/new">
        <button className="bg-gray-300 rounded-md py-1 px-2">
          Add new product
        </button>
      </Link>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Product</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>
                <EditButton href={`/products/edit/${product._id}`} />
                <DeleteButton href={`/products/delete/${product._id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
