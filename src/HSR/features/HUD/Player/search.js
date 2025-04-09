import { HSRCharacter } from "../../../database/character.js";
import { chooseCharacter } from "./code.js";

const searchInput = document.getElementById('searchInput');
const characterSelection = document.querySelector('.character-list');
const ul = document.createElement('ul');

let selectedElement = '';
let selectedWeapon = '';
let selectedRating = '';

function check_selection(name) {
    for (let i in HSRCharacter) {
        let lowerCaseText = HSRCharacter[i].name.toLowerCase()
        if (lowerCaseText == name) {
            return HSRCharacter[i].selected;
        }
    }
}

displayAllItem(HSRCharacter);

searchInput.addEventListener('input', () => {
    filterCharacters();
});

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
        console.log(img.alt);
        if (selectedRating == img.alt) {
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
    const searchTerm = searchInput.value.toLowerCase();
    const filteredChampions = HSRCharacter.filter(character => {
        const matchesSearch = character.name.toLowerCase().includes(searchTerm);
        const matchesElement = selectedElement ? character.elements.toLowerCase() === selectedElement : true;
        const matchesWeapon = selectedWeapon ? character.path.toLowerCase() === selectedWeapon : true;
        const matchesRating = selectedRating ? character.stars == selectedRating : true;
        return matchesSearch && matchesElement && matchesWeapon && matchesRating;
    });

    ul.innerHTML = '';
    displayItem(filteredChampions);
}

function displayItem(champions) {
    champions.forEach(champion => {
        let lowerCaseText = champion.name.toLowerCase();
        let element = champion.elements;
        const removeSpaces = (inputText) => {
            return inputText.replace(/\s/g, "");
        };
        let character_file = champion.image_path;
        // console.log(character_file);
        const li = document.createElement('li');
        const img = document.createElement('img');
        const img_element = document.createElement('div');
        img.src = `../../../asset/images/selection_character/${character_file}`;
        img.alt = lowerCaseText;
        img.classList.add('character');

        img_element.style.backgroundImage = `url('../../../asset/icons/elements/${element}.png')`;
        img_element.alt = element;
        img_element.classList.add('element-icon');

        if (champion.stars == '4') {
            img.style.backgroundColor = "#935DB1";
        } else {
            img.style.backgroundColor = "#D07825";
        }
        if (check_selection(lowerCaseText) == true) {
            img.style.backgroundColor = '#ccc';
            img.style.filter = 'grayscale(1)';
        }
        // Add event listener for selecting the character
        img.addEventListener('click', () => {
            // Handle character selection logic here
            console.log(`Character ${champion.name} selected`);
            chooseCharacter(champion);
        });
        li.appendChild(img);
        li.appendChild(img_element);
        ul.appendChild(li);
        characterSelection.appendChild(ul);
        //add the name of the character
        const characterName = document.createElement('div');
        characterName.classList.add('character-name');
        characterName.innerHTML = champion.name;
        li.appendChild(characterName);
    });
}

function displayAllItem() {
    displayItem(HSRCharacter);
}