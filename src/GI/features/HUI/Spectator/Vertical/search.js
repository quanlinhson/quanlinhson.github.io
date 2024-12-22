import { GenshinCharacter } from "../../../../database/character.js";
import { chooseCharacter } from "./code.js";

const searchInput = document.getElementById('searchInput');
const characterSelection = document.querySelector('.character-list');
const ul = document.createElement('ul');

function check_selection(name) {
    for (let i in GenshinCharacter) {
        let lowerCaseText = GenshinCharacter[i].shortName.toLowerCase()
        if (lowerCaseText == name) {
            return GenshinCharacter[i].selected;
        }
    }
}

displayAllItem(GenshinCharacter);

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredChampions = GenshinCharacter.filter(character => character.shortName.toLowerCase().includes(searchTerm.toLowerCase()));

    ul.innerHTML = '';

    displayItem(filteredChampions);
});

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
        img.src = `../../../../asset/images/selection_character/${character_file}.webp`;
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