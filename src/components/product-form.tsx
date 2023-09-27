import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Product, ToastType } from "@/types";
import { notify } from "@/utils/notify";
import { ToastContainer } from "react-toastify";

interface ProductFormProps {
  productInfo: Product;
  productId?: string;
  type: "create" | "edit";
}

const ProductForm = ({ productInfo, productId, type }: ProductFormProps) => {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: productInfo.name,
    description: productInfo.description,
    price: productInfo.price,
    images: productInfo.images,
  });

  const [goToProducts, setGoToProducts] = useState(false);

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
      await axios.post("/api/products", product);
      notify("Product succesfully created", ToastType.Success);
      setTimeout(() => {
        setGoToProducts(true);
      }, 2000);
    } else {
      // Edit product
      await axios.put(`/api/products/${productId}`, {
        ...product,
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
      const data = new FormData();

      data.append("file", files[0]);
      const res = await axios.post("/api/upload", data);
    }
  };

  if (goToProducts) {
    router.push("/products");
  }

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
        <label htmlFor="">Photos</label>
        <div className="mb-2">
          <label
            // The file uploader will not opem when this is here for some reason
            // htmlFor="imageUpload"
            className="w-24 h-24 flex justify-center items-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer"
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
          {!product.images?.length && <div>No images of this product</div>}
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
        <button type="submit" className="btnPrimary">
          Save
        </button>
      </form>
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default ProductForm;
