import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    /**
     * Auth middleware — verify JWT from cookie before allowing connection
     */
    io.use((socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie || "";
            const cookies = cookie.parse(rawCookie);
            const token = cookies.token;

            if (!token) {
                return next(new Error("Authentication token not found"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded._id.toString();
            next();
        } catch (err) {
            next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.userId} (socket: ${socket.id})`);

        /**
         * Join a chat room
         * Client emits: { chatId }
         */
        socket.on("join_chat", ({ chatId }) => {
            if (!chatId) return;
            socket.join(chatId);
            console.log(`User ${socket.userId} joined chat: ${chatId}`);
        });

        /**
         * Leave a chat room
         * Client emits: { chatId }
         */
        socket.on("leave_chat", ({ chatId }) => {
            if (!chatId) return;
            socket.leave(chatId);
            console.log(`User ${socket.userId} left chat: ${chatId}`);
        });

        /**
         * Typing indicator — broadcast to others in the room
         * Client emits: { chatId }
         */
        socket.on("typing", ({ chatId }) => {
            if (!chatId) return;
            socket.to(chatId).emit("user_typing", { userId: socket.userId });
        });

        socket.on("stop_typing", ({ chatId }) => {
            if (!chatId) return;
            socket
                .to(chatId)
                .emit("user_stop_typing", { userId: socket.userId });
        });

        socket.on("disconnect", () => {
            console.log(
                `User disconnected: ${socket.userId} (socket: ${socket.id})`,
            );
        });
    });

    console.log("Socket.io server is running");
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

/**
 * Emit a new message to everyone in the chat room
 * Called from message.controller.js after saving the AI response
 */
export const emitNewMessage = (chatId, message) => {
    if (!io) return;
    io.to(chatId.toString()).emit("new_message", message);
};

/**
 * Emit a chat title update (fired on first message of a new chat)
 * Called from message.controller.js after generating the title
 */
export const emitChatTitleUpdate = (chatId, title) => {
    if (!io) return;
    io.to(chatId.toString()).emit("chat_title_updated", { chatId, title });
};

/**
 * Emit AI thinking state (fires before AI response is ready)
 */
export const emitAiThinking = (chatId, isThinking) => {
    if (!io) return;
    io.to(chatId.toString()).emit("ai_thinking", { chatId, isThinking });
};
