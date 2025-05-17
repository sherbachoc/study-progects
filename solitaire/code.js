class Solitaire {
    constructor() {
        this.deck = [];
        this.foundationPiles = [[], [], [], []];
        this.tableauPiles = [[], [], [], [], [], [], []];
        this.stock = [];
        this.waste = [];
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.selectedCard = null;
        this.selectedPile = null;
        this.gameStarted = false;
        this.gameOver = false;

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.updateUI();
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    suit,
                    value,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                    faceUp: false
                });
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        // Deal to tableau piles
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                const card = this.deck.pop();
                card.faceUp = (j === i);
                this.tableauPiles[i].push(card);
            }
        }

        // Remaining cards go to stock
        this.stock = this.deck;
        this.deck = [];
    }

    setupEventListeners() {
        // New game button
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // Undo button
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undoMove();
        });

        // Stock click
        document.querySelector('.stock').addEventListener('click', () => {
            this.drawFromStock();
        });

        // Foundation piles
        document.querySelectorAll('.foundation-pile').forEach((pile, index) => {
            pile.addEventListener('click', () => {
                this.handlePileClick('foundation', index);
            });
        });

        // Tableau piles
        document.querySelectorAll('.tableau-pile').forEach((pile, index) => {
            pile.addEventListener('click', () => {
                this.handlePileClick('tableau', index);
            });
        });
    }

    startTimer() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.timerInterval = setInterval(() => {
                this.timer++;
                this.updateTimer();
            }, 1000);
        }
    }

    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        document.querySelector('.timer span').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    drawFromStock() {
        if (this.stock.length === 0) {
            this.stock = this.waste.reverse();
            this.waste = [];
            this.stock.forEach(card => card.faceUp = false);
        } else {
            const card = this.stock.pop();
            card.faceUp = true;
            this.waste.push(card);
        }
        this.moves++;
        this.updateMoves();
        this.updateUI();
    }

    handlePileClick(pileType, index) {
        this.startTimer();

        if (this.selectedCard) {
            this.moveCard(pileType, index);
        } else {
            this.selectCard(pileType, index);
        }
    }

    selectCard(pileType, index) {
        let card;
        if (pileType === 'foundation') {
            if (this.foundationPiles[index].length > 0) {
                card = this.foundationPiles[index][this.foundationPiles[index].length - 1];
            }
        } else if (pileType === 'tableau') {
            const pile = this.tableauPiles[index];
            for (let i = pile.length - 1; i >= 0; i--) {
                if (pile[i].faceUp) {
                    card = pile[i];
                    break;
                }
            }
        }

        if (card) {
            this.selectedCard = card;
            this.selectedPile = { type: pileType, index };
            this.highlightSelectedCard();
        }
    }

    moveCard(targetPileType, targetIndex) {
        const sourcePile = this.selectedPile.type === 'foundation' ? 
            this.foundationPiles[this.selectedPile.index] : 
            this.tableauPiles[this.selectedPile.index];
        
        const targetPile = targetPileType === 'foundation' ? 
            this.foundationPiles[targetIndex] : 
            this.tableauPiles[targetIndex];

        if (this.isValidMove(targetPileType, targetIndex)) {
            const cardIndex = sourcePile.indexOf(this.selectedCard);
            const cardsToMove = sourcePile.slice(cardIndex);
            
            // Remove cards from source pile
            sourcePile.splice(cardIndex);
            
            // Add cards to target pile
            targetPile.push(...cardsToMove);
            
            // Flip the top card of the source pile if it exists
            if (sourcePile.length > 0 && !sourcePile[sourcePile.length - 1].faceUp) {
                sourcePile[sourcePile.length - 1].faceUp = true;
            }

            this.moves++;
            this.updateMoves();
            this.checkWin();
        }

        this.clearSelection();
        this.updateUI();
    }

    isValidMove(targetPileType, targetIndex) {
        const targetPile = targetPileType === 'foundation' ? 
            this.foundationPiles[targetIndex] : 
            this.tableauPiles[targetIndex];

        if (targetPileType === 'foundation') {
            if (targetPile.length === 0) {
                return this.selectedCard.value === 'A';
            }
            const topCard = targetPile[targetPile.length - 1];
            return this.selectedCard.suit === topCard.suit && 
                   this.getCardValue(this.selectedCard) === this.getCardValue(topCard) + 1;
        } else {
            if (targetPile.length === 0) {
                return this.selectedCard.value === 'K';
            }
            const topCard = targetPile[targetPile.length - 1];
            return this.selectedCard.color !== topCard.color && 
                   this.getCardValue(this.selectedCard) === this.getCardValue(topCard) - 1;
        }
    }

    getCardValue(card) {
        const values = {
            'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
            '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
        };
        return values[card.value];
    }

    highlightSelectedCard() {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
        const cardElement = document.querySelector(`[data-suit="${this.selectedCard.suit}"][data-value="${this.selectedCard.value}"]`);
        if (cardElement) {
            cardElement.classList.add('selected');
        }
    }

    clearSelection() {
        this.selectedCard = null;
        this.selectedPile = null;
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    updateMoves() {
        document.querySelector('.moves span').textContent = this.moves;
    }

    checkWin() {
        const allCardsInFoundation = this.foundationPiles.every(pile => pile.length === 13);
        if (allCardsInFoundation) {
            this.endGame(true);
        }
    }

    endGame(won) {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        
        const gameOverElement = document.querySelector('.game-over');
        gameOverElement.classList.remove('hidden');
        
        if (won) {
            gameOverElement.querySelector('h2').textContent = 'Поздравляем!';
            gameOverElement.querySelector('p').textContent = 
                `Вы выиграли за ${Math.floor(this.timer / 60)}:${(this.timer % 60).toString().padStart(2, '0')} и ${this.moves} ходов!`;
        }
    }

    resetGame() {
        this.deck = [];
        this.foundationPiles = [[], [], [], []];
        this.tableauPiles = [[], [], [], [], [], [], []];
        this.stock = [];
        this.waste = [];
        this.moves = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.gameOver = false;
        
        clearInterval(this.timerInterval);
        document.querySelector('.game-over').classList.add('hidden');
        
        this.initializeGame();
    }

    undoMove() {
        // TODO: Implement undo functionality
        console.log('Undo not implemented yet');
    }

    updateUI() {
        // Update foundation piles
        this.foundationPiles.forEach((pile, index) => {
            const pileElement = document.querySelector(`.foundation-pile:nth-child(${index + 1})`);
            pileElement.innerHTML = '';
            if (pile.length > 0) {
                const card = pile[pile.length - 1];
                pileElement.appendChild(this.createCardElement(card));
            }
        });

        // Update stock and waste
        const stockElement = document.querySelector('.stock');
        const wasteElement = document.querySelector('.waste');
        
        stockElement.innerHTML = '';
        wasteElement.innerHTML = '';
        
        if (this.stock.length > 0) {
            stockElement.appendChild(this.createCardElement(this.stock[this.stock.length - 1], false));
        }
        
        if (this.waste.length > 0) {
            wasteElement.appendChild(this.createCardElement(this.waste[this.waste.length - 1]));
        }

        // Update tableau piles
        this.tableauPiles.forEach((pile, index) => {
            const pileElement = document.querySelector(`.tableau-pile:nth-child(${index + 1})`);
            pileElement.innerHTML = '';
            pile.forEach(card => {
                pileElement.appendChild(this.createCardElement(card));
            });
        });
    }

    createCardElement(card, faceUp = true) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.color}`;
        cardElement.dataset.suit = card.suit;
        cardElement.dataset.value = card.value;
        
        if (faceUp && card.faceUp) {
            cardElement.innerHTML = `
                <div class="card-face">
                    <div class="card-corner">
                        <div>${card.value}</div>
                        <div>${card.suit}</div>
                    </div>
                    <div class="card-center">${card.suit}</div>
                    <div class="card-corner" style="transform: rotate(180deg)">
                        <div>${card.value}</div>
                        <div>${card.suit}</div>
                    </div>
                </div>
            `;
        } else {
            cardElement.innerHTML = `
                <div class="card-back"></div>
            `;
        }
        
        return cardElement;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Solitaire();
}); 