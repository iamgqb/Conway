export const CellSize = 10;

export type CellId = string;

export function generateCellId(x: number, y: number) {
    return `${x}::${y}`;
}

export class Cell {
    private _id: string;
    constructor(
        private _x: number,
        private _y: number,
        public alive: boolean
    ) {
        this._id = generateCellId(_x, _y);
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get id() {
        return this._id;
    }
}
