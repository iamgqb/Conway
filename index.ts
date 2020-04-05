import { Cell, CellSize } from './cell.js';
import { Evolution } from './evolution.js';

const gridX = 60;
const gridY = 60;
const canvasWidth = gridX * CellSize;
const canvasHeight = gridY * CellSize;

const canvas = document.createElement('canvas');
canvas.id = 'stage';
canvas.width = canvasWidth;
canvas.height = canvasHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('no ctx');
}

function drawGrid() {
    if (!ctx) {
        return;
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'grey';

    for (let i = 0; i < gridX + 1; i++) {
        const x = i * CellSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }
    
    for (let i = 0; i < gridY + 1; i++) {
        const y = i * CellSize;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

function drawCell(cell: Cell) {
    if (!ctx) {
        return;
    }

    ctx.fillRect(
        cell.x * CellSize,
        cell.y * CellSize,
        CellSize,
        CellSize,
    )
    
}

const seed = [
    {x: 0, y: 1},
    {x: 1, y: 2},
    {x: 2, y: 0},
    {x: 2, y: 1},
    {x: 2, y: 2}
];
// const seed = [
//     '2::2',
//     '1::2',
//     '3::2',
// ]

const lifeCells: Cell[] = [];
seed.forEach(pos => {
    lifeCells.push(new Cell(pos.x, pos.y, true));
})

canvas.addEventListener('click', e => {
    const x = (e.offsetX / CellSize) >> 0;
    const y = (e.offsetY / CellSize) >> 0;

    const cells: Cell[] = [];
    seed.forEach(s => {
        cells.push(new Cell(s.x + x, s.y + y, true))
    })
    evolution.addAliveCell(cells)
})

const evolution = new Evolution(lifeCells, false, gridX, gridY);

const LoopTick = 5;
let tick = 0;
function loop() {
    if (!ctx) {
        return;
    }

    tick++;
    if (tick !== LoopTick) {
        window.requestAnimationFrame(loop);
        return;
    }
    tick = 0;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawGrid();

    evolution.eval().forEach(cell => drawCell(cell));
    // evolution.getAliveCells().forEach(cell => cell.draw(ctx));

    window.requestAnimationFrame(loop);
}

loop();