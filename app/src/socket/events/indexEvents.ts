import Models from "../../data";
import EventConstructor from "./_eventConstructor";

class Events extends EventConstructor {

    public sendChatMessage = (message: string): void => {
        this.serverIO.emit("chat", message);
    };

    public createGameInstance = async (): Promise<void> => {
        const { Game } = Models;
        const game = new Game({ username: "TestUsername" });
        await game.save();
        this.serverIO.emit("createGameDone", game);
    };
}

export default Events;
