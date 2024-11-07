import { GenshinCharacter } from "../../../../database/character.js";

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredArray = GenshinCharacter.filter(character => character.shortName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (searchTerm.trim() === '') {
        // Clear the search results if the input is empty
        searchResults.innerHTML = '';
    } else {
        filteredArray.forEach(character => {
            const li = document.createElement('li');
            li.textContent = character.shortName;
            searchResults.appendChild(li);
        });
    }
});