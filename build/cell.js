export const CellSize = 10;
export function generateCellId(x, y) {
    return `${x}::${y}`;
}
export class Cell {
    constructor(_x, _y, alive) {
        this._x = _x;
        this._y = _y;
        this.alive = alive;
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
