import serverHTTP from "./http/server";
import serverIO from "./socket/server";

const express = serverHTTP.listen(3000, () => {
    console.log('Server listening on port 3000!')
    serverIO.attach(express, {
        pingInterval: 10000,
        pingTimeout: 5000,
    })
    console.log(`Socket.io attached to HTTP Server`);
})
