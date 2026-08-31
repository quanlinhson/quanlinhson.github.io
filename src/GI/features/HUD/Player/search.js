import { GenshinCharacter } from "../../../database/character.js";
import { chooseCharacter } from "./code.js";

const searchInput = document.getElementById('searchInput');
const characterSelection = document.querySelector('.character-list');
const ul = document.createElement('ul');

let selectedElement = '';
let selectedWeapon = '';
let selectedRating = '';

function debounce(fn, delay = 150) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function check_selection(name) {
    for (let i in GenshinCharacter) {
        let lowerCaseText = GenshinCharacter[i].shortName.toLowerCase();
        if (lowerCaseText === name) {
            return GenshinCharacter[i].selected;
        }
    }
}

// Single delegated click listener for character selection
ul.addEventListener('click', (event) => {
    const targetLi = event.target.closest('li');
    if (!targetLi) return;
    const shortName = targetLi.dataset.shortName;
    if (!shortName) return;
    const champion = GenshinCharacter.find(c => c.shortName.toLowerCase() === shortName.toLowerCase());
    if (champion) {
        chooseCharacter(champion);
    }
});

displayAllItem();

searchInput.addEventListener('input', debounce(() => {
    filterCharacters();
}, 150));

document.querySelectorAll('.by-element img').forEach(img => {
    img.addEventListener('click', () => {
        if (selectedElement === img.alt.toLowerCase()) {
            selectedElement = '';
            img.classList.remove('selected');
        } else {
            selectedElement = img.alt.toLowerCase();
            document.querySelectorAll('.by-element img').forEach(i => i.classList.remove('selected'));
            img.classList.add('selected');
        }
        filterCharacters();
    });
});

document.querySelectorAll('.by-weapon img').forEach(img => {
    img.addEventListener('click', () => {
        if (selectedWeapon === img.alt.toLowerCase()) {
            selectedWeapon = '';
            img.classList.remove('selected');
        } else {
            selectedWeapon = img.alt.toLowerCase();
            document.querySelectorAll('.by-weapon img').forEach(i => i.classList.remove('selected'));
            img.classList.add('selected');
        }
        filterCharacters();
    });
});

document.querySelectorAll('.by-rating img').forEach(img => {
    img.addEventListener('click', () => {
        if (selectedRating === img.alt) {
            selectedRating = '';
            img.classList.remove('selected');
        } else {
            selectedRating = img.alt.toLowerCase();
            document.querySelectorAll('.by-rating img').forEach(i => i.classList.remove('selected'));
            img.classList.add('selected');
        }
        filterCharacters();
    });
});

function filterCharacters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredChampions = GenshinCharacter.filter(character => {
        const matchesSearch = character.fullName.toLowerCase().includes(searchTerm) || character.shortName.toLowerCase().includes(searchTerm);
        const matchesElement = selectedElement
            ? (Array.isArray(character.elements)
                ? character.elements.some(e => e.toLowerCase() === selectedElement)
                : character.elements.toLowerCase() === selectedElement)
            : true;
        const matchesWeapon = selectedWeapon ? character.weapon.toLowerCase() === selectedWeapon : true;
        const matchesRating = selectedRating ? String(character.stars) === String(selectedRating) : true;
        return matchesSearch && matchesElement && matchesWeapon && matchesRating;
    });

    displayItem(filteredChampions);
}

function displayItem(champions) {
    ul.innerHTML = '';
    const fragment = document.createDocumentFragment();

    champions.forEach(champion => {
        const lowerCaseText = champion.shortName.toLowerCase();
        const element = Array.isArray(champion.elements) ? champion.elements[0] : champion.elements;
        const character_file = lowerCaseText.replace(/\s/g, "");

        const li = document.createElement('li');
        li.dataset.shortName = champion.shortName;

        const img = document.createElement('img');
        img.src = `../../../asset/images/selection_character/${character_file}.webp`;
        img.alt = lowerCaseText;
        img.classList.add('character');
        img.loading = 'lazy';
        img.dataset.shortName = champion.shortName;

        const img_element = document.createElement('div');
        img_element.style.backgroundImage = `url('../../../asset/icons/elements/${element}.svg')`;
        img_element.alt = element;
        img_element.classList.add('element-icon');

        if (champion.stars === 4 || champion.stars === '4') {
            img.style.backgroundColor = "#935DB1";
        } else {
            img.style.backgroundColor = "#D07825";
        }

        if (check_selection(lowerCaseText) === true) {
            img.style.backgroundColor = '#ccc';
            img.style.filter = 'grayscale(1)';
        }

        const characterName = document.createElement('div');
        characterName.classList.add('character-name');
        characterName.textContent = champion.fullName;

        li.appendChild(img);
        li.appendChild(img_element);
        li.appendChild(characterName);
        fragment.appendChild(li);
    });

    ul.appendChild(fragment);
    if (!characterSelection.contains(ul)) {
        characterSelection.appendChild(ul);
    }
}

function displayAllItem() {
    displayItem(GenshinCharacter);
}