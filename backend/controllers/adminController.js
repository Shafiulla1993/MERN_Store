import jwt from "jsonwebtoken";

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Use env variables for config
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        algorithm: process.env.JWT_ALGORITHM || "HS256",
      });

      res.status(200).json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error while logging in admin:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default loginAdmin;
