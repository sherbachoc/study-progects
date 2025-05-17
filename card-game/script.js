document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const gameOver = document.getElementById('gameOver');
    const timeDisplay = document.getElementById('time');
    const movesDisplay = document.getElementById('moves');
    const finalTimeDisplay = document.getElementById('finalTime');
    const finalMovesDisplay = document.getElementById('finalMoves');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = null;
    let seconds = 0;
    let isPlaying = false;

    // Эмодзи для карточек
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

    // Функция для создания карточек
    function createCards() {
        const pairs = [...emojis, ...emojis];
        cards = pairs.sort(() => Math.random() - 0.5);
        
        gameBoard.innerHTML = '';
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.value = emoji;
            
            const front = document.createElement('div');
            front.className = 'card-front';
            front.textContent = emoji;
            
            const back = document.createElement('div');
            back.className = 'card-back';
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
        });
    }

    // Функция для переворота карточки
    function flipCard(card) {
        if (!isPlaying || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkMatch();
        }
    }

    // Функция для проверки совпадения карточек
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.value === card2.dataset.value;

        if (match) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            if (matchedPairs === emojis.length) {
                endGame();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        flippedCards = [];
    }

    // Функция для обновления таймера
    function updateTimer() {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Функция для начала игры
    function startGame() {
        isPlaying = true;
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        flippedCards = [];
        
        movesDisplay.textContent = '0';
        timeDisplay.textContent = '00:00';
        
        startBtn.disabled = true;
        restartBtn.disabled = false;
        gameOver.classList.add('hidden');
        
        createCards();
        timer = setInterval(updateTimer, 1000);
    }

    // Функция для окончания игры
    function endGame() {
        isPlaying = false;
        clearInterval(timer);
        
        finalTimeDisplay.textContent = timeDisplay.textContent;
        finalMovesDisplay.textContent = moves;
        
        gameOver.classList.remove('hidden');
    }

    // Обработчики событий
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', startGame);

    // Инициализация
    createCards();
}); 