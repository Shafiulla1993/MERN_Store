import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { navigate, checkoutViaWhatsApp, user } = useContext(ShopContext);

  const handlePlaceOrder = () => {
    // Ensure user is logged in before checkout
    if (!user) {
      navigate("/login");
      return;
    }

    // Redirect to WhatsApp checkout
    checkoutViaWhatsApp();
  };

  return (
    <div className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t">
      {/* ✅ Left Side: Delivery Info */}
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="First Name"
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Last Name"
          />
        </div>

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="email"
          placeholder="Email Address"
        />
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="City"
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="number"
            placeholder="Zip Code"
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded"
          type="number"
          placeholder="Mobile"
        />
      </div>

      {/* ✅ Right Side: Order Summary & Payment */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        {/* ✅ Payment Method Selection */}
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHODS"} />
          <div className="flex flex-col gap-3 lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className={`flex items-center gap-3 p-2 px-3 border cursor-pointer rounded ${
                method === "stripe" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-600" : ""
                }`}
              ></p>
              <p className="mx-4 text-sm font-medium text-gray-600">
                Stripe (Card)
              </p>
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className={`flex items-center gap-3 p-2 px-3 border cursor-pointer rounded ${
                method === "razorpay" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-600" : ""
                }`}
              ></p>
              <p className="mx-4 text-sm font-medium text-gray-600">
                Razorpay (UPI/Card)
              </p>
            </div>

            <div
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-3 p-2 px-3 border cursor-pointer rounded ${
                method === "cod" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-600" : ""
                }`}
              ></p>
              <p className="mx-4 text-sm font-medium text-gray-600">
                Cash on Delivery
              </p>
            </div>
          </div>

          {/* ✅ Checkout Button */}
          <div className="w-full mt-8 text-end">
            <button
              onClick={handlePlaceOrder}
              className="px-16 py-3 text-sm text-white bg-black active:bg-gray-800 rounded"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
