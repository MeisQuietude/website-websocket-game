class Field {
    private minFieldSize = 3;
    private maxFieldSize = 12;

    public fieldSize: number;
    public winCombination: number;

    public cellTable: number[][];

    constructor(fieldSize: number, winCombination: number, cellTable?: number[][]) {
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

        if (cellTable) {
            this.cellTable = cellTable;
        } else {
            const zeroArray: number[][] = [];
            for (let i = 0; i < this.fieldSize; i++) {
                const nestedArray: number[] = [];
                for (let j = 0; j < this.fieldSize; j++) {
                    nestedArray.push(0);
                }
                zeroArray.push(nestedArray);
            }

            this.cellTable = zeroArray;
        }
    }

    public getCellValue = (row: number, column: number): number => {
        return this.cellTable[row][column];
    }

    public setCellValue = (row: number, column: number, value: number): void => {
        this.cellTable[row][column] = value;
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
        this.cellTable = field;

        return field;
    };

    rebuild(): Array<Array<number>> {
        return this._build();
    }
}

export default Field;
