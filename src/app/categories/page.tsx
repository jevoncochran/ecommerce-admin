"use client";

import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { ExistingCategory } from "@/types";

const Categories = () => {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<ExistingCategory[]>([]);

  const saveCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post("/api/categories", { name: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  const fetchCategories = () => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <form onSubmit={saveCategory}>
        <label htmlFor="">New Category</label>
        <div className="flex gap-1 mt-1">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mb-0"
          />
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category</td>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
