import express from "express";
import authRouter from "./routes/auth.route.js";
import handleError from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * middlewares routes
 */
app.use("/api/auth", authRouter);

/**
 * Error handler Middleware
 */
app.use(handleError);

export default app;
