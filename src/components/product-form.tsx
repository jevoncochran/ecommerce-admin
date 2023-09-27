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
