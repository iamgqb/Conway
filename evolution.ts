import { Cell, generateCellId } from "./cell.js";

const CheckSpan = [-1, 0, 1];

export class Evolution {
    private alive: Map<string, Cell> = new Map();

    private deadCache: Set<Cell> = new Set();
    private rebornCache: Set<Cell> = new Set();
    private executeCache: Set<Cell> = new Set();
    constructor(
        cells: Cell[] = [],
        private globalWorld: boolean = false,
        private worldX: number = 0,
        private worldY: number = 0,
    ) {
        this.addAliveCell(cells);
    }

    private getAliveCell(x: number, y: number): Cell | undefined {
        if (!this.globalWorld) {
            if (x < 0 || y < 0 || x > this.worldX || y > this.worldY) {
                return undefined;
            }
        }
        return this.alive.get(generateCellId(x, y));
    }

    private createCell(x: number, y: number, alive: boolean = false): Cell {
        return new Cell(x, y, alive);
    }

    private execute(cell: Cell) {
        cell.alive = false;
        this.alive.delete(cell.id);
    }

    private reborn(cell: Cell) {
        cell.alive = true;
        this.alive.set(cell.id, cell);
    }

    getAliveCells() {
        return [...this.alive.values()];
    }

    eval() {
        // check alive cell to die
        // according these alive cell take which cell will be reborn
        this.alive.forEach(cell => {
            let lifeNumber = 0;
            let deadNumber = 0;
            CheckSpan.forEach(xSpan => {
                CheckSpan.forEach(ySpan => {
                    if (xSpan === 0 && ySpan === 0) {
                        return;
                    }

                    const checkX = cell.x + xSpan;
                    const checkY = cell.y + ySpan;
                    const aliveCell = this.getAliveCell(checkX, checkY);

                    if (aliveCell) {
                        lifeNumber++;
                    } else {
                        deadNumber++;
                        this.deadCache.add(this.createCell(checkX, checkY));
                    }
                })
            });

            if (lifeNumber < 2 || lifeNumber > 3) {
                // to die
                this.executeCache.add(cell);
            }
        });

        // check dead cell to reborn
        this.deadCache.forEach(cell => {
            let lifeNumber = 0;
            CheckSpan.forEach(xSpan => {
                CheckSpan.forEach(ySpan => {
                    if (xSpan === 0 && ySpan === 0) {
                        return;
                    }

                    const checkX = cell.x + xSpan;
                    const checkY = cell.y + ySpan;
                    const aliveCell = this.getAliveCell(checkX, checkY);

                    if (aliveCell) {
                        lifeNumber++;
                    }
                })
            });
            if (lifeNumber === 3) {
                this.rebornCache.add(cell);
            }
        });

        this.executeCache.forEach(c => this.execute(c));
        this.rebornCache.forEach(c => this.reborn(c));

        this.executeCache.clear();
        this.rebornCache.clear();
        this.deadCache.clear();

        return this.getAliveCells();
    }

    addAliveCell(cells: Cell[]) {
        cells.forEach(cell => this.alive.set(cell.id, cell));
    }
}
