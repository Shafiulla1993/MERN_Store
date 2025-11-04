import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Signup = () => {
  const { registerUser } = useContext(ShopContext); // You'll add this in context later
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    await registerUser({ name, email, password });
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">Sign Up</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="John Doe"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="hello@gmail.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="px-8 py-2 mt-4 font-light text-white bg-black"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
