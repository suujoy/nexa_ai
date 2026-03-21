import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import { initSocket } from "./src/socket/socket.server.js";



const httpServer = http.createServer(app);
initSocket(httpServer);

connectToDB();

httpServer.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
