import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import morgan from "morgan";
import compression from "compression";

import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import publicRouter from "./routes/publicRoute.js";

const allowedOrigins = process.env.FRONTEND_URL.split(",");

// INFO: Create express app
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
app.use(morgan("dev"));

// INFO: Middleware
app.use(express.json());
app.use(compression());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools or server-to-server calls with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

// INFO: API endpoints
app.use("/api/user", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api", publicRouter);

// INFO: Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Handle unknown or invalid routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// INFO: Start server
app.listen(port, () =>
  console.log(`Server is running on at http://localhost:${port}`)
);
