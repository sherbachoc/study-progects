class Translator {
    constructor() {
        this.sourceText = document.getElementById('sourceText');
        this.translatedText = document.getElementById('translatedText');
        this.fromLanguage = document.getElementById('fromLanguage');
        this.toLanguage = document.getElementById('toLanguage');
        this.swapBtn = document.getElementById('swapLanguages');
        this.clearInputBtn = document.getElementById('clearInput');
        this.copyInputBtn = document.getElementById('copyInput');
        this.copyOutputBtn = document.getElementById('copyOutput');
        this.speakOutputBtn = document.getElementById('speakOutput');
        this.historyList = document.getElementById('historyList');

        this.setupEventListeners();
        this.loadHistory();
    }

    setupEventListeners() {
        // Автоматический перевод при вводе текста
        this.sourceText.addEventListener('input', this.debounce(() => {
            this.translate();
        }, 500));

        // Смена языков
        this.swapBtn.addEventListener('click', () => {
            const temp = this.fromLanguage.value;
            this.fromLanguage.value = this.toLanguage.value;
            this.toLanguage.value = temp;
            this.translate();
        });

        // Очистка ввода
        this.clearInputBtn.addEventListener('click', () => {
            this.sourceText.value = '';
            this.translatedText.value = '';
        });

        // Копирование текста
        this.copyInputBtn.addEventListener('click', () => {
            this.copyToClipboard(this.sourceText.value);
        });

        this.copyOutputBtn.addEventListener('click', () => {
            this.copyToClipboard(this.translatedText.value);
        });

        // Озвучивание перевода
        this.speakOutputBtn.addEventListener('click', () => {
            this.speakText(this.translatedText.value, this.toLanguage.value);
        });

        // Изменение языков
        this.fromLanguage.addEventListener('change', () => this.translate());
        this.toLanguage.addEventListener('change', () => this.translate());
    }

    async translate() {
        const text = this.sourceText.value.trim();
        if (!text) {
            this.translatedText.value = '';
            return;
        }

        try {
            // В реальном приложении здесь должен быть API запрос к сервису перевода
            // Для демонстрации используем простую имитацию перевода
            const translated = await this.mockTranslate(text, this.fromLanguage.value, this.toLanguage.value);
            this.translatedText.value = translated;
            this.addToHistory(text, translated);
        } catch (error) {
            console.error('Translation error:', error);
            this.translatedText.value = 'Ошибка перевода. Попробуйте позже.';
        }
    }

    // Имитация перевода для демонстрации
    async mockTranslate(text, from, to) {
        // В реальном приложении здесь должен быть API запрос
        return new Promise(resolve => {
            setTimeout(() => {
                const mockTranslations = {
                    'ru-en': 'Hello, how are you?',
                    'en-ru': 'Привет, как дела?',
                    'ru-es': 'Hola, ¿cómo estás?',
                    'es-ru': 'Привет, как дела?',
                    // Добавьте другие комбинации языков по необходимости
                };
                
                const key = `${from}-${to}`;
                resolve(mockTranslations[key] || text);
            }, 500);
        });
    }

    addToHistory(sourceText, translatedText) {
        const historyItem = {
            sourceText,
            translatedText,
            fromLanguage: this.fromLanguage.value,
            toLanguage: this.toLanguage.value,
            timestamp: new Date().toISOString()
        };

        // Получаем текущую историю
        let history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
        
        // Добавляем новый элемент в начало
        history.unshift(historyItem);
        
        // Ограничиваем историю последними 10 переводами
        history = history.slice(0, 10);
        
        // Сохраняем историю
        localStorage.setItem('translationHistory', JSON.stringify(history));
        
        // Обновляем отображение
        this.updateHistoryDisplay();
    }

    loadHistory() {
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
        this.historyList.innerHTML = '';

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const languageNames = {
                'ru': 'Русский',
                'en': 'English',
                'es': 'Español',
                'fr': 'Français',
                'de': 'Deutsch',
                'it': 'Italiano',
                'pt': 'Português',
                'zh': '中文',
                'ja': '日本語',
                'ko': '한국어'
            };

            historyItem.innerHTML = `
                <div class="history-text">
                    <div>${item.sourceText}</div>
                    <div class="history-languages">
                        ${languageNames[item.fromLanguage]} → ${languageNames[item.toLanguage]}
                    </div>
                </div>
                <div class="history-actions">
                    <button class="control-btn" onclick="translator.useHistoryItem('${item.timestamp}')">
                        <span class="material-icons">replay</span>
                    </button>
                    <button class="control-btn" onclick="translator.deleteHistoryItem('${item.timestamp}')">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `;

            this.historyList.appendChild(historyItem);
        });
    }

    useHistoryItem(timestamp) {
        const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
        const item = history.find(h => h.timestamp === timestamp);
        
        if (item) {
            this.sourceText.value = item.sourceText;
            this.fromLanguage.value = item.fromLanguage;
            this.toLanguage.value = item.toLanguage;
            this.translate();
        }
    }

    deleteHistoryItem(timestamp) {
        let history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
        history = history.filter(h => h.timestamp !== timestamp);
        localStorage.setItem('translationHistory', JSON.stringify(history));
        this.updateHistoryDisplay();
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            // Можно добавить визуальное подтверждение копирования
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    }

    speakText(text, lang) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            speechSynthesis.speak(utterance);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Инициализация переводчика при загрузке страницы
const translator = new Translator();

