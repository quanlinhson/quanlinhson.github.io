import { GenshinCharacter } from "../../../database/character.js";
import { logic_BP } from "../../../database/logic_bp.js";

export const GIConfig = {
    gameId: 'GI',
    characters: GenshinCharacter,
    logicBP: logic_BP,
    maxSteps: 27,

    slots: {
        blueBan: ['b1', 'b2', 'b3', 'b4', 'b5'],
        redBan: ['r1', 'r2', 'r3', 'r4', 'r5'],
        bluePick: ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'],
        redPick: ['rp1', 'rp2', 'rp3', 'rp4', 'rp5', 'rp6', 'rp7', 'rp8']
    },

    noBanIconUrl: '../../../../All/asset/icons/normal/no_ban.svg',

    filterCategories: {
        categoryTitle: 'Weapon',
        elements: ['anemo', 'cryo', 'dendro', 'electro', 'geo', 'hydro', 'pyro'],
        elementsBasePath: '../../../asset/icons/elements/',
        elementsExt: 'svg',
        ratings: [4, 5],
        weaponOrPath: ['bow', 'catalyst', 'claymore', 'polearm', 'sword'],
        weaponOrPathBasePath: '../../../asset/icons/weapons/',
        weaponOrPathExt: 'png'
    },

    getCharacterIdentifier(char) {
        return char.shortName;
    },

    getCharacterDisplayName(char) {
        return char.fullName;
    },

    renderBanSlot(char, slot) {
        const file = char.shortName.toLowerCase().replace(/\s/g, "");
        const element = Array.isArray(char.elements) ? char.elements[0] : char.elements;

        const img = document.createElement('img');
        img.src = `../../../asset/images/selection_character/${file}.webp`;
        slot.appendChild(img);

        const img_element = document.createElement('div');
        img_element.style.backgroundImage = `url('../../../asset/icons/elements/${element}.svg')`;
        img_element.alt = element;
        img_element.classList.add('element-icon');
        slot.appendChild(img_element);
    },

    renderPickSlot(char, slot) {
        const file = char.shortName.toLowerCase().replace(/\s/g, "");
        const element = Array.isArray(char.elements) ? char.elements[0] : char.elements;

        slot.innerHTML = `
            <img src="../../../asset/images/character/${file}.webp" alt="${file}">
            <div class="pick-overlay"></div>
            <div class="pick-info-row">
                <div class="pick-icons-row">
                    <span class="element-icon" style="background-image:url('../../../asset/icons/elements/${element}.svg')"></span>
                    <span class="weapon-icon" style="background-image:url('../../../asset/icons/weapons/${char.weapon}.png')"></span>
                    <span class="star-icon" style="background-image:url('../../../asset/icons/rarities/star-${char.stars}.svg')"></span>
                </div>
                <div class="pick-name">${char.fullName}</div>
            </div>
        `;
    },

    renderListItem(char) {
        const lowerCaseText = char.shortName.toLowerCase();
        const element = Array.isArray(char.elements) ? char.elements[0] : char.elements;
        const character_file = lowerCaseText.replace(/\s/g, "");

        const li = document.createElement('li');
        li.dataset.identifier = char.shortName;

        const img = document.createElement('img');
        img.src = `../../../asset/images/selection_character/${character_file}.webp`;
        img.alt = lowerCaseText;
        img.classList.add('character');
        img.loading = 'lazy';
        img.dataset.identifier = char.shortName;

        const img_element = document.createElement('div');
        img_element.style.backgroundImage = `url('../../../asset/icons/elements/${element}.svg')`;
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
        characterName.textContent = char.fullName;

        li.appendChild(img);
        li.appendChild(img_element);
        li.appendChild(characterName);
        return li;
    },

    matchFilter(char, { search, element, weaponOrPath, rating }) {
        const matchesSearch = char.fullName.toLowerCase().includes(search) || char.shortName.toLowerCase().includes(search);
        const matchesElement = element
            ? (Array.isArray(char.elements)
                ? char.elements.some(e => e.toLowerCase() === element)
                : char.elements.toLowerCase() === element)
            : true;
        const matchesWeapon = weaponOrPath ? char.weapon.toLowerCase() === weaponOrPath : true;
        const matchesRating = rating ? String(char.stars) === String(rating) : true;
        return matchesSearch && matchesElement && matchesWeapon && matchesRating;
    },

    checkGroupConflict(char, teamSlots, currentSlotId) {
        let count = 0;
        for (let slotId of teamSlots) {
            if (slotId === currentSlotId) continue;
            const slot = document.getElementById(slotId);
            if (slot && slot.classList.contains('filled')) {
                const img = slot.querySelector('img');
                if (img) {
                    const imgFile = img.src.split('/').pop().replace('.webp', '');
                    const c = GenshinCharacter.find(item => item.shortName.toLowerCase().replace(/\s/g, '') === imgFile);
                    if (c && c.fullName === char.fullName) count++;
                }
            }
        }
        return count > 0;
    }
};

