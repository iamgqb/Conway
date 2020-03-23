import { Cell, CellSize } from './cell.js';
import { Evolution } from './evolution.js';

const canvas = document.querySelector<HTMLCanvasElement>('#stage');
if (!canvas) {
    throw new Error('no stage');
}
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('no ctx');
}

const seed = [
    '1::2',
    '2::3',
    '3::1',
    '3::2',
    '3::3',
];
// const seed = [
//     '2::2',
//     '1::2',
//     '3::2',
// ]

const stageWidth = 40;
const stageHeight = 40;
const lifeMatrix: Cell[][] = [];
for (let i = 0; i < stageWidth; i++) {
    const xArray = [];
    for (let j = 0; j < stageHeight; j++) {
        let status = seed.indexOf(`${i}::${j}`) > -1;
        const cell = new Cell(i, j, status);
        xArray.push(cell);
    }
    lifeMatrix.push(xArray);
}

const evolution = new Evolution(lifeMatrix);

const LoopTick = 15;
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

    evolution.eval().forEach(cell => cell.draw(ctx));

    window.requestAnimationFrame(loop);
}

loop();