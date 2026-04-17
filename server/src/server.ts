import { NODE_ENV, PORT } from "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import connectToDatabase from "./database/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

const app = express();

/* ---------------------------
   Trust Proxy (Render / Prod)
---------------------------- */
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
} else {
  app.set("trust proxy", false);
}

/* ---------------------------
   Allowed Origins
---------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://react-auth-gules-pi.vercel.app",
  "*",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
/* ---------------------------
   Body Parsers
---------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------------
   Cookies
---------------------------- */
app.use(cookieParser());

/* ---------------------------
   Routes
---------------------------- */
app.use("/api/v1/auth", authRouter);

/* Health Route */
app.get("/", (req, res) => {
  res.status(200).send("Backend is running 🚀");
});

/* ---------------------------
   Global Error Handler
---------------------------- */
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Server Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  },
);

/* ---------------------------
   Start Server
---------------------------- */
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await connectToDatabase();
    console.log("Database connected ✅");
  } catch (error) {
    console.error("Database connection failed ❌", error);
  }
});
