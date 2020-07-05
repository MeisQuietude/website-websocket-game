import EventConstructor from "./_eventConstructor";

class Events extends EventConstructor {

    public sendChatMessage = (message: string): void => {
        this.serverIO.emit("chat", message);
    };

}

export default Events;
