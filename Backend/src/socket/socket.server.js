import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: "http://localhost:5173", credentials: true },
    });

    console.log("Socket.io running");

    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);

        socket.on("join_chat", (chatId) => socket.join(chatId));
        socket.on("leave_chat", (chatId) => socket.leave(chatId));
        socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
    });
};

export const getIo = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};
