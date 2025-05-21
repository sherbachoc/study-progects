const result = document.getElementById('result');
const history = document.getElementById('history');
let memory = 0;
let lastResult = '';

function appendNumber(number) {
    if (result.value === 'Ошибка') {
        clearDisplay();
    }
    result.value += number;
}

function appendOperator(operator) {
    if (result.value !== '' && result.value !== 'Ошибка') {
        const lastChar = result.value.slice(-1);
        if ('+-*/%'.includes(lastChar)) {
            result.value = result.value.slice(0, -1) + operator;
        } else {
            result.value += operator;
        }
    }
}

function clearDisplay() {
    result.value = '';
    history.textContent = '';
}

function deleteLastChar() {
    result.value = result.value.slice(0, -1);
}

function calculate() {
    try {
        if (result.value === '') return;
        
        const expression = result.value.replace(/×/g, '*');
        const calculatedResult = eval(expression);
        
        // Сохраняем выражение в историю
        history.textContent = `${result.value} =`;
        
        // Форматируем результат
        if (Number.isInteger(calculatedResult)) {
            result.value = calculatedResult;
        } else {
            result.value = parseFloat(calculatedResult.toFixed(8)).toString();
        }
        
        lastResult = result.value;
    } catch (error) {
        result.value = 'Ошибка';
        setTimeout(clearDisplay, 1500);
    }
}

// Функции памяти
function memoryAdd() {
    if (result.value !== '' && result.value !== 'Ошибка') {
        memory += parseFloat(result.value);
        showMemoryNotification('Добавлено в память');
    }
}

function memorySubtract() {
    if (result.value !== '' && result.value !== 'Ошибка') {
        memory -= parseFloat(result.value);
        showMemoryNotification('Вычтено из памяти');
    }
}

function memoryRecall() {
    if (memory !== 0) {
        result.value = memory.toString();
    }
}

function memoryClear() {
    memory = 0;
    showMemoryNotification('Память очищена');
}

function showMemoryNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 1500);
}

// Обработка клавиатуры
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLastChar();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '.') {
        appendNumber('.');
    }
}); 