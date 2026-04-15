import { NODE_ENV, PORT } from "./config/env";
import express from "express";
import cookieParser from 'cookie-parser';
import connectToDatabase from "./database/db";
import authRouter from "./routes/auth.routes";
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.set('trust proxy', true) // Shows the real IP not the proxy IP.
if (NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
else {
    app.set('trust proxy', false);
}
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/v1/auth", authRouter);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectToDatabase();
});
//# sourceMappingURL=server.js.map