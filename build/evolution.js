const CheckSpan = [-1, 0, 1];
export class Evolution {
    constructor(lifeMatrix) {
        this.lifeMatrix = lifeMatrix;
        this.alive = new Set();
        this.deadCache = new Set();
        this.rebornCache = new Set();
        this.executeCache = new Set();
        lifeMatrix.forEach(row => {
            row.forEach(cell => {
                if (cell.alive) {
                    this.alive.add(cell);
                }
            });
        });
    }
    getCell(x, y) {
        try {
            return this.lifeMatrix[x][y];
        }
        catch (e) {
            return undefined;
        }
    }
    execute(cell) {
        cell.alive = false;
        this.alive.delete(cell);
    }
    reborn(cell) {
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
                        }
                        else {
                            deadNumber++;
                            // may be to alive
                            this.deadCache.add(checkCell);
                        }
                    }
                });
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
                });
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
