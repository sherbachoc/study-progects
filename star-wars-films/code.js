class StarWarsFilms {
    constructor() {
        this.films = [];
        this.filteredFilms = [];
        this.currentSort = 'episode';
        this.currentFilter = 'all';
        
        // DOM элементы
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.querySelector('.search-btn');
        this.sortSelect = document.getElementById('sortSelect');
        this.filterSelect = document.getElementById('filterSelect');
        this.filmsGrid = document.querySelector('.films-grid');
        this.modal = document.getElementById('filmModal');
        this.modalContent = document.querySelector('.modal-content');
        this.closeBtn = document.querySelector('.close-btn');
        
        // Привязка контекста
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.showFilmDetails = this.showFilmDetails.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
        // Инициализация
        this.init();
    }
    
    async init() {
        try {
            await this.fetchFilms();
            this.setupEventListeners();
            this.renderFilms();
        } catch (error) {
            console.error('Ошибка при инициализации:', error);
        }
    }
    
    async fetchFilms() {
        try {
            const response = await fetch('https://swapi.dev/api/films/');
            const data = await response.json();
            this.films = data.results.map(film => ({
                ...film,
                episode: parseInt(film.episode_id),
                year: new Date(film.release_date).getFullYear()
            }));
            this.filteredFilms = [...this.films];
        } catch (error) {
            console.error('Ошибка при загрузке фильмов:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        this.searchBtn.addEventListener('click', this.handleSearch);
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        this.sortSelect.addEventListener('change', this.handleSort);
        this.filterSelect.addEventListener('change', this.handleFilter);
        
        this.closeBtn.addEventListener('click', this.closeModal);
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }
    
    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        this.filteredFilms = this.films.filter(film => 
            film.title.toLowerCase().includes(searchTerm) ||
            film.director.toLowerCase().includes(searchTerm)
        );
        this.renderFilms();
    }
    
    handleSort() {
        this.currentSort = this.sortSelect.value;
        this.filteredFilms.sort((a, b) => {
            switch (this.currentSort) {
                case 'episode':
                    return a.episode - b.episode;
                case 'year':
                    return a.year - b.year;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        this.renderFilms();
    }
    
    handleFilter() {
        this.currentFilter = this.filterSelect.value;
        this.filteredFilms = this.films.filter(film => {
            if (this.currentFilter === 'all') return true;
            return film.episode.toString() === this.currentFilter;
        });
        this.renderFilms();
    }
    
    renderFilms() {
        this.filmsGrid.innerHTML = '';
        
        this.filteredFilms.forEach(film => {
            const filmCard = document.createElement('div');
            filmCard.className = 'film-card';
            filmCard.innerHTML = `
                <img src="https://starwars-visualguide.com/assets/img/films/${film.episode}.jpg" 
                     alt="${film.title}" 
                     class="film-poster"
                     onerror="this.src='https://via.placeholder.com/300x400?text=Star+Wars'">
                <div class="film-info">
                    <h3 class="film-title">${film.title}</h3>
                    <p class="film-year">${film.year}</p>
                </div>
            `;
            
            filmCard.addEventListener('click', () => this.showFilmDetails(film));
            this.filmsGrid.appendChild(filmCard);
        });
    }
    
    async showFilmDetails(film) {
        try {
            const characters = await Promise.all(
                film.characters.slice(0, 10).map(url => 
                    fetch(url).then(res => res.json())
                )
            );
            
            this.modalContent.innerHTML = `
                <button class="close-btn">
                    <span class="material-icons">close</span>
                </button>
                <div class="film-details">
                    <h2>${film.title}</h2>
                    <div class="film-info">
                        <div class="info-group">
                            <span class="info-label">Эпизод</span>
                            <span>${film.episode}</span>
                        </div>
                        <div class="info-group">
                            <span class="info-label">Год</span>
                            <span>${film.year}</span>
                        </div>
                        <div class="info-group">
                            <span class="info-label">Режиссер</span>
                            <span>${film.director}</span>
                        </div>
                        <div class="info-group">
                            <span class="info-label">Продюсер</span>
                            <span>${film.producer}</span>
                        </div>
                    </div>
                    <div class="film-description">
                        <h3>Описание</h3>
                        <p>${film.opening_crawl}</p>
                    </div>
                    <div class="film-characters">
                        <h3>Персонажи</h3>
                        <div class="characters-list">
                            ${characters.map(char => `
                                <div class="character-item">
                                    ${char.name}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            this.modal.classList.remove('hidden');
            this.closeBtn.addEventListener('click', this.closeModal);
        } catch (error) {
            console.error('Ошибка при загрузке деталей фильма:', error);
        }
    }
    
    closeModal() {
        this.modal.classList.add('hidden');
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new StarWarsFilms();
});
