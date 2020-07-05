import EventConstructor from "./_eventConstructor";
import Game from "../../lib/game";

interface Arguments {
    name: string;
    fieldSize: number;
    winCombination: number;
}

class Events extends EventConstructor {
    protected game: Game;

    public roomId: string;

    public create = async (args: Arguments): Promise<void> => {
        const { name, fieldSize, winCombination } = args;

        this.game = new Game(name, fieldSize, winCombination);
        await this.game.save();
    }

    public init = async (gameId: string): Promise<void> => {
        if (!this.game) {
            this.game = await Game.init(gameId);
        }
    }

    public join = async (id: string): Promise<void> => {
        await this.init(id);

        this.socket.join(id);
        this.roomId = id;

        await this.game.addClient(this.socket);
    }

    public message = (message: string): void => {
        this.serverIO.to(this.roomId).emit("message", { message });
    };

    public turn = (cellIndex: number): void => {
        this.game.actionTurn(this.socket, cellIndex);
    };

    public leave = async (socketId: string): Promise<void> => {
        if (this.game.isPlayerLeave(socketId)) {
            // Player leaved
            await this.game.destroyRoom();
            this.serverIO.to(this.roomId).emit("game-finish-front");
            return;
        }
        // Spectator leaved
        await this.game.spectatorLeave(socketId);
    }
}

export default Events;
