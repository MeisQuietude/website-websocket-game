import { prop, Typegoose } from "typegoose";

export class GameSchema extends Typegoose {
    @prop({
        minlength: 1,
        maxlength: 10,
    })
    name: string;

    @prop()
    cellTable: number[][];

    @prop({
        min: 3,
        max: 12,
        default: 3,
    })
    fieldSize: number;

    @prop({
        min: 3,
        max: 12,
        default: 3,
        // validate: {
        //     validator: (value) => this.fieldSize && value <= this.fieldSize,
        //     message: props => `Win Combination (${props.value}) cannot be less then field size (${this.fieldSize})`,
        // },
    })
    winCombination: number;

    @prop({
        // enum: GAME_STATUS,  // TODO: why it does not work?
        default: 0,
        // validate: {
        //     validator: value => ["no", "wait", "play"].includes(value),
        //     message: props => `${props.value} is not a valid game status`,
        // },
    })
    gameStatus: number;

    @prop({
        default: false,
    })
    finished: boolean;

    @prop()
    player1: string;

    @prop()
    player2: string;

    @prop()
    spectators: string[];
}

export const GameModel = new GameSchema().getModelForClass(GameSchema);
