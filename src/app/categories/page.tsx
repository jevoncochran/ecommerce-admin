"use client";

import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { ExistingCategory, Property } from "@/types";
import EditButton from "@/components/edit-button";
import DeleteButton from "@/components/delete-button";
import { withSwal } from "react-sweetalert2";
import { useRedirect } from "@/hooks/useRedirect";

interface CategoriesProps {
  swal: any;
}

interface NewCategory {
  name: string;
  parentCategory: string;
  properties: Property[] | null | undefined;
}

// TODO: Figure out react-sweetalert2 types
const Categories = ({ swal }: CategoriesProps) => {
  useRedirect();

  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    parentCategory: "",
    properties: null,
  });
  const [categoryToEdit, setCategoryToEdit] = useState<ExistingCategory | null>(
    null
  );
  const [categories, setCategories] = useState<ExistingCategory[]>([]);

  const saveCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (categoryToEdit) {
      await axios.put("/api/categories", {
        _id: categoryToEdit._id,
        name: categoryToEdit.name,
        parentCategory: categoryToEdit.parentCategory?._id,
        properties: categoryToEdit.properties,
      });
      setCategoryToEdit(null);
    } else {
      await axios.post("/api/categories", {
        name: newCategory.name,
        parentCategory: newCategory.parentCategory
          ? newCategory.parentCategory
          : undefined,
        properties: newCategory.properties,
      });
      setNewCategory({ name: "", parentCategory: "", properties: null });
    }
    fetchCategories();
  };

  const fetchCategories = () => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  };

  const editCategory = (category: ExistingCategory) => {
    setCategoryToEdit(category);
  };

  const deleteCategory = (category: ExistingCategory) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Confirm to delete ${category.name}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Delete",
        reverseButtons: true,
        confirmButtonColor: "#d55",
      })
      // TODO: Replace this any with a type from react-sweetalert2
      .then((result: any) => {
        // when confirmed and promise resolved...
        if (result.isConfirmed) {
          axios
            .delete(`/api/categories/${category._id}`)
            .then(() => fetchCategories());
        }
      });
  };

  const addProperty = () => {
    if (categoryToEdit) {
      setCategoryToEdit({
        ...categoryToEdit,
        properties: categoryToEdit.properties
          ? [...categoryToEdit.properties, { name: "", values: [] }]
          : [{ name: "", values: [] }],
      });
    } else {
      setNewCategory({
        ...newCategory,
        properties: newCategory.properties
          ? [...newCategory.properties, { name: "", values: [] }]
          : [{ name: "", values: [] }],
      });
    }
  };

  const removeProperty = (pIndex: number) => {
    if (categoryToEdit) {
      setCategoryToEdit({
        ...categoryToEdit,
        properties: categoryToEdit?.properties?.filter((property, idx) => {
          return idx !== pIndex;
        }),
      });
    } else {
      setNewCategory({
        ...newCategory,
        properties: newCategory?.properties?.filter((property, idx) => {
          return idx !== pIndex;
        }),
      });
    }
  };

  const changePropertyName = (
    e: ChangeEvent<HTMLInputElement>,
    pIndex: number
  ) => {
    if (categoryToEdit) {
      setCategoryToEdit({
        ...categoryToEdit,
        properties: categoryToEdit?.properties?.map((p, idx) => {
          if (idx === pIndex) {
            return { ...p, name: e.target.value };
          } else {
            return p;
          }
        }),
      });
    } else {
      setNewCategory({
        ...newCategory,
        properties: newCategory?.properties?.map((p, idx) => {
          if (idx === pIndex) {
            return { ...p, name: e.target.value };
          } else {
            return p;
          }
        }),
      });
    }
  };

  const changePropertyValues = (
    e: ChangeEvent<HTMLInputElement>,
    pIndex: number
  ) => {
    const valuesArr = e.target.value.split(",");
    const noSpaces = valuesArr.map((el) => el.replace(/\s/g, ""));
    if (categoryToEdit) {
      setCategoryToEdit({
        ...categoryToEdit,
        properties: categoryToEdit?.properties?.map((p, idx) => {
          if (idx === pIndex) {
            return { ...p, values: noSpaces };
          } else {
            return p;
          }
        }),
      });
    } else {
      setNewCategory({
        ...newCategory,
        properties: newCategory?.properties?.map((p, idx) => {
          if (idx === pIndex) {
            return { ...p, values: noSpaces };
          } else {
            return p;
          }
        }),
      });
    }
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
        <div className="mt-1">
          <div className="flex gap-1 mb-2">
            <input
              type="text"
              placeholder="Category name"
              value={categoryToEdit ? categoryToEdit.name : newCategory.name}
              // TODO: Figure out a better way to do this
              onChange={(e) =>
                categoryToEdit
                  ? setCategoryToEdit({
                      ...categoryToEdit,
                      name: e.target.value,
                    })
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
          </div>
          <div className="mb-2">
            <label htmlFor="" className="block">
              Properties
            </label>
            <button
              type="button"
              onClick={addProperty}
              className="btn-default text-sm mb-2"
            >
              Add new property
            </button>
            {categoryToEdit?.properties &&
              categoryToEdit?.properties?.length > 0 &&
              categoryToEdit.properties.map((property, idx) => (
                <div key={idx} className="flex gap-1 mb-2">
                  <input
                    type="text"
                    placeholder="property name (ex: color)"
                    value={property.name}
                    onChange={(e) => changePropertyName(e, idx)}
                    className="mb-0"
                  />
                  {/* TODO: There is a backspace bug here */}
                  <input
                    type="text"
                    placeholder="values, comma separated"
                    value={property.values.join(", ")}
                    onChange={(e) => changePropertyValues(e, idx)}
                    className="mb-0"
                  />
                  <button
                    type="button"
                    onClick={() => removeProperty(idx)}
                    className="btn-red"
                  >
                    Remove
                  </button>
                </div>
              ))}
            {!categoryToEdit &&
              newCategory?.properties &&
              newCategory?.properties?.length > 0 &&
              newCategory.properties.map((property, idx) => (
                <div key={idx} className="flex gap-1 mb-2">
                  <input
                    type="text"
                    placeholder="property name (ex: color)"
                    onChange={(e) => changePropertyName(e, idx)}
                    className="mb-0"
                  />
                  <input
                    type="text"
                    placeholder="values, comma separated"
                    onChange={(e) => changePropertyValues(e, idx)}
                    className="mb-0"
                  />
                  <button
                    type="button"
                    onClick={() => removeProperty(idx)}
                    className="btn-red"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
          <div className="flex gap-1">
            {categoryToEdit && (
              <button
                type="button"
                onClick={() => setCategoryToEdit(null)}
                className="btn-default"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary py-1">
              Save
            </button>
          </div>
        </div>
      </form>
      {!categoryToEdit && (
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
                  <DeleteButton onClick={() => deleteCategory(category)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
