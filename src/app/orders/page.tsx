"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      console.log(res.data);
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
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.createdAt}</td>
              <td className={order.paid ? "text-green-600" : "text-red-600"}>
                {order.paid ? "YES" : "NO"}
              </td>
              <td>{order._id}</td>
              <td>
                {order.name}
                <br />
                {order.email}
              </td>
              <td>
                {order.line_items?.map((product) => (
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
