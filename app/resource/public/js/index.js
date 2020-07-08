const chatContainer = document.getElementById("chat-messages");
// const chatInput = document.getElementById("chat-input");
// const chatSendBtn = document.getElementById("chat-send-btn");
const createGameForm = document.getElementById("createGameForm");

// const chatAppendMessage = (message) => {
//     const p = document.createElement("p");
//     p.innerText = message;
//     chatContainer && chatContainer.appendChild(p);
// };

window.onload = () => {
    chatInput.value = "";
};

// Socket.IO
const socket = io();

// socket.on("chat", (message) => {
//     chatAppendMessage(message);
// });
//
// // DOM
// chatSendBtn.addEventListener("click", () => {
//     const text = chatInput && chatInput.value;
//
//     if (text) {
//         socket.emit("chat", text);
//     }
//
//     chatInput.value = "";
// });

createGameForm.addEventListener("submit", async () => {
    console.log("submit");
    await socket.emit("game-create", {
        name: createGameForm.querySelector("#name").value || "GameRoom",
        fieldSize: 3,
        winCombination: 3,
    });
});
