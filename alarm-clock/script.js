const currentTimeElement = document.getElementById('currentTime');
const alarmTimeInput = document.getElementById('alarmTime');
const setAlarmButton = document.getElementById('setAlarm');
const stopAlarmButton = document.getElementById('stopAlarm');
const alarmSound = document.getElementById('alarmSound');
const alarmMessageElement = document.getElementById('alarmMessage');

let alarmTime = null;
let alarmTimeout = null;

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;

    if (alarmTime && `${hours}:${minutes}` === alarmTime) {
        triggerAlarm();
    }
}

function setAlarm() {
    alarmTime = alarmTimeInput.value;

    if (alarmTime) {
        setAlarmButton.disabled = true;
        stopAlarmButton.disabled = false;
        alarmMessageElement.textContent = `Будильник установлен на ${alarmTime}`;

        // Clear any existing timeout to prevent multiple alarms
        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }

        // Calculate time until the next minute to check for alarm
        const now = new Date();
        const secondsUntilNextMinute = 60 - now.getSeconds();
        const millisecondsUntilNextMinute = secondsUntilNextMinute * 1000;

        alarmTimeout = setTimeout(() => {
            updateTime(); // Check immediately at the start of the next minute
            // Set interval to check every minute after that
            setInterval(updateTime, 60 * 1000); 
        }, millisecondsUntilNextMinute);

    } else {
        alarmMessageElement.textContent = 'Пожалуйста, установите время.';
    }
}

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmTime = null;
    setAlarmButton.disabled = false;
    stopAlarmButton.disabled = true;
    alarmMessageElement.textContent = 'Будильник остановлен.';
    // Clear interval if it was set (though the current logic only uses timeout for the first check)
    // If you switch to interval-based checking, you'd need to store and clear the interval ID here
}

function triggerAlarm() {
    alarmSound.play();
    alarmMessageElement.textContent = 'БУДИЛЬНИК ЗВОНИТ!';
}

// Update time every second
setInterval(updateTime, 1000);

// Initial time update
updateTime();

// Event listeners for buttons
setAlarmButton.addEventListener('click', setAlarm);
stopAlarmButton.addEventListener('click', stopAlarm);

// Allow setting alarm by pressing Enter in the time input
alarmTimeInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission if any
        setAlarm();
    }
}); 