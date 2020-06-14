const chatContainer = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");

const chatAppendMessage = message => {
    const p = document.createElement("p");
    p.innerText = message;
    chatContainer && chatContainer.appendChild(p);
};

window.onload = () => {
    chatInput.value = "";
};

// Socket.IO
const socket = io();

socket.on("chat", message => {
    chatAppendMessage(message);
});

// DOM
const btnChat = document.getElementById("chat-send-btn");
btnChat.addEventListener("click", () => {
    const text = chatInput && chatInput.value;

    if (text) {
        socket.emit("chat", text);
    }

    chatInput.value = "";
});
