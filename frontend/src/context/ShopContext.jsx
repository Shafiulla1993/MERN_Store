// ✅ NEW imports remain same
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const currency = "₹";
  const delivery_fee = 10;

  // =========================
  // 📦 Load user & cart
  // =========================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCart = JSON.parse(localStorage.getItem("cartItems"));

    if (storedUser) setUser(storedUser);
    if (storedCart) setCartItems(storedCart);

    fetchInitialData();
  }, []);

  // =========================
  // 💾 Sync cart to localStorage
  // =========================
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // =========================
  // 🌐 Fetch products & categories
  // =========================
  const fetchInitialData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get("/v1/products"),
        axiosInstance.get("/v1/categories"),
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // =========================
  // 🧍 Auth: Signup & Login
  // =========================
  const signup = async (userData) => {
    try {
      const { data } = await axiosInstance.post("/v1/register", userData);
      if (data.success) {
        toast.success("Signup Successful, please login");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const login = async (userData, from = "/") => {
    try {
      const { data } = await axiosInstance.post("/v1/login", userData);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Login Successful");
        navigate(from);
      } else toast.error(data.message || "Login failed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setProfile(null);
    setOrders([]);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // =========================
  // 🧾 Profile & Orders
  // =========================
  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get("/v1/profile");
      if (data.success) setProfile(data.user);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const updateProfile = async (payload) => {
    try {
      const { data } = await axiosInstance.put("/v1/profile", payload);
      if (data.success) {
        setProfile(data.user);
        toast.success("Profile updated");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const addAddress = async (address) => {
    try {
      const { data } = await axiosInstance.post("/v1/address", address);
      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          addresses: data.addresses,
        }));
        toast.success("Address added");
      }
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/v1/orders");
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  // =========================
  // 🛒 Cart Logic
  // =========================
  const addToCart = async (itemId, size) => {
    if (!size) return toast.error("Please select a size");
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else cartData[itemId] = { [size]: 1 };
    setCartItems(cartData);

    if (user) {
      try {
        await axiosInstance.post("/v1/cart", {
          productId: itemId,
          size,
          quantity: 1,
        });
      } catch (err) {
        console.error("Cart sync failed:", err);
      }
    }
    toast.success("Item added to cart");
  };

  const updateQuantity = (itemId, size, quantity) => {
    const newCart = structuredClone(cartItems);
    if (quantity === 0) {
      delete newCart[itemId][size];
      if (!Object.keys(newCart[itemId]).length) delete newCart[itemId];
    } else newCart[itemId][size] = quantity;
    setCartItems(newCart);
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce(
      (acc, sizes) =>
        acc + Object.values(sizes).reduce((sum, qty) => sum + qty, 0),
      0
    );

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((total, [id, sizes]) => {
      const product = products.find((p) => p._id === id);
      if (product) {
        for (const s in sizes) total += product.price * sizes[s];
      }
      return total;
    }, 0);

  // =========================
  // 💬 Checkout via WhatsApp
  // =========================
  const checkoutViaWhatsApp = () => {
    const total = getCartAmount() + delivery_fee;
    const message = encodeURIComponent(
      `🛍 *New Order Request*\n\n${Object.entries(cartItems)
        .map(([id, sizes]) => {
          const product = products.find((p) => p._id === id);
          return Object.entries(sizes)
            .map(
              ([size, qty]) =>
                `• ${product?.name || "Product"} (${size}) x${qty} = ${
                  product?.price * qty
                } ${currency}`
            )
            .join("\n");
        })
        .join("\n")}\n\n*Total:* ${total} ${currency}\n\n👤 *Customer:* ${
        user?.name || "Guest"
      }\n📧 *Email:* ${user?.email || "N/A"}`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  // =========================
  // 💾 Context Value
  // =========================
  const value = {
    products,
    categories,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    checkoutViaWhatsApp,
    signup,
    login,
    logout,
    user,
    profile,
    fetchProfile,
    updateProfile,
    addAddress,
    orders,
    fetchOrders,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
