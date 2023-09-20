"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";

const NewProductPage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const createProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newProduct);
    await axios.post("/api/products", newProduct);
  };

  return (
    <div>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>
        <label htmlFor="productName">Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={newProduct.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Product Description</label>
        <textarea
          name="description"
          placeholder="Product description"
          value={newProduct.description}
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="price">Price (in USD)</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => handleChange(e)}
        />
        <button type="submit" className="btnPrimary">
          Save
        </button>
      </form>
    </div>
  );
};

export default NewProductPage;
