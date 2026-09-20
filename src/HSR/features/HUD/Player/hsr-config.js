import { HSRCharacter } from "../../../database/character.js";
import { logic_BP } from "../../../database/logic_bp.js";

export const HSRConfig = {
    gameId: 'HSR',
    characters: HSRCharacter,
    logicBP: logic_BP,
    maxSteps: 23,

    slots: {
        blueBan: ['b1', 'b2', 'b3'],
        redBan: ['r1', 'r2', 'r3'],
        bluePick: ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'],
        redPick: ['rp1', 'rp2', 'rp3', 'rp4', 'rp5', 'rp6', 'rp7', 'rp8']
    },

    noBanIconUrl: '../../../../All/asset/icons/normal/no_ban.svg',

    filterCategories: {
        categoryTitle: 'Path',
        elements: ['Physical', 'Fire', 'Ice', 'Lightning', 'Wind', 'Quantum', 'Imaginary'],
        elementsBasePath: '../../../asset/icons/elements/',
        elementsExt: 'png',
        ratings: [4, 5],
        weaponOrPath: ['Destruction', 'TheHunt', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Abundance', 'Remembrance', 'Elation'],
        weaponOrPathBasePath: '../../../asset/icons/path/',
        weaponOrPathExt: 'png'
    },

    getCharacterIdentifier(char) {
        return char.full_name;
    },

    getCharacterDisplayName(char) {
        return char.full_name;
    },

    renderBanSlot(char, slot) {
        const img = document.createElement('img');
        img.src = `../../../asset/images/selection_character/${char.image_path}`;
        img.style.filter = 'grayscale(1)';
        slot.appendChild(img);

        const elementDiv = document.createElement('div');
        elementDiv.style.backgroundImage = `url('../../../asset/icons/elements/${char.elements}.png')`;
        elementDiv.alt = char.elements;
        elementDiv.classList.add('element-icon');
        slot.appendChild(elementDiv);
    },

    renderPickSlot(char, slot) {
        slot.innerHTML = `
            <div class="pick-art" style="background-image: url('../../../asset/images/character/${char.image_path}')"></div>
            <div class="pick-overlay"></div>
            <div class="pick-info-row">
                <div class="pick-icons-row">
                    <span class="element-icon" style="background-image:url('../../../asset/icons/elements/${char.elements}.png')"></span>
                    <span class="weapon-icon" style="background-image:url('../../../asset/icons/path/${char.path}.png')"></span>
                </div>
                <div class="pick-name">${char.full_name}</div>
            </div>
        `;
    },

    renderListItem(char) {
        const lowerCaseText = char.full_name.toLowerCase();
        const element = char.elements;
        const character_file = char.image_path;

        const li = document.createElement('li');
        li.dataset.identifier = char.full_name;

        const img = document.createElement('img');
        img.src = `../../../asset/images/selection_character/${character_file}`;
        img.alt = lowerCaseText;
        img.classList.add('character');
        img.loading = 'lazy';
        img.dataset.identifier = char.full_name;

        const img_element = document.createElement('div');
        img_element.style.backgroundImage = `url('../../../asset/icons/elements/${element}.png')`;
        img_element.alt = element;
        img_element.classList.add('element-icon');

        if (char.stars === 4 || char.stars === '4') {
            img.style.backgroundColor = "#935DB1";
        } else {
            img.style.backgroundColor = "#D07825";
        }

        if (char.selected === true) {
            img.style.backgroundColor = '#ccc';
            img.style.filter = 'grayscale(1)';
        }

        const characterName = document.createElement('div');
        characterName.classList.add('character-name');
        characterName.textContent = char.full_name;

        li.appendChild(img);
        li.appendChild(img_element);
        li.appendChild(characterName);
        return li;
    },

    matchFilter(char, { search, element, weaponOrPath, rating }) {
        const matchesSearch = char.full_name.toLowerCase().includes(search) || char.name.toLowerCase().includes(search);
        const matchesElement = element ? char.elements.toLowerCase() === element : true;
        const matchesWeapon = weaponOrPath ? char.path.toLowerCase() === weaponOrPath : true;
        const matchesRating = rating ? String(char.stars) === String(rating) : true;
        return matchesSearch && matchesElement && matchesWeapon && matchesRating;
    },

    checkGroupConflict(char, teamSlots, currentSlotId) {
        // HSR character group conflict if applicable
        return false;
    }
};

