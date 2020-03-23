export const CellSize = 10;

export class Cell {
    private _id: string;
    constructor(
        private _x: number,
        private _y: number,
        public alive: boolean
    ) {
        this._id = `${_x}::${_y}`;
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillRect(
            this.x * CellSize,
            this.y * CellSize,
            CellSize,
            CellSize,
        )
    }
}
