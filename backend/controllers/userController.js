import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ======================
// 🧍 Register (Sign Up)
// ======================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// 🔐 Login
// ======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// 👤 Get Profile
// ======================
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// ✏️ Update Profile
// ======================
export const updateUserProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        { name, mobile },
        { new: true, runValidators: true }
      )
      .select("-password");

    res.json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// 🏠 Add Address
// ======================
export const addAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    user.addresses.push(req.body); // push new address
    await user.save();
    res.json({
      success: true,
      message: "Address added",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// 🧾 Get User Orders
// ======================
export const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// 🛒 Get Cart
// ======================
export const getCart = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .populate("cart.productId", "name price image");
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// ➕ Add to Cart
// ======================
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const user = await userModel.findById(req.userId);

    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity, size });
    }

    await user.save();
    const updatedUser = await user.populate(
      "cart.productId",
      "name price image"
    );
    res.json({
      success: true,
      message: "Cart updated",
      cart: updatedUser.cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// 📝 Update Cart Item
// ======================
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const user = await userModel.findById(req.userId);

    const item = user.cart.find(
      (item) => item.productId.toString() === productId && item.size === size
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    item.quantity = quantity;
    await user.save();

    const updatedUser = await user.populate(
      "cart.productId",
      "name price image"
    );
    res.json({
      success: true,
      message: "Cart updated",
      cart: updatedUser.cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// ❌ Remove from Cart
// ======================
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await userModel.findById(req.userId);

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    const updatedUser = await user.populate(
      "cart.productId",
      "name price image"
    );
    res.json({
      success: true,
      message: "Item removed",
      cart: updatedUser.cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
