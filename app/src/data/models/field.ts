import { prop, Typegoose } from "typegoose";
import { Schema } from "mongoose";

const _schema = new Schema({
    fieldSize: {
        type: Number,
        min: 3,
        max: 12,
        default: 3,
    },
    winCombination: {
        type: Number,
        min: 3,
        max: 12,
        default: 3,
        // validate: {
        //     validator: (value) => this.fieldSize && value <= this.fieldSize,
        //     message: props => `Win Combination (${props.value}) cannot be less then field size (${this.fieldSize})`,
        // },
    },
    turns: {
        /*
         * 0 - cell is empty
         * 1 - cell is X
         * 2 - cell is O
         */
        type: [[Number]],
    },
});

export class FieldSchema extends Typegoose {

    @prop({
        min: 3,
        max: 12,
        default: 3,
    })
    fieldSize?: number;

    @prop({
        min: 3,
        max: 12,
        default: 3,
        // validate: {
        //     validator: (value: number): boolean => this.fieldSize && value <= this.fieldSize,
        //     message: (props): string => `Win Combination (${props.value}) cannot be less then field size (${this.fieldSize})`,
        // },
    })
    winCombination?: number;


    @prop()
    /*
     * 0 - cell is empty
     * 1 - cell is X
     * 2 - cell is O
     */
    turns?: [[number]];

}

export const FieldModel = new FieldSchema().getModelForClass(FieldSchema);
