import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    // ✅ Expect: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Authorization token missing or invalid",
        });
    }

    // Extract token safely
    const token = authHeader.split(" ")[1];

    // Verify JWT with secret and algorithm
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [process.env.JWT_ALGORITHM || "HS256"],
    });

    // Validate admin email (your existing logic)
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Attach decoded data for later use
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;
