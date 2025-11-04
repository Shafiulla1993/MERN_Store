import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach user ID to request
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token!" });
  }
};

export default auth;
