import { Field as FieldModel } from "../data";
import { Document, isValidObjectId } from "mongoose";

class Field {
    private Model = FieldModel;
    private ModelRecord: Document;

    private minFieldSize = 3;
    private maxFieldSize = 12;

    public fieldSize: number;
    public winCombination: number;

    public field: Array<Array<number>>;

    constructor(fieldSize: number, winCombination: number) {
        if (fieldSize >= this.minFieldSize && fieldSize <= this.maxFieldSize) {
            this.fieldSize = fieldSize;
        } else {
            throw new Error("Field size is incorrect");
        }
        if (winCombination <= fieldSize) {
            this.winCombination = winCombination;
        } else {
            throw new Error(
                "Win combination number must be less or equal to field size"
            );
        }
    }

    public save = async (): Promise<Document> => {
        const zeroArray = [];

        for (let i = 0; i < this.fieldSize; i++) {
            const nestedArray = [];
            for (let j = 0; j < this.fieldSize; j++) {
                nestedArray.push(0);
            }
            zeroArray.push(nestedArray);
        }

        this.ModelRecord = new this.Model({
            fieldSize: this.fieldSize,
            winCombination: this.winCombination,
            turns: zeroArray,
        });

        return await this.ModelRecord.save();
    }

    public init = (modelRecordId: string): Field => {
        if (!isValidObjectId(modelRecordId)) {
            return;
        }
        // this.ModelRecord = this.Model.findById(modelRecordId);

        console.log(this.ModelRecord);

        this.fieldSize = this.ModelRecord.get("fieldSize");
        this.winCombination = this.ModelRecord.get("winCombination");
        this.field = this.ModelRecord.get("turns");

        return this;
    }

    public getCellValue = (row: number, column: number): number => {
        return this.field[row][column];
    }

    public setCellValue = (row: number, column: number, value: number): void => {
        // Value is [0, 1, 2]
        this.field[row][column] = value;
    }

    private _build = (): Array<Array<number>> => {
        /**
         * create (fieldSize x fieldSize) array
         * filled by zeros
         */
        const field: Array<Array<number>> = [];
        field.length = this.fieldSize;
        field.fill([]);

        const zerosArray: Array<number> = [];
        for (let i = 0; i < this.fieldSize; i++) {
            zerosArray.length = this.fieldSize;
            zerosArray.fill(0);
            field[i] = zerosArray;
        }
        this.field = field;

        return field;
    };

    rebuild(): Array<Array<number>> {
        return this._build();
    }
}

export default Field;
