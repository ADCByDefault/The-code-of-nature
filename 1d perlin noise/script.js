const canvas = document.getElementById("canvas");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const points = [];
let y = canvas.height / 2;

const animateEvery = 5;
let frame = 1;

function animate() {
    requestAnimationFrame(animate);
    if (frame % animateEvery !== 0) {
        frame++;
        return;
    }
    frame = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // randomFunction();
    y = perlinNoise(y);
}

animate();

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function randomFunction() {
    // get a random y value
    points.push(randomInt(0, canvas.height));
    // if points array is longer than half the width
    // of the canvas remove the first point so at max
    // we use only half the canvas
    if (points.length > canvas.width / 2) {
        points.shift();
    }
    // draw the y value al increasing x by one
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        ctx.lineTo(i, points[i]);
    }
    ctx.stroke();
}
function perlinNoise(y) {
    const strength = 10;
    const zoom = 10;
    if (points.length > canvas.width / (2 * zoom)) {
        points.shift();
    }
    if (
        (Math.random() < 0.5 && y + strength < canvas.height) ||
        y <= strength
    ) {
        y += strength * Math.random();
    } else {
        y -= strength * Math.random();
    }
    points.push(y);
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        ctx.lineTo(i * zoom, points[i]);
    }
    ctx.stroke();
    return y;
}
