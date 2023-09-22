import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Product } from "@/types";

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
    console.log(product);

    if (type === "create") {
      // Create product
      await axios.post("/api/products", product);
      setGoToProducts(true);
    } else {
      // Edit product
      await axios.put(`/api/products/${productId}`, {
        ...product,
        _id: productId,
      });
      setGoToProducts(true);
    }
  };

  if (goToProducts) {
    router.push("/products");
  }

  return (
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
  );
};

export default ProductForm;
