import express from "express";
import authRouter from "./routes/auth.route.js";
import handleError from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);

/**
 * middlewares routes
 */
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

/**
 * Error handler Middleware
 */
app.use(handleError);

export default app;
