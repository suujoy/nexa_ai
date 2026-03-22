import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import handleError from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";

const app = express();

/**
 * Middlewares
 */
app.use(express.json());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.use(cookieParser());

/**
 * Routes
 */
app.use("/api/auth", authRouter);

//Error Handler
app.use(handleError);

export default app;
