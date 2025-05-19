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
    
    // Обновляем цифровое время
    const digitalTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.querySelector('.timer .digital-time').textContent = digitalTime;
    
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
    // Обновляем цифровое время
    document.querySelector('.stopwatch .digital-time').textContent = formatTime(stopwatchTime);
    
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