export class FilterEngine {
    constructor(config, onSelectCharacter) {
        this.config = config;
        this.onSelectCharacter = onSelectCharacter;

        this.searchInput = document.getElementById('searchInput');
        this.characterSelection = document.querySelector('.character-list');
        this.ul = document.createElement('ul');

        this.selectedElement = '';
        this.selectedWeaponOrPath = '';
        this.selectedRating = '';
    }

    init() {
        this.renderFilterBar();

        // Event delegation on ul
        this.ul.addEventListener('click', (event) => {
            const targetLi = event.target.closest('li');
            if (!targetLi) return;
            const identifier = targetLi.dataset.identifier;
            if (!identifier) return;

            const champion = this.config.characters.find(c =>
                this.config.getCharacterIdentifier(c).toLowerCase() === identifier.toLowerCase()
            );

            if (champion && typeof this.onSelectCharacter === 'function') {
                this.onSelectCharacter(champion);
            }
        });

        // Search input with debounce
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(() => {
                this.filterCharacters();
            }, 150));
        }

        // Element filter icons
        document.querySelectorAll('.by-element img').forEach(img => {
            img.addEventListener('click', () => {
                const elementKey = img.alt.toLowerCase();
                if (this.selectedElement === elementKey) {
                    this.selectedElement = '';
                    img.classList.remove('selected');
                } else {
                    this.selectedElement = elementKey;
                    document.querySelectorAll('.by-element img').forEach(i => i.classList.remove('selected'));
                    img.classList.add('selected');
                }
                this.filterCharacters();
            });
        });

        // Weapon or Path filter icons
        document.querySelectorAll('.by-weapon img').forEach(img => {
            img.addEventListener('click', () => {
                const weaponOrPathKey = img.alt.toLowerCase();
                if (this.selectedWeaponOrPath === weaponOrPathKey) {
                    this.selectedWeaponOrPath = '';
                    img.classList.remove('selected');
                } else {
                    this.selectedWeaponOrPath = weaponOrPathKey;
                    document.querySelectorAll('.by-weapon img').forEach(i => i.classList.remove('selected'));
                    img.classList.add('selected');
                }
                this.filterCharacters();
            });
        });

        // Rating filter icons
        document.querySelectorAll('.by-rating img').forEach(img => {
            img.addEventListener('click', () => {
                const ratingKey = img.alt;
                if (this.selectedRating === ratingKey) {
                    this.selectedRating = '';
                    img.classList.remove('selected');
                } else {
                    this.selectedRating = ratingKey;
                    document.querySelectorAll('.by-rating img').forEach(i => i.classList.remove('selected'));
                    img.classList.add('selected');
                }
                this.filterCharacters();
            });
        });

        this.displayAll();
    }

    debounce(fn, delay = 150) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    filterCharacters() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
        const filtered = this.config.characters.filter(char => {
            return this.config.matchFilter(char, {
                search: searchTerm,
                element: this.selectedElement,
                weaponOrPath: this.selectedWeaponOrPath,
                rating: this.selectedRating
            });
        });

        this.displayItem(filtered);
    }

    displayItem(champions) {
        this.ul.innerHTML = '';
        const fragment = document.createDocumentFragment();

        champions.forEach(champion => {
            const li = this.config.renderListItem(champion);
            fragment.appendChild(li);
        });

        this.ul.appendChild(fragment);
        if (this.characterSelection && !this.characterSelection.contains(this.ul)) {
            this.characterSelection.appendChild(this.ul);
        }
    }

    renderFilterBar() {
        const filterContainer = document.querySelector('.character-filter');
        if (!filterContainer || filterContainer.children.length > 0 || !this.config.filterCategories) return;

        const fc = this.config.filterCategories;
        const fit1 = document.createElement('div');
        fit1.className = 'fit1';

        // Elements Row
        if (fc.elements && fc.elements.length > 0) {
            const elementRow = document.createElement('div');
            elementRow.className = 'filter-row';
            elementRow.innerHTML = `<span class="filter-title">Element</span><div class="by-element"></div>`;
            const byElement = elementRow.querySelector('.by-element');
            const basePath = fc.elementsBasePath || '../../../asset/icons/elements/';
            const ext = fc.elementsExt || 'svg';

            fc.elements.forEach(elem => {
                const img = document.createElement('img');
                img.src = `${basePath}${elem}.${ext}`;
                img.alt = elem;
                byElement.appendChild(img);
            });
            fit1.appendChild(elementRow);
        }

        // Rating Row
        if (fc.ratings && fc.ratings.length > 0) {
            const ratingRow = document.createElement('div');
            ratingRow.className = 'filter-row';
            ratingRow.innerHTML = `<span class="filter-title">Quality</span><div class="by-rating"></div>`;
            const byRating = ratingRow.querySelector('.by-rating');

            fc.ratings.forEach(rate => {
                const img = document.createElement('img');
                img.src = `../../../asset/icons/rarities/star-${rate}.svg`;
                img.alt = String(rate);
                byRating.appendChild(img);
            });
            fit1.appendChild(ratingRow);
        }

        const fit2 = document.createElement('div');
        fit2.className = 'fit1';

        // Weapon or Path Row
        if (fc.weaponOrPath && fc.weaponOrPath.length > 0) {
            const weaponRow = document.createElement('div');
            weaponRow.className = 'filter-row';
            const categoryTitle = fc.categoryTitle || 'Weapon';
            weaponRow.innerHTML = `<span class="filter-title">${categoryTitle}</span><div class="by-weapon"></div>`;
            const byWeapon = weaponRow.querySelector('.by-weapon');
            const basePath = fc.weaponOrPathBasePath || '../../../asset/icons/weapons/';
            const ext = fc.weaponOrPathExt || 'png';

            fc.weaponOrPath.forEach(item => {
                const img = document.createElement('img');
                img.src = `${basePath}${item}.${ext}`;
                img.alt = item;
                byWeapon.appendChild(img);
            });
            fit2.appendChild(weaponRow);
        }

        // Search bar
        const searchForm = document.createElement('form');
        searchForm.innerHTML = `
            <div class="search">
                <span class="search-icon"></span>
                <input class="search-input" id="searchInput" type="text" placeholder="Search">
            </div>
        `;
        fit2.appendChild(searchForm);

        filterContainer.appendChild(fit1);
        filterContainer.appendChild(fit2);

        this.searchInput = document.getElementById('searchInput');
    }

    displayAll() {
        this.displayItem(this.config.characters);
    }
}

