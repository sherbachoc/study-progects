// Обычные часы
let lastClockTime = 0;

function updateClock(timestamp) {
    if (!lastClockTime) lastClockTime = timestamp;
    const progress = timestamp - lastClockTime;
    lastClockTime = timestamp;

    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Вычисляем углы для стрелок
    const hourDegrees = (hours * 30) + (minutes * 0.5); // 30 градусов на час + 0.5 градуса на минуту
    const minuteDegrees = minutes * 6; // 6 градусов на минуту
    const secondDegrees = (seconds * 6) + (milliseconds * 0.006); // 6 градусов на секунду + плавное движение

    // Применяем поворот к стрелкам
    document.querySelector('.clock .hour-hand').style.transform = 
        `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
    document.querySelector('.clock .minute-hand').style.transform = 
        `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
    document.querySelector('.clock .second-hand').style.transform = 
        `translate(-50%, -100%) rotate(${secondDegrees}deg)`;

    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(updateClock);
}

// Запускаем часы
requestAnimationFrame(updateClock);

// Таймер
let timerInterval;
let timerTime = 0;
let timerRunning = false;
let lastTimerTime = 0;

function updateTimer(timestamp) {
    if (!lastTimerTime) lastTimerTime = timestamp;
    const progress = timestamp - lastTimerTime;
    lastTimerTime = timestamp;

    if (timerTime > 0) {
        timerTime -= progress / 1000; // Конвертируем миллисекунды в секунды
        if (timerTime < 0) timerTime = 0;
        
        updateTimerDisplay();
        
        if (timerTime === 0) {
            stopTimer();
        } else {
            requestAnimationFrame(updateTimer);
        }
    }
}

function startTimer() {
    if (!timerRunning) {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        
        timerTime = hours * 3600 + minutes * 60 + seconds;
        
        if (timerTime > 0) {
            timerRunning = true;
            lastTimerTime = 0;
            requestAnimationFrame(updateTimer);
        }
    }
}

function stopTimer() {
    timerRunning = false;
}

function resetTimer() {
    stopTimer();
    timerTime = 0;
    updateTimerDisplay();
    document.getElementById('hours').value = '0';
    document.getElementById('minutes').value = '0';
    document.getElementById('seconds').value = '0';
}

function updateTimerDisplay() {
    const hours = Math.floor(timerTime / 3600);
    const minutes = Math.floor((timerTime % 3600) / 60);
    const seconds = Math.floor(timerTime % 60);
    
    // Обновляем поля ввода
    document.getElementById('hours').value = hours;
    document.getElementById('minutes').value = minutes;
    document.getElementById('seconds').value = seconds;
    
    // Обновляем стрелки
    const totalSeconds = timerTime;
    // Для таймера используем обратный расчет углов
    const hourDegrees = ((12 - (totalSeconds / 3600)) % 12) * 30; // 30 градусов на час
    const minuteDegrees = ((60 - ((totalSeconds % 3600) / 60)) % 60) * 6; // 6 градусов на минуту
    const secondDegrees = ((60 - (totalSeconds % 60)) % 60) * 6; // 6 градусов на секунду
    
    document.querySelector('.timer .hour-hand').style.transform = 
        `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
    document.querySelector('.timer .minute-hand').style.transform = 
        `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
    document.querySelector('.timer .second-hand').style.transform = 
        `translate(-50%, -100%) rotate(${secondDegrees}deg)`;
}

// Обработчики колесика мыши для таймера
function handleWheel(event, input) {
    event.preventDefault();
    const currentValue = parseInt(input.value) || 0;
    const maxValue = parseInt(input.max);
    const minValue = parseInt(input.min);
    
    if (event.deltaY < 0) { // Прокрутка вверх
        if (currentValue < maxValue) {
            input.value = currentValue + 1;
        }
    } else { // Прокрутка вниз
        if (currentValue > minValue) {
            input.value = currentValue - 1;
        }
    }
    
    // Проверяем и обновляем связанные поля
    if (input.id === 'seconds' && currentValue === 59 && event.deltaY < 0) {
        const minutesInput = document.getElementById('minutes');
        const minutesValue = parseInt(minutesInput.value) || 0;
        if (minutesValue < 59) {
            minutesInput.value = minutesValue + 1;
            input.value = 0;
        }
    } else if (input.id === 'minutes' && currentValue === 59 && event.deltaY < 0) {
        const hoursInput = document.getElementById('hours');
        const hoursValue = parseInt(hoursInput.value) || 0;
        if (hoursValue < 23) {
            hoursInput.value = hoursValue + 1;
            input.value = 0;
        }
    }
    
    // Обновляем таймер при изменении значений
    if (!timerRunning) {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        timerTime = hours * 3600 + minutes * 60 + seconds;
        updateTimerDisplay();
    }
}

// Секундомер
let stopwatchInterval;
let stopwatchTime = 0;
let stopwatchRunning = false;
let lapCount = 1;
let lastStopwatchTime = 0;

function updateStopwatch(timestamp) {
    if (!lastStopwatchTime) lastStopwatchTime = timestamp;
    const progress = timestamp - lastStopwatchTime;
    lastStopwatchTime = timestamp;

    if (stopwatchRunning) {
        stopwatchTime += progress;
        updateStopwatchDisplay();
        requestAnimationFrame(updateStopwatch);
    }
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        lastStopwatchTime = 0;
        requestAnimationFrame(updateStopwatch);
    }
}

function stopStopwatch() {
    stopwatchRunning = false;
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    lapCount = 1;
    updateStopwatchDisplay();
    document.getElementById('laps').innerHTML = '';
}

function addLap() {
    if (stopwatchRunning) {
        const lapTime = stopwatchTime;
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.textContent = `Круг ${lapCount}: ${formatTime(lapTime)}`;
        document.getElementById('laps').prepend(lapItem);
        lapCount++;
    }
}

function updateStopwatchDisplay() {
    // Обновляем стрелки
    const totalSeconds = stopwatchTime / 1000; // Конвертируем миллисекунды в секунды
    const hourDegrees = (totalSeconds / 3600) * 30; // 30 градусов на час
    const minuteDegrees = (totalSeconds / 60) * 6; // 6 градусов на минуту
    const secondDegrees = totalSeconds * 6; // 6 градусов на секунду
    
    document.querySelector('.stopwatch .hour-hand').style.transform = 
        `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
    document.querySelector('.stopwatch .minute-hand').style.transform = 
        `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
    document.querySelector('.stopwatch .second-hand').style.transform = 
        `translate(-50%, -100%) rotate(${secondDegrees}deg)`;
}

function formatTime(time) {
    const totalSeconds = Math.floor(time / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

// Обработчики событий
document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('stopTimer').addEventListener('click', stopTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);

document.getElementById('startStopwatch').addEventListener('click', startStopwatch);
document.getElementById('stopStopwatch').addEventListener('click', stopStopwatch);
document.getElementById('resetStopwatch').addEventListener('click', resetStopwatch);
document.getElementById('lapStopwatch').addEventListener('click', addLap);

// Добавляем обработчики колесика мыши для полей ввода таймера
const timerInputs = ['hours', 'minutes', 'seconds'];
timerInputs.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('wheel', (e) => handleWheel(e, input));
}); 