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

        const gameInstance = new Game(name, fieldSize, winCombination);
        await gameInstance.save();
    }

    public join = async (id: string): Promise<void> => {
        this.socket.join(id);
        this.roomId = id;

        if (!this.game) {
            this.game = await Game.init(id, this.serverIO.clients());
        }

        await this.game.addClient(this.socket);
        this.socket.emit("game-join-front", {
            cellTableFlatted: [].concat(...this.game.field.cellTable),
            WHOAMI: this.game.whoami,
        });
    }

    public message = (message: string): void => {
        this.serverIO.to(this.roomId).emit("message", { message });
    };

    public turn = async (cellIndex: number): Promise<void> => {
        const cellStatus = await this.game.actionTurn(this.socket, cellIndex);
        if (!cellStatus) {
            return;
        }

        // Emit about successful turn
        this.serverIO.to(this.roomId).emit("game-turn", { cellIndex, cellStatus });

        const winPlayer = this.game.isWin(cellIndex);
        if (winPlayer !== undefined) {
            // Emit about win
            this.serverIO.to(this.roomId).emit("game-finish-win-front", winPlayer);
        }
    };

    public leave = async (): Promise<void> => {
        if (this.game.isPlayerLeave()) {
            // Player leaved
            await this.game.destroyRoom();
            this.serverIO.to(this.roomId).emit("game-finish-front");
            return;
        }
        // Spectator leaved
        await this.game.spectatorLeave(this.socket);
    }
}

export default Events;
