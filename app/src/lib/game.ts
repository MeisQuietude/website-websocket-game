import Field from "./field";
import { Namespace, Socket } from "socket.io";
import { Game as GameModel } from "../data";
import { InstanceType } from "typegoose";
import { GameSchema } from "../data/models/game";

class Client {
    public socket: Socket;
    public value: number;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    toString = (): string => this.socket.id;
}

class Game {
    private static Model = GameModel;
    private ModelRecord: InstanceType<GameSchema>;

    private name: string;
    private fieldSize: number;
    private winCombination: number;

    public player1: Client;
    public player2: Client;
    public spectators: Client[] = [];

    public field: Field;

    constructor(name: string, fieldSize: number, winCombination: number) {
        this.name = name;
        this.fieldSize = fieldSize;
        this.winCombination = winCombination;

        this.field = new Field(this.fieldSize, this.winCombination); // TODO: should I create an empty field here?
    }

    public static init = async (id: string, roomClients: Namespace): Promise<Game> => {
        const gameRecord = await Game.Model.findById(id).exec();

        const { name, fieldSize, winCombination, cellTable, player1, player2, spectators } = gameRecord;

        const gameInstance = new Game(name, fieldSize, winCombination);
        gameInstance.field = new Field(fieldSize, winCombination, cellTable);

        if (player1) {
            gameInstance.player1 = new Client(roomClients.sockets[player1]);
        }
        if (player2) {
            gameInstance.player2 = new Client(roomClients.sockets[player2]);
        }
        if (spectators && spectators.length > 0) {
            gameInstance.spectators = spectators.map(spectator => new Client(roomClients.sockets[spectator]));
        }

        gameInstance.ModelRecord = gameRecord;

        return gameInstance;
    }

    public save = async (): Promise<void> => {
        const { name, fieldSize, winCombination, field } = this;

        if (!this.ModelRecord) {
            this.ModelRecord = await Game.Model.create({
                name,
                fieldSize,
                winCombination,
                cellTable: field.cellTable,
            });
        } else {
            await this.ModelRecord.updateOne({
                cellTable: field.cellTable,
            }).exec();
        }

        await this.ModelRecord.save();
    }

    public update = async (): Promise<void> => {
        this.ModelRecord = await Game.Model.findById(this.ModelRecord.id);
        this.field.cellTable = this.ModelRecord.cellTable;
    }

    public actionTurn = async (client: Socket, cellIndex: number): Promise<number> => {
        const player = this._onlyPlayerAccess(client);
        if (!player) return null;

        await this.update();

        const { row, col } = this.translateFlatToIndex(cellIndex);

        if (this.field.getCellValue(row, col) == 0) {
            this.field.setCellValue(row, col, player.value);
            await this.save();
            return player.value;
        }
        return null;
    }

    public isWin = (flatIndex: number): number => {
        const { row, col } = this.translateFlatToIndex(flatIndex);
        const isWin_ = this.field.isWin(row, col);
        if (isWin_ && isWin_.player) {
            return isWin_.player;
        }
    };

    public addClient = async (client: Socket): Promise<void> => {
        if (!this.player1) {
            await this._setPlayer1(client);
            return;
        }
        if (!this.player2) {
            await this._setPlayer2(client);
            return;
        }
        await this._addSpectator(client);
    }

    public isPlayerLeave = (socketId: string): boolean => {
        return [this.player1.toString(), this.player2.toString()].includes(socketId);
    }

    public destroyRoom = async (): Promise<void> => {
        await this.ModelRecord.updateOne({ $set: { gameStatus: 2, finished: true } }).exec();
    }

    public spectatorLeave = async (socketId: string): Promise<void> => {
        this.spectators = this.spectators.filter(client => client.toString() !== socketId);
        await this.ModelRecord.updateOne({ $set: { spectators: this.spectators } }).exec();
    }

    private _setPlayer1 = async (client: Socket): Promise<void> => {
        this.player1 = new Client(client);
        this.player1.value = 1;

        await this.ModelRecord.updateOne({
            $set: {
                player1: client.id,
                gameStatus: (this.player2) ? 1 : 0,
            },
        }).exec();
    }

    private _setPlayer2 = async (client: Socket): Promise<void> => {
        this.player2 = new Client(client);
        this.player2.value = 2;

        await this.ModelRecord.updateOne({
            $set: {
                player2: client.id,
                gameStatus: (this.player1) ? 1 : 0,
            },
        }).exec();
    }

    private _addSpectator = async (client: Socket): Promise<void> => {
        this.spectators.push(new Client(client));

        await this.ModelRecord.updateOne({ spectators: this.spectators.map(client_ => client_.toString()) }).exec();
    }

    private _onlyPlayerAccess = (client: Socket): Client => {
        if (client.id == this.player1.toString()) {
            return this.player1;
        }
        if (client.id == this.player2.toString()) {
            return this.player2;
        }
        return null;
    }

    private translateFlatToIndex = (flatIndex: number) => {
        return {
            row: Math.floor(flatIndex / this.fieldSize),
            col: flatIndex % this.fieldSize,
        };
    }

    private translateIndexToFlat = (row: number, col: number): number => {
        return this.fieldSize * row + col;
    }
}

export default Game;
