let lastTime = 0;

function updateClock(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const progress = timestamp - lastTime;
    lastTime = timestamp;

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
    document.querySelector('.hour-hand').style.transform = 
        `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
    document.querySelector('.minute-hand').style.transform = 
        `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
    document.querySelector('.second-hand').style.transform = 
        `translate(-50%, -100%) rotate(${secondDegrees}deg)`;

    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(updateClock);
}

// Запускаем часы
requestAnimationFrame(updateClock); 