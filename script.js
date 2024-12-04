const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions based on the Telegram Mini App viewport
canvas.width = window.innerWidth - 40; // Width adjustment
canvas.height = window.innerHeight - 100; // Height adjustment

let painting = false;
let brushColor = document.getElementById('colorPicker').value;
let brushSize = document.getElementById('brushSize').value;
let brushType = document.getElementById('brushType').value;
let actions = []; // Array to store canvas states
let eraserMode = false; // Eraser mode

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath(); // Start a new path
}

function draw(e) {
    if (!painting) return;

    // Determine coordinates based on event type (touch or mouse)
    let x, y;
    if (e.touches) { // For touch events
        x = e.touches[0].clientX - canvas.offsetLeft;
        y = e.touches[0].clientY - canvas.offsetTop;
    } else { // For mouse events
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;
    }

    ctx.lineWidth = brushSize; // Set brush size
    ctx.lineCap = brushType; // Set brush type

    ctx.strokeStyle = eraserMode ? "#FFFFFF" : brushColor; // Use white for eraser

    ctx.lineTo(x, y);
    ctx.stroke(); // Draw line
    ctx.beginPath(); // Start a new path
    ctx.moveTo(x, y); // Move to new point

    // Save current canvas state for undo functionality
    actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// Mouse events
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Touch events for mobile devices
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent scrolling
    startPosition(e);
});
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Prevent scrolling
    draw(e);
});

// Change brush color and size
document.getElementById('colorPicker').addEventListener('input', function() {
   brushColor = this.value;
});

document.getElementById('brushSize').addEventListener('input', function() {
   brushSize = this.value;
});

// Change brush type
document.getElementById('brushType').addEventListener('change', function() {
   brushType = this.value;
});

// Clear the canvas
document.getElementById('clearButton').addEventListener('click', function() {
   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
   actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Save state after clearing
});

// Toggle eraser mode
document.getElementById('eraserButton').addEventListener('click', function() {
   eraserMode = !eraserMode; // Toggle eraser mode
   this.textContent = eraserMode ? 'Brush' : 'Eraser'; // Change button text based on mode
});

// Initialize Telegram WebApp API for better integration with Telegram Mini Apps
(function() {
   const tgWebApp = window.Telegram.WebApp;

   tgWebApp.ready(); // Notify that the app is ready

   // Optional: Expand the Mini App to full height if needed
   if (!tgWebApp.isExpanded) {
       tgWebApp.expand();
   }
})();
