import Field from "./field";
import { Socket } from "socket.io";
import { Game as GameModel } from "../data";
import { Document } from "mongoose";

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
    private ModelRecord: Document;

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
    }

    public static init = async (id: string): Promise<Game> => {
        const record = await Game.Model.findById(id).exec();

        const game = new Game(record.get("name"), record.get("fieldSize"), record.get("winCombination"));
        game.field = (new Field(game.fieldSize, game.winCombination)).init(record.get("field"));
        game.player1 = record.get("player1");
        game.player2 = record.get("player2");
        game.spectators = record.get("spectators");

        game.ModelRecord = record;

        return game;
    }

    public save = async (): Promise<void> => {
        this.field = new Field(this.fieldSize, this.winCombination);
        const fieldId = (await this.field.save()).id;

        this.ModelRecord = new Game.Model({
            name: this.name,
            field: fieldId,
            fieldSize: this.fieldSize,
            winCombination: this.winCombination,
        });

        await this.ModelRecord.save();
    }

    public actionTurn = (client: Socket, cellIndex: number): void => {
        const player = this._onlyPlayerAccess(client);
        if (!player) return;

        const row = Math.floor(cellIndex / this.fieldSize);
        const col = cellIndex % this.fieldSize;

        if (this.field.getCellValue(row, col) == 0) {
            this.field.setCellValue(row, col, player.value);
        }
    }

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
}

export default Game;
