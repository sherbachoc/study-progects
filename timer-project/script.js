// Функции для работы с текущим временем
async function updateClock() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        const date = new Date(data.datetime);
        document.getElementById('clock').textContent = date.toLocaleTimeString('ru-RU');
    } catch (error) {
        document.getElementById('clock').textContent = new Date().toLocaleTimeString('ru-RU');
    }
}

setInterval(updateClock, 1000);
updateClock();

// Функции для таймера
let timerInterval;
let timerTime = 0;
let isTimerRunning = false;

function updateTimerDisplay() {
    const hours = Math.floor(timerTime / 3600);
    const minutes = Math.floor((timerTime % 3600) / 60);
    const seconds = timerTime % 60;
    document.getElementById('timer-display').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (!isTimerRunning) {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        
        timerTime = hours * 3600 + minutes * 60 + seconds;
        
        if (timerTime > 0) {
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if (timerTime > 0) {
                    timerTime--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    alert('Время истекло!');
                }
            }, 1000);
        }
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerTime = 0;
    updateTimerDisplay();
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
}

// Функции для секундомера
let stopwatchInterval;
let stopwatchTime = 0;
let isStopwatchRunning = false;
let lapCount = 1;

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchTime / 3600);
    const minutes = Math.floor((stopwatchTime % 3600) / 60);
    const seconds = stopwatchTime % 60;
    document.getElementById('stopwatch-display').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startStopwatch() {
    if (!isStopwatchRunning) {
        isStopwatchRunning = true;
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 1000);
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    stopwatchTime = 0;
    lapCount = 1;
    updateStopwatchDisplay();
    document.getElementById('laps-container').innerHTML = '';
}

function addLap() {
    if (isStopwatchRunning) {
        const lapTime = document.getElementById('stopwatch-display').textContent;
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.textContent = `Круг ${lapCount}: ${lapTime}`;
        document.getElementById('laps-container').prepend(lapItem);
        lapCount++;
    }
}

// Добавляем обработчики событий
document.getElementById('start-timer').addEventListener('click', startTimer);
document.getElementById('stop-timer').addEventListener('click', stopTimer);
document.getElementById('reset-timer').addEventListener('click', resetTimer);

document.getElementById('start-stopwatch').addEventListener('click', startStopwatch);
document.getElementById('stop-stopwatch').addEventListener('click', stopStopwatch);
document.getElementById('reset-stopwatch').addEventListener('click', resetStopwatch);
document.getElementById('lap-stopwatch').addEventListener('click', addLap); 