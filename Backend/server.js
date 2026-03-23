import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/configs/database.js";
import { initSocket } from "./src/socket/socket.server.js";

connectDB();

const httpServer = http.createServer(app);

initSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
