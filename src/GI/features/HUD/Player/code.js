import { GenshinCharacter } from "../../../database/character.js";
import { logic_BP } from "../../../database/logic_bp.js";
import { resetTime, startCountdown } from "../../../../All/tools/time.js";

//Time setting value
let banTimeSetting = 30;
let pickTimeSetting = 60;
let isBanTimeSet = false;
let isPickTimeSet = false;
//Global variables
let globalTeam1 = "Team 1";
let globalTeam2 = "Team 2";
let champion_number = 27;
let i = 1;
let l = 0, r = 0, lp = 0, rp = 0;
let current, current_log;
let current_n = 0;
// Logic variables
let tempSelectedCharacter = null;
let isBanPickFinished = false;
let confirmBtn = null;
let isSettingsSaved = false;

const BlueBanSlot = ['b1', 'b2', 'b3', 'b4', 'b5'];
const RedBanSlot = ['r1', 'r2', 'r3', 'r4', 'r5'];
const BluePickSlot = ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'];
const RedPickSlot = ['rp1', 'rp2', 'rp3', 'rp4', 'rp5', 'rp6', 'rp7', 'rp8'];

function ban_sound_play() {
    var audio = document.getElementById("ban-sound");
    audio.play();
}

function pick_sound_play() {
    var audio = document.getElementById("pick-sound");
    audio.play();
}

function playBackgroundMusic() {
    var audio_bp = document.getElementById("bp-sound");
    audio_bp.play().catch(() => {
        document.addEventListener('click', () => {
            audio_bp.play();
            audio_bp.loop = true;
        }, { once: true });
    });
    audio_bp.loop = true;
}

function check_selection(name) {
    for (let i in GenshinCharacter) {
        if (GenshinCharacter[i].shortName == name) {
            return GenshinCharacter[i].selected;
        }
    }
}

function picking_selection(name) {
    for (let i in GenshinCharacter) {
        if (GenshinCharacter[i].shortName == name) {
            return GenshinCharacter[i].selected = true;
        }
    }
}

function updateTeamTurn(i) {
    const team1Element = document.getElementById('team1-name');
    const team2Element = document.getElementById('team2-name');
    const team1Container = team1Element.closest('.roomTeamName');
    const team2Container = team2Element.closest('.roomTeamName');

    team1Container.classList.remove('turn');
    team2Container.classList.remove('turn');
    team1Element.textContent = globalTeam1;
    team2Element.textContent = globalTeam2;

    if (logic_BP[i] == "RedBan") {
        team2Element.textContent = `${team2Element.textContent}'s BANNING...`;
        team2Container.classList.add('turn');
    }
    else if (logic_BP[i] == "BlueBan") {
        team1Element.textContent = `${team1Element.textContent}'s BANNING...`;
        team1Container.classList.add('turn');
    }
    else if (logic_BP[i] == "BluePick") {
        team1Element.textContent = `${team1Element.textContent}'s PICKING...`;
        team1Container.classList.add('turn');
    }
    else if (logic_BP[i] == "RedPick") {
        team2Element.textContent = `${team2Element.textContent}'s PICKING...`;
        team2Container.classList.add('turn');
    }
}

function handleNoBan(slotId) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    slot.innerHTML = '';
    slot.classList.remove('active', 'blue-blink', 'red-blink');
    slot.classList.add('filled');
    const noBanDiv = document.createElement('div');
    noBanDiv.className = 'no-ban-icon';
    noBanDiv.title = 'No Ban';
    noBanDiv.style.backgroundImage = 'url("../../../../All/asset/icons/normal/no_ban.svg")';
    slot.appendChild(noBanDiv);
}

function getValidRandomCharacter() {
    const teamSlots = getTeamSlotsByCurrent();
    const validCharacters = GenshinCharacter.filter(char => {
        if (char.selected) return false;
        if (countGroupInTeam(char.fullName, teamSlots, current) > 0) return false;
        return true;
    });
    if (validCharacters.length === 0) return null;
    const idx = Math.floor(Math.random() * validCharacters.length);
    return validCharacters[idx];
}

function handleCharacterPick(character, slotId) {
    picking_selection(character.shortName);
    updateSlotUI(slotId, character);
    setSlotSelected(slotId);

    if (current_log === 'ban') {
        const slot = document.getElementById(current);
        const img = slot.querySelector('img');
        if (img) img.classList.add('grayscaled');
    }

    const listImgPick = document.querySelector(`.character-list img[alt="${character.shortName.toLowerCase()}"]`);
    if (listImgPick) {
        listImgPick.style.filter = 'grayscale(1)';
        listImgPick.style.backgroundColor = '#ccc';
    }
}

function handleBanPickEnd() {
    const timer = document.querySelector('.timer');
    if (timer) timer.textContent = 'Ended';
    if (window.countdown) clearInterval(window.countdown);
    if (confirmBtn) confirmBtn.disabled = true;
    isBanPickFinished = true;
    tempSelectedCharacter = null;

    const team1Element = document.getElementById('team1-name');
    const team2Element = document.getElementById('team2-name');
    if (team1Element) team1Element.textContent = globalTeam1;
    if (team2Element) team2Element.textContent = globalTeam2;

    hideBanPickUI();
}

function begin() {
    if (!isSettingsSaved) return;

    let slot;
    if (i >= champion_number) {
        handleBanPickEnd();
        return;
    }

    if (logic_BP[i] == "RedBan") {
        current = RedBanSlot[r];
        current_n = r;
        current_log = 'ban';
        slot = document.getElementById(current);
        if (slot) slot.classList.add('active', 'red-blink');
        startCountdown(
            banTimeSetting,
            () => {
                if (i >= champion_number) return;
                handleNoBan(current);
                if (slot) slot.classList.remove('active', 'red-blink');
                r++;
                i++;
                ban_sound_play();
                check();
                begin();
                if (confirmBtn) confirmBtn.disabled = true;
            }
        );
        updateTeamTurn(i);
    }
    else if (logic_BP[i] == "BlueBan") {
        current = BlueBanSlot[l];
        current_n = l;
        current_log = 'ban';
        slot = document.getElementById(current);
        if (slot) slot.classList.add('active', 'blue-blink');
        startCountdown(
            banTimeSetting,
            () => {
                if (i >= champion_number) return;
                handleNoBan(current);
                if (slot) slot.classList.remove('active', 'blue-blink');
                l++;
                i++;
                ban_sound_play();
                check();
                begin();
                if (confirmBtn) confirmBtn.disabled = true;
            }
        );
        updateTeamTurn(i);
    }
    else if (logic_BP[i] == "BluePick") {
        current = BluePickSlot[lp];
        current_n = lp;
        current_log = 'pick';
        slot = document.getElementById(current);
        slot.classList.add('active', 'blue-blink');
        startCountdown(
            pickTimeSetting,
            () => {
                if (i >= champion_number) return;
                if (tempSelectedCharacter) {
                    handleCharacterPick(tempSelectedCharacter, current);
                    pick_sound_play();
                } else {
                    const randomChar = getValidRandomCharacter();
                    if (randomChar) {
                        tempSelectedCharacter = randomChar;
                        handleCharacterPick(randomChar, current);
                        pick_sound_play();
                    }
                }
                lp++;
                i++;
                if (i >= champion_number) {
                    handleBanPickEnd();
                    return;
                }
                check();
                begin();
                if (confirmBtn) confirmBtn.disabled = true;
                tempSelectedCharacter = null;
            }
        );
        updateTeamTurn(i);
    }
    else if (logic_BP[i] == "RedPick") {
        current = RedPickSlot[rp];
        current_n = rp;
        current_log = 'pick';
        slot = document.getElementById(current);
        slot.classList.add('active', 'red-blink');
        startCountdown(
            pickTimeSetting,
            () => {
                if (i >= champion_number) return;
                if (tempSelectedCharacter) {
                    handleCharacterPick(tempSelectedCharacter, current);
                    pick_sound_play();
                } else {
                    const randomChar = getValidRandomCharacter();
                    if (randomChar) {
                        tempSelectedCharacter = randomChar;
                        handleCharacterPick(randomChar, current);
                        pick_sound_play();
                    }
                }
                rp++;
                i++;
                if (i >= champion_number) {
                    handleBanPickEnd();
                    return;
                }
                check();
                begin();
                if (confirmBtn) confirmBtn.disabled = true;
                tempSelectedCharacter = null;
            }
        );
        updateTeamTurn(i);
    }
    else {
        current_log = 'stop';
    }
}

function check() {
    if (logic_BP[i] == "RedBan") {
        current = RedBanSlot[r];
        current_n = r;
        current_log = 'ban';
    }
    else if (logic_BP[i] == "BlueBan") {
        current = BlueBanSlot[l];
        current_n = l;
        current_log = 'ban';
    }
    else if (logic_BP[i] == "BluePick") {
        current = BluePickSlot[lp];
        current_n = lp;
        current_log = 'pick';
    }
    else if (logic_BP[i] == "RedPick") {
        current = RedPickSlot[rp];
        current_n = rp;
        current_log = 'pick';
    }
    else {
        current_log = 'stop';
    }
}

function setSlotSelected(slotId) {
    const slot = document.getElementById(slotId);
    if (slot) {
        slot.classList.remove('active', 'blue-blink', 'red-blink');
        slot.classList.add('selected');
        setTimeout(() => slot.classList.remove('selected'), 600);
    }
}

function showAlert(message, resetMessage = null) {
    const alertElement = document.getElementById('duplicate-alert');
    if (!alertElement) return;
    alertElement.style.display = 'block';
    alertElement.textContent = message;
    setTimeout(() => {
        alertElement.style.display = 'none';
        if (resetMessage) alertElement.textContent = resetMessage;
    }, 2000);
}

function getTeamSlotsByCurrent() {
    if (current_log !== 'pick') return [];
    if (BluePickSlot.includes(current)) return BluePickSlot;
    if (RedPickSlot.includes(current)) return RedPickSlot;
    return [];
}

function removeSpaces(inputText) {
    if (inputText) {
        return inputText.replace(/\s/g, "");
    }
    return "";
}

function countGroupInTeam(group, teamSlots, excludeSlotId = null) {
    let count = 0;
    for (let slotId of teamSlots) {
        if (slotId === excludeSlotId) continue;
        const slot = document.getElementById(slotId);
        if (slot && slot.classList.contains('filled')) {
            const img = slot.querySelector('img');
            if (img) {
                const imgFile = img.src.split('/').pop().replace('.webp', '');
                const char = GenshinCharacter.find(c => c.shortName.toLowerCase() === imgFile);
                if (char && char.fullName === group) count++;
            }
        }
    }
    return count;
}

export function chooseCharacter(character) {
    if (isBanPickFinished) return;

    // Check the other version of this character
    if (character.fullName) {
        const teamSlots = getTeamSlotsByCurrent();
        if (countGroupInTeam(character.fullName, teamSlots, current) > 0) {
            showAlert("You can't choose this character again!");
            return;
        }
    }

    // Check the character is already selected
    if (check_selection(character.shortName) === true) {
        showAlert("You can't choose this character again!");
        return;
    }

    tempSelectedCharacter = character;
    updateSlotUI(current, character);

    if (!isBanPickFinished) {
        document.getElementById('confirm').disabled = false;
    }
}

function updateSlotUI(slotId, character) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    slot.innerHTML = '';
    slot.classList.add('filled');

    if (current_log === 'ban') {
        const img = document.createElement('img');
        let file = removeSpaces(character.shortName.toLowerCase());
        img.src = `../../../asset/images/selection_character/${file}.webp`;
        slot.appendChild(img);

        let element = character.elements;
        const img_element = document.createElement('div');
        img_element.style.backgroundImage = `url('../../../asset/icons/elements/${element}.svg')`;
        img_element.alt = element;
        img_element.classList.add('element-icon');
        slot.appendChild(img_element);
    } else if (current_log === 'pick') {
        slot.innerHTML = `
            <img src="../../../asset/images/character/${removeSpaces(character.shortName.toLowerCase())}.webp" alt="${removeSpaces(character.shortName.toLowerCase())}">
            <div class="pick-overlay"></div>
            <div class="pick-info-row">
                <div class="pick-icons-row">
                    <span class="element-icon" style="background-image:url('../../../asset/icons/elements/${character.elements}.svg')"></span>
                    <span class="weapon-icon" style="background-image:url('../../../asset/icons/weapons/${character.weapon}.png')"></span>
            <span class="star-icon" style="background-image:url('../../../asset/icons/rarities/star-${character.stars}.svg')"></span>
                </div>
                <div class="pick-name">${character.fullName}</div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModal = document.getElementById('settings-modal');

    const characterFilter = document.querySelector('.character-filter');
    const characterList = document.querySelector('.character-list');
    const confirmButton = document.getElementById('confirm');

    if (settingsIcon && settingsModal) {
        settingsIcon.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
        });

        settingsModal.addEventListener('click', (event) => {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    window.addEventListener('message', (event) => {
        const { settingsData, settingsSaved } = event.data;

        if (settingsSaved) {
            isSettingsSaved = true;

            // Update team names
            if (settingsData.team1Name) {
                globalTeam1 = settingsData.team1Name;
                document.getElementById('team1-name').textContent = settingsData.team1Name;
            }
            if (settingsData.team2Name) {
                globalTeam2 = settingsData.team2Name;
                document.getElementById('team2-name').textContent = settingsData.team2Name;
            }

            // Update team scores
            if (settingsData.team1Score) {
                document.getElementById('team1-score').textContent = settingsData.team1Score;
            }
            if (settingsData.team2Score) {
                document.getElementById('team2-score').textContent = settingsData.team2Score;
            }

            // Update time setting
            if (settingsData.banTime && !isBanTimeSet) {
                banTimeSetting = settingsData.banTime;
                isBanTimeSet = true;
            }
            if (settingsData.pickTime && !isPickTimeSet) {
                pickTimeSetting = settingsData.pickTime;
                isPickTimeSet = true;
            }

            // Update volume
            if (settingsData.volume !== undefined) {
                settingsData.volume /= 100;
                bpSound.volume = settingsData.volume;
                banSound.volume = settingsData.volume;
                pickSound.volume = settingsData.volume;
            }

            characterFilter.style.pointerEvents = 'auto';
            characterList.style.pointerEvents = 'auto';
            confirmButton.style.pointerEvents = 'auto';
            isSettingsSaved = true;

            playBackgroundMusic();
            begin();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const volumeDropdown = document.getElementById('volume-dropdown');
    const volumeControl = document.getElementById('volume-control');
    const bpVolumeRange = document.getElementById('bp-volume-range');
    const banVolumeRange = document.getElementById('ban-volume-range');
    const pickVolumeRange = document.getElementById('pick-volume-range');
    const bpSound = document.getElementById('bp-sound');
    const banSound = document.getElementById('ban-sound');
    const pickSound = document.getElementById('pick-sound');

    volumeDropdown.addEventListener('click', () => {
        if (volumeControl.style.display === 'block') {
            volumeControl.style.display = 'none';
        } else {
            volumeControl.style.display = 'block';
        }
    });

    bpVolumeRange.addEventListener('input', () => {
        const volume = bpVolumeRange.value / 100;
        bpSound.volume = volume;
    });

    banVolumeRange.addEventListener('input', () => {
        const volume = banVolumeRange.value / 100;
        banSound.volume = volume;
    });

    pickVolumeRange.addEventListener('input', () => {
        const volume = pickVolumeRange.value / 100;
        pickSound.volume = volume;
    });
});

function hideBanPickUI() {
    document.querySelector('.character-filter')?.classList.add('hide-banpick-ui');
    document.querySelector('.character-list')?.classList.add('hide-banpick-ui');
    const confirmBtn = document.getElementById('confirm');
    if (confirmBtn) {
        confirmBtn.classList.add('hide-banpick-ui');
        confirmBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirm');
    confirmBtn.disabled = true;

    confirmBtn.addEventListener('click', () => {
        if (!tempSelectedCharacter) return;

        handleCharacterPick(tempSelectedCharacter, current);

        if (current_log === 'ban') ban_sound_play();
        else if (current_log === 'pick') pick_sound_play();

        if (logic_BP[i] == "RedBan") r++;
        else if (logic_BP[i] == "BlueBan") l++;
        else if (logic_BP[i] == "BluePick") lp++;
        else if (logic_BP[i] == "RedPick") rp++;

        i++;
        if (i >= champion_number) {
            handleBanPickEnd();
            return;
        }

        check();
        begin();

        tempSelectedCharacter = null;
        confirmBtn.disabled = true;
    });
});