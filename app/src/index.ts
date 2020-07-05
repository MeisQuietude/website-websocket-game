import mongoose from "mongoose";
import io from "socket.io";
import dotenv from "dotenv";

import expressApplication from "./http/app";
import { DBURI } from "./data";
import applyEvents from "./socket";

dotenv.config();

mongoose.connection.on("connected", () => {
    // Start HTTP Server
    const PORT = process.env.port && Number(process.env.port) || 3000;
    const serverHTTP = expressApplication.listen(PORT, "0.0.0.0", () => {
        console.log(`Server listening on port ${PORT}!`);
    });

    // Attach Socket.IO to HTTP Server
    const serverIO = io(serverHTTP, {
        pingInterval: 10000,
        pingTimeout: 5000,
    });

    serverIO.on("connection", applyEvents);
});
mongoose.connection.on("error", console.error);

const gracefulExit = (): void => {
    console.log("Graceful Exit...");
    mongoose.connection.close()
        .then(() => {
            process.exit(0);
        })
        .catch(console.error);
};
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB initialized"))
    .catch(console.error);
