"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        console.log(res.data);
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
      <table className="basic">
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
              <td>buttons</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
