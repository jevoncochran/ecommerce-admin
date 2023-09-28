"use client";

import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { ExistingCategory } from "@/types";
import EditButton from "@/components/edit-button";
import DeleteButton from "@/components/delete-button";

const Categories = () => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    parentCategory: "",
  });
  const [categoryToEdit, setCategoryToEdit] = useState<ExistingCategory | null>(
    null
  );
  const [categories, setCategories] = useState<ExistingCategory[]>([]);

  const saveCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (categoryToEdit) {
      await axios.put("/api/categories", {
        name: categoryToEdit.name,
        parentCategory: categoryToEdit.parentCategory?._id,
        _id: categoryToEdit._id,
      });
      setCategoryToEdit(null);
    } else {
      await axios.post("/api/categories", {
        name: newCategory.name,
        parentCategory: newCategory.parentCategory
          ? newCategory.parentCategory
          : undefined,
      });
      setNewCategory({ name: "", parentCategory: "" });
    }
    fetchCategories();
  };

  const fetchCategories = () => {
    axios.get("/api/categories").then((res) => {
      console.log(res.data);
      setCategories(res.data);
    });
  };

  const editCategory = (category: ExistingCategory) => {
    setCategoryToEdit(category);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <form onSubmit={saveCategory}>
        <label htmlFor="">
          {categoryToEdit ? "Edit Category" : "Create New Category"}
        </label>
        <div className="flex gap-1 mt-1">
          <input
            type="text"
            placeholder="Category name"
            value={categoryToEdit ? categoryToEdit.name : newCategory.name}
            // TODO: Figure out a better way to do this
            onChange={(e) =>
              categoryToEdit
                ? setCategoryToEdit({ ...categoryToEdit, name: e.target.value })
                : setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="mb-0"
          />
          <select
            name=""
            id=""
            className="mb-0"
            // TODO: Figure out a better way to do this
            value={
              categoryToEdit
                ? categoryToEdit.parentCategory?._id
                : newCategory.parentCategory
            }
            onChange={(e) =>
              categoryToEdit
                ? setCategoryToEdit({
                    ...categoryToEdit,
                    parentCategory: categories.find(
                      (category) => category._id === e.target.value
                    ),
                  })
                : setNewCategory({
                    ...newCategory,
                    parentCategory: e.target.value,
                  })
            }
          >
            <option value="">No parent category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category</td>
            <td>Branch</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category.parentCategory?.name}</td>
              <td>
                <EditButton onClick={() => editCategory(category)} />
                <DeleteButton href={`/categories/delete/${category._id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
