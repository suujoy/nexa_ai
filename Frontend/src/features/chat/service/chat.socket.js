import { io } from "socket.io-client";

// Returns the socket instance so caller can join rooms, listen for events, and disconnect
export const initializeSocketConnection = () => {
    const socket = io("https://nexa-ai-v1j9.onrender.com", {
        withCredentials: true,
    });

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("connect_error", (err) =>
        console.error("Socket error:", err.message),
    );
    socket.on("disconnect", (reason) =>
        console.log("Socket disconnected:", reason),
    );

    return socket;
};
