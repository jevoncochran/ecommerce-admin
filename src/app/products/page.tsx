import Link from "next/link";
import React from "react";

const ProductsPage = () => {
  return (
    <div>
      <Link href="/products/new">
        <button className="bg-gray-300 rounded-md py-1 px-2">
          Add new product
        </button>
      </Link>
    </div>
  );
};

export default ProductsPage;
