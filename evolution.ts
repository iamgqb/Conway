import { Cell } from "./cell.js";

const CheckSpan = [-1, 0, 1];

export class Evolution {
    private alive: Set<Cell> = new Set();
    
    private deadCache: Set<Cell> = new Set();
    private rebornCache: Set<Cell> = new Set();
    private executeCache: Set<Cell> = new Set();
    constructor(
        private lifeMatrix: Cell[][]
    ) {
        lifeMatrix.forEach(row => {
            row.forEach(cell => {
                if (cell.alive) {
                    this.alive.add(cell);
                }
            });
        });
    }

    private getCell(x: number, y: number): Cell | undefined {
        try {
            return this.lifeMatrix[x][y];
        } catch (e) {
            return undefined;
        }
    }

    private execute(cell: Cell) {
        cell.alive = false;
        this.alive.delete(cell);
    }

    private reborn(cell: Cell) {
        cell.alive = true;
        this.alive.add(cell);
    }

    getAliveCells() {
        return [...this.alive];
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
                    const checkCell = this.getCell(checkX, checkY);

                    if (checkCell) {
                        if (checkCell.alive) {
                            lifeNumber++;
                        } else {
                            deadNumber++;
                            // may be to alive
                            this.deadCache.add(checkCell);
                        }
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
                    const checkCell = this.getCell(checkX, checkY);
    
                    if (checkCell) {
                        if (checkCell.alive) {
                            lifeNumber++;
                        }
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


}
