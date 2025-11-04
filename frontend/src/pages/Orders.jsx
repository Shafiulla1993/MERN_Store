import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";

const Orders = () => {
  const { user, orders, fetchOrders, currency } = useContext(ShopContext);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  if (!user)
    return (
      <div className="p-10 text-center text-gray-500">
        Please log in to view your orders.
      </div>
    );

  if (!orders.length)
    return (
      <div className="p-10 text-center text-gray-500">No orders found.</div>
    );

  return (
    <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-semibold">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded-md hover:shadow transition"
          >
            <div className="flex flex-wrap justify-between mb-3 text-sm text-gray-600">
              <p>Order ID: {order._id}</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <ul className="mb-2 text-gray-700">
              {order.items.map((item, i) => (
                <li key={i}>
                  • {item.productName} ({item.size}) x {item.quantity}
                </li>
              ))}
            </ul>
            <p className="font-medium">
              Total: {currency}
              {order.totalAmount}
            </p>
            <p
              className={`mt-1 text-sm font-medium ${
                order.status === "Delivered"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              Status: {order.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
