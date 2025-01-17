import { GenshinCharacter } from "../../../database/character.js";
import { chooseCharacter } from "./code.js";

const searchInput = document.getElementById('searchInput');
const characterSelection = document.querySelector('.character-list');
const ul = document.createElement('ul');

let selectedElement = '';
let selectedWeapon = '';
let selectedRating = '';

function check_selection(name) {
    for (let i in GenshinCharacter) {
        let lowerCaseText = GenshinCharacter[i].shortName.toLowerCase()
        if (lowerCaseText == name) {
            return GenshinCharacter[i].selected;
        }
    }
}

displayAllItem(GenshinCharacter);

// searchInput.addEventListener('input', () => {
//     const searchTerm = searchInput.value.toLowerCase();
//     const filteredChampions = GenshinCharacter.filter(character => character.shortName.toLowerCase().includes(searchTerm.toLowerCase()));

//     ul.innerHTML = '';

//     displayItem(filteredChampions);
// });

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
    const filteredChampions = GenshinCharacter.filter(character => {
        const matchesSearch = character.shortName.toLowerCase().includes(searchTerm);
        const matchesElement = selectedElement ? character.elements.map(e => e.toLowerCase()).includes(selectedElement) : true;
        const matchesWeapon = selectedWeapon ? character.weapon.toLowerCase() === selectedWeapon : true;
        const matchesRating = selectedRating ? character.stars == selectedRating : true;
        return matchesSearch && matchesElement && matchesWeapon && matchesRating;
    });

    ul.innerHTML = '';
    displayItem(filteredChampions);
}

function displayItem(champions) {
    champions.forEach(champion => {
        let lowerCaseText = champion.shortName.toLowerCase();
        const removeSpaces = (inputText) => {
            return inputText.replace(/\s/g, "");
        };
        let character_file = removeSpaces(lowerCaseText);
        // console.log(character_file);
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = `../../../asset/images/selection_character/${character_file}.webp`;
        img.alt = lowerCaseText;
        img.classList.add('character');
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
            console.log(`Character ${champion.fullName} selected`);
            chooseCharacter(champion);
        });
        li.appendChild(img);
        ul.appendChild(li);
        characterSelection.appendChild(ul);
        //add the name of the character
        const characterName = document.createElement('div');
        characterName.classList.add('character-name');
        characterName.innerHTML = champion.fullName;
        li.appendChild(characterName);
    });
}

function displayAllItem() {
    displayItem(GenshinCharacter);
}