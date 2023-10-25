"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const OrdersPage = () => {
  // TODO: Correctly type orders
  const [orders, setOrders] = useState<any>([]);

  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>ID</th>
            <th>Customer</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Correctly type here */}
          {orders.map((order: any) => (
            <tr key={order._id}>
              <td>{order.createdAt}</td>
              <td className={order.paid ? "text-green-600" : "text-red-600"}>
                {order.paid ? "YES" : "NO"}
              </td>
              <td>{order._id}</td>
              <td>
                {order.customer.name}
                <br />
                {order.customer.email}
              </td>
              <td>
                {/* TODO: Correctly type here as well */}
                {order.products.map((product: any) => (
                  <div key={product._id}>
                    {product.name}
                    <br />
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
