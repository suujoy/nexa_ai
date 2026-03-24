import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import handleError from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import aiModelRouter from "./routes/aiModel.route.js";
import messageRouter from "./routes/message.route.js";
import attachmentRouter from "./routes/attachment.route.js";
import guestRouter from "./routes/guest.route.js";

const app = express();

/**
 * Middlewares
 */
app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "https://nexa-ai-lovat.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS blocked"));
            }
        },
        credentials: true,
    }),
);

app.options("*", cors());
app.use(cookieParser());

/**
 * Basic routes for uptime checks / browser open
 */
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Nexa AI backend is running",
    });
});

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        status: "ok",
    });
});

/**
 * Routes
 */
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);
app.use("/api/aiModel", aiModelRouter);
app.use("/api/message", messageRouter);
app.use("/api/attachment", attachmentRouter);
app.use("/api/guest", guestRouter);

//Error Handler
app.use(handleError);

export default app;
