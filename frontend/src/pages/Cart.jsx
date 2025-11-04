import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    products,
    currency,
    delivery_fee,
    getCartAmount,
    updateQuantity,
    getCartCount,
    removeFromCart,
    checkoutViaWhatsApp,
    fetchUserCart,
    user,
  } = useContext(ShopContext);

  const [loading, setLoading] = useState(false);

  // ✅ Load cart from backend on mount (if logged in)
  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUserCart().finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading cart...</div>;

  const cartCount = getCartCount();

  if (cartCount === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty 🛒</h2>
        <Link
          to="/"
          className="inline-block bg-black text-white px-5 py-2 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Your Shopping Cart</h2>

      <div className="space-y-4">
        {Object.entries(cartItems).map(([id, sizes]) => {
          const product = products.find((p) => p._id === id);
          if (!product) return null;

          return Object.entries(sizes).map(([size, qty]) => (
            <div
              key={`${id}-${size}`}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Size: <span className="font-medium">{size}</span>
                  </p>
                  <p className="text-sm">
                    {currency}
                    {product.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-1 border rounded-md"
                  onClick={() =>
                    updateQuantity(id, size, Math.max(0, qty - 1))
                  }
                >
                  -
                </button>
                <span>{qty}</span>
                <button
                  className="px-3 py-1 border rounded-md"
                  onClick={() => updateQuantity(id, size, qty + 1)}
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {currency}
                  {product.price * qty}
                </p>
                <button
                  onClick={() => removeFromCart(id, size)}
                  className="text-sm text-red-500 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ));
        })}
      </div>

      {/* Cart Summary */}
      <div className="mt-10 border-t pt-6 text-right">
        <p className="text-lg">
          Subtotal:{" "}
          <span className="font-semibold">
            {currency}
            {getCartAmount().toFixed(2)}
          </span>
        </p>
        <p className="text-lg">
          Delivery Fee:{" "}
          <span className="font-semibold">
            {currency}
            {delivery_fee}
          </span>
        </p>
        <p className="text-xl font-bold mt-2">
          Total:{" "}
          <span className="text-green-600">
            {currency}
            {(getCartAmount() + delivery_fee).toFixed(2)}
          </span>
        </p>

        <button
          onClick={checkoutViaWhatsApp}
          className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Checkout via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Cart;
