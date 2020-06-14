import expressApplication from "./http/app";
import io from "socket.io";

const serverHTTP = expressApplication.listen(3000, "0.0.0.0", () => {
    console.log("Server listening on port 3000!");
});

const serverIO = io(serverHTTP, {
    pingInterval: 10000,
    pingTimeout: 5000,
});
