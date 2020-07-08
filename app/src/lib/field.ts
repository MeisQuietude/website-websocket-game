interface WinReturn {
    player: number;
}

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

    public isWin = (row: number, col: number): WinReturn => {
        const playerValue = this.cellTable[row][col];

        // Horizontal
        const horizontalLine = this.cellTable[row];
        const horizontalSubsets = this.winSubsetSplit(horizontalLine);
        const horizontalWin = this.checkWinSubsets(horizontalSubsets);

        if (horizontalWin) {
            return {
                player: playerValue,
            };
        }

        // Vertical
        const verticalLine = this.cellTable.map(line => line[col]);
        const verticalSubsets = this.winSubsetSplit(verticalLine);
        const verticalWin = this.checkWinSubsets(verticalSubsets);

        if (verticalWin) {
            return {
                player: playerValue,
            };
        }

        // Main Diagonal
        const mainDiagonalLine = this.getMainDiagonalLine(row, col);
        const mainDiagonalSubsets = this.winSubsetSplit(mainDiagonalLine);
        const mainDiagonalWin = this.checkWinSubsets(mainDiagonalSubsets);

        if (mainDiagonalWin) {
            return {
                player: playerValue,
            };
        }

        // Additional Diagonal
        const additionalDiagonalLine = this.getAdditionalDiagonalLine(row, col);
        const additionalDiagonalSubsets = this.winSubsetSplit(additionalDiagonalLine);
        const additionalDiagonalWin = this.checkWinSubsets(additionalDiagonalSubsets);

        if (additionalDiagonalWin) {
            return {
                player: playerValue,
            };
        }

        // Draw
        let isDrawFlag = true;
        for (let i = 0; i < this.fieldSize && isDrawFlag; i++) {
            for (let j = 0; j < this.fieldSize && isDrawFlag; j++) {
                if (this.cellTable[i][j] === 0) {
                    isDrawFlag = false;
                }
            }
        }
        if (isDrawFlag) {
            return {
                player: 0,
            };
        }
    }

    private checkWinSubsets = (subsets: number[][]): boolean => {
        for (let i = 0, subset_ = subsets[i]; i < subsets.length; i++, subset_ = subsets[i]) {
            const set_ = new Set(subset_);

            if (set_.size === 1) {
                return true;
            }
        }
        return false;
    }

    private winSubsetSplit = (line: number[]): number[][] => {
        if (line.length == this.winCombination) {
            return [line];
        }

        const subsetList: number[][] = [];
        for (let i = 0; i < this.fieldSize - this.winCombination; i++) {
            subsetList.push(line.slice(i, i + this.winCombination));
        }
        return subsetList;
    }

    private getMainDiagonalLine = (row: number, col: number): number[] => {
        const difference = Math.min(row, col);

        const startCellRow = row - difference;
        const startCellCol = col - difference;

        const resultLine = [];

        for (let i = startCellRow, j = startCellCol; i < this.fieldSize && j < this.fieldSize; i++, j++) {
            resultLine.push(this.cellTable[i][j]);
        }

        return resultLine;
    }

    private getAdditionalDiagonalLine = (row: number, col: number): number[] => {
        const startCellRow = row % this.fieldSize;
        const startCellCol = row + col;

        const resultLine = [];

        for (let i = startCellRow, j = startCellCol; i < this.fieldSize && j >= 0; i++, j--) {
            resultLine.push(this.cellTable[i][j]);
        }

        return resultLine;
    }
}

export default Field;
