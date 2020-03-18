class Player {
    
}

class Field {
    private minFieldSize = 3;
    private maxFieldSize = 12;

    fieldSize: number;
    winCombination: number;

    field: Array<Array<number>>;

    constructor(fieldSize: number, winCombination: number) {
        if (fieldSize >= this.minFieldSize && fieldSize <= this.maxFieldSize) {
            this.fieldSize = fieldSize;
        } else {
            throw new Error("Field size is incorrect");
        }
        if (winCombination <= fieldSize) {
            this.winCombination = winCombination;
        } else {
            throw new Error("Win combination number must be less or equal to field size")
        }
        this._buildField();
    }

    private _buildField = () => {
        /**
         * create (fieldSize x fieldSize) array
         * filled by zeros
         */
        let field = [];
        field.length = this.fieldSize;
        field.fill([]);

        let zerosArray = [];
        for (let i = 0; i < this.fieldSize; i++) {
            zerosArray.length = this.fieldSize;
            zerosArray.fill(0);
            field[i] = zerosArray;
        }
        this.field = field;
    }
}

class Game {
    player1: Player;
    player2: Player;
    field: Field;

    constructor(field: Field, player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player1;
        this.field = field;
    }
}
