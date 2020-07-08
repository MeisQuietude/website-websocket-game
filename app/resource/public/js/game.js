window.onload = async () => {
    const CELL_STATUS = Object.freeze({
        EMPTY: {
            backValue: 0,
            frontValue: "",
        },
        PLAYER1: {
            backValue: 1,
            frontValue: "X",
        },
        PLAYER2: {
            backValue: 2,
            frontValue: "O",
        },
    });

    const localVars = { ...vars };

    localVars.finished = false;

    // Socket.IO
    const socket = io();
    await socket.emit("game-join", localVars.id);

    const finishGameFront = (message) => {
        vars.finished = true;
        alert(message);
    };

    window.addEventListener("beforeunload", function(e) {
        (async () => {
            await socket.emit("game-leave");
        })();

        if (localVars.finished || localVars.whoami === "Spectator") {
            return undefined;
        }

        return (e || window.event).returnValue;
    });

    socket.on("game-join-front", ({ cellTableFlatted, WHOAMI }) => {
        vars.whoami = WHOAMI;
        document.querySelector("#whoami").innerHTML = WHOAMI;
        document.querySelectorAll(".game-cell-input").forEach((node, i) => {
            if (cellTableFlatted[i] === CELL_STATUS.EMPTY.backValue) {
                node.disabled = (WHOAMI === "Spectator");
                node.value = CELL_STATUS.EMPTY.frontValue;
                return null;
            }
            if (cellTableFlatted[i] === CELL_STATUS.PLAYER1.backValue) {
                node.disabled = true;
                node.value = CELL_STATUS.PLAYER1.frontValue;
                return null;
            }
            if (cellTableFlatted[i] === CELL_STATUS.PLAYER2.backValue) {
                node.disabled = true;
                node.value = CELL_STATUS.PLAYER2.frontValue;
                return null;
            }
        });
    });

    socket.on("game-finish-front", () => {
        finishGameFront("Игра окончена!");
        vars.finished = true;
        window.location.replace("/");
    });

    socket.on("game-finish-win-front", (playerValue) => {
        vars.finished = true;

        let message;
        if (playerValue === 0) {
            message = "Ничья!";
        } else {
            message = `Победа игрока ${playerValue}`;
        }
        alert(message);
        window.location.replace("/");
    });

    socket.on("message", (message) => {
        console.log(message);
    });

    socket.on("game-turn", ({ cellStatus, cellIndex }) => {
        const node = document.querySelectorAll(".game-cell-input").item(cellIndex);

        node.disabled = true;
        if (cellStatus === CELL_STATUS.PLAYER1.backValue) {
            node.value = CELL_STATUS.PLAYER1.frontValue;
        }
        if (cellStatus === CELL_STATUS.PLAYER2.backValue) {
            node.value = CELL_STATUS.PLAYER2.frontValue;
        }
    });

    // DOM
    document.querySelectorAll(".game-cell-input").forEach((node, index) => {
        node.addEventListener("click", async (event) => {
            if (!event.target) {return;}
            await socket.emit("game-turn", index);
        });
    });

};