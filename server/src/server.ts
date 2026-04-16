import { NODE_ENV, PORT } from "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import connectToDatabase from "./database/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

const app = express();

// app.set('trust proxy', true) // Shows the real IP not the proxy IP.

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
} else {
  app.set("trust proxy", false);
}

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectToDatabase();
});
