const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 40; // Установка ширины канваса
canvas.height = window.innerHeight - 100; // Установка высоты канваса

let painting = false;
let brushColor = document.getElementById('colorPicker').value;
let brushSize = document.getElementById('brushSize').value;
let brushType = document.getElementById('brushType').value;
let actions = []; // Массив для хранения состояний канваса
let eraserMode = false; // Режим ластика

function startPosition(e) {
   painting = true;
   draw(e);
}

function endPosition() {
   painting = false;
   ctx.beginPath(); // Начинаем новый путь
}

function draw(e) {
   if (!painting) return;

   ctx.lineWidth = brushSize; // Установка размера кисти
   ctx.lineCap = brushType; // Установка типа кисти (круглая или квадратная)
   
   if (eraserMode) {
       ctx.strokeStyle = "#FFFFFF"; // Цвет фона для ластика (белый)
   } else {
       ctx.strokeStyle = brushColor; // Установка цвета кисти
   }

   ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
   ctx.stroke(); // Рисуем линию
   ctx.beginPath(); // Начинаем новый путь
   ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop); // Перемещаемся в новую точку

   // Сохраняем текущее состояние канваса для возможности отмены
   actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// События мыши
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Изменение цвета и размера кисти
document.getElementById('colorPicker').addEventListener('input', function() {
   brushColor = this.value;
});

document.getElementById('brushSize').addEventListener('input', function() {
   brushSize = this.value;
});

// Изменение типа кисти
document.getElementById('brushType').addEventListener('change', function() {
   brushType = this.value;
});

// Очистка канваса
document.getElementById('clearButton').addEventListener('click', function() {
   ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка всего канваса
   actions.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Сохраняем состояние после очистки
});

// Переключение режима ластика
document.getElementById('eraserButton').addEventListener('click', function() {
   eraserMode = !eraserMode; // Переключаем режим ластика
   this.textContent = eraserMode ? 'Кисть' : 'Ластик'; // Меняем текст кнопки в зависимости от режима
});
