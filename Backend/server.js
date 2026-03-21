import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import { initSocket } from "./src/socket/socket.server.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectToDB();
    const httpServer = http.createServer(app);
    initSocket(httpServer);
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
});
