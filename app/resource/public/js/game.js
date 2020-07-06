window.onload = async () => {
    // Socket.IO
    const socket = io();
    await socket.emit("game-join", vars.id);

    window.onbeforeunload = async () => {
        await socket.emit("game-leave", socket.id);
        socket.disconnect();
    };

    socket.on("game-join-front", (cellTableFlatted) => {
        document.querySelectorAll(".game-cell-input").forEach((node, i) => {
            if (cellTableFlatted[i] === 0) {
                node.disabled = false;
                return null;
            }
            if (cellTableFlatted[i] === 1) {
                node.disabled = true;
                return null;
            }
            if (cellTableFlatted[i] === 2) {
                node.disabled = true;
                return null;
            }
        });
    });

    socket.on("game-leave-front", async (socketId) => {
        await socket.emit("game-leave", socketId);
    });

    socket.on("game-finish-front", () => {
        alert("The game has ended!");
        window.location.href = "/";
    });

    socket.on("message", (message) => {
        console.log(message);
    });

    socket.on("game-turn", (cellIndex) => {
        const node = document.querySelectorAll(".game-cell-input").item(cellIndex);
        node.disabled = true;
    });

    // DOM
    document.querySelectorAll(".game-cell-input").forEach((node, index) => {
        node.addEventListener("click", async (event) => {
            if (!event.target) {return;}
            await socket.emit("game-turn", index);
        });
    });

};