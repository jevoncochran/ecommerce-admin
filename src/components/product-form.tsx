import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ExistingCategory, Product, ToastType } from "@/types";
import { notify } from "@/utils/notify";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import Spinner from "./spinner";
import { capitalize } from "@/utils/capitalize";

interface ProductFormProps {
  productInfo: Product;
  productId?: string;
  type: "create" | "edit";
}

const ProductForm = ({ productInfo, productId, type }: ProductFormProps) => {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: productInfo.name,
    category: productInfo.category,
    description: productInfo.description,
    price: productInfo.price,
    images: productInfo.images,
    availability: productInfo.availability,
  });
  const [categories, setCategories] = useState<ExistingCategory[]>([]);
  const [images, setImages] = useState(productInfo.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [goToProducts, setGoToProducts] = useState(false);

  // Grabs the current category for product
  // Returns default availability object
  // All availability values are set to false by default
  const getProductProperties = (category: ExistingCategory) => {
    const productProps = category?.properties?.map((p) => {
      const propsObj = { name: p.name, values: {} };
      p.values.forEach((val: string) => {
        propsObj.values[val] = false;
      });

      return propsObj;
    });

    return productProps;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const saveProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (type === "create") {
      // Create product
      await axios.post("/api/products", { ...product, images });
      notify("Product succesfully created", ToastType.Success);
      setTimeout(() => {
        setGoToProducts(true);
      }, 2000);
    } else {
      // Edit product
      await axios.put(`/api/products/${productId}`, {
        ...product,
        images,
        _id: productId,
      });
      notify("Product succesfully updated", ToastType.Success);
      setTimeout(() => {
        setGoToProducts(true);
      }, 2000);
    }
  };

  const uploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length && files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();

      data.append("file", files[0]);
      const res = await axios.post("/api/upload", data);
      setIsUploading(false);
      setImages((prevImages) => {
        return [...prevImages, res.data.link];
      });
    }
  };

  const handlePropertiesChange = (
    e: ChangeEvent<HTMLInputElement>,
    pIndex: number,
    valueName: string
  ) => {
    if (e.target.checked) {
      setProduct({
        ...product,
        availability: product.availability.map((property, idx: number) => {
          if (idx === pIndex) {
            return {
              ...property,
              values: { ...property.values, [valueName]: true },
            };
          }
        }),
      });
    } else {
      setProduct({
        ...product,
        availability: product.availability.map((property, idx: number) => {
          if (idx === pIndex) {
            return {
              ...property,
              values: { ...property.values, [valueName]: false },
            };
          }
        }),
      });
    }
  };

  if (goToProducts) {
    router.push("/products");
  }

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    console.log(product);
  }, [product]);

  return (
    <>
      <form onSubmit={saveProduct}>
        <h1>{type === "create" ? "New Product" : "Edit Product"}</h1>
        <label htmlFor="productName">Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={product.name}
          onChange={handleChange}
        />
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id=""
          value={product.category?._id}
          onChange={(e) =>
            // TODO: Move to this to its own function
            // Set product category to category selected category using category ID passed in and .find() method
            // In the event that there is no category ID passed in (i.e. e.target.value === ""), s
            {
              const selectedCategory = categories.find(
                (c) => c._id === e.target.value
              );
              setProduct({
                ...product,
                category: selectedCategory ?? undefined,
                availability: getProductProperties(
                  selectedCategory as ExistingCategory
                ),
              });
            }
          }
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {/* TODO: We need to grab the availability options from the category entity itself and not from the product */}
        {/* This is because when category is updated, product is not */}
        {/* For example, adding a new property to category will not make that property automatically appear on product */}
        {product.availability?.map((prop, pIndex: number) => (
          <div key={pIndex} className="mb-2">
            <label>{capitalize(prop.name)}</label>
            {Object.entries(prop.values).map((pv, vIndex) => (
              <div key={vIndex} className="flex items-center">
                <input
                  type="checkbox"
                  name={pv[0]}
                  checked={pv[1] as boolean}
                  className="w-10 mb-0"
                  onChange={(e) =>
                    handlePropertiesChange(e, pIndex, e.target.name)
                  }
                />
                <label htmlFor={pv[0]}>{pv[0]}</label>
              </div>
            ))}
          </div>
        ))}
        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {!isUploading ? (
            <label
              // The file uploader will not opem when this is here for some reason
              // htmlFor="imageUpload"
              className="w-24 h-24 flex justify-center items-center text-sm gap-1 text-gray-500 rounded-lg bg-white shadow-md border border-gray-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              Upload
              <input type="file" className="hidden" onChange={uploadImages} />
            </label>
          ) : (
            <div className="w-24 h-24 flex justify-center items-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
              <Spinner />
            </div>
          )}
          {!!images.length &&
            images.map((link: string) => (
              // TODO: Make image height take up full height of div w automatic width
              <Image
                key={link}
                src={link}
                alt="product"
                height={96}
                width={96}
                className="rounded-lg bg-white p-2 shadow-md border border-gray-200"
              />
            ))}
          {!images.length && <div>No images of this product</div>}
        </div>
        <label htmlFor="description">Product Description</label>
        <textarea
          name="description"
          placeholder="Product description"
          value={product.description}
          // TODO: Fix this!!
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="price">Price (in USD)</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={(e) => handleChange(e)}
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default ProductForm;
