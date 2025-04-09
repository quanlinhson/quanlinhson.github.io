import { HSRCharacter } from "../../../database/character.js";
import { logic_BP } from "../../../database/logic_bp.js";
import { resetTime, startCountdown } from "../../../../All/tools/time.js";

let globalTimeSetting = 60;
let globalTeam1 = "Team 1";
let globalTeam2 = "Team 2";

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
        // If play fails, set up an event listener to play after user interaction
        document.addEventListener('click', () => {
            audio_bp.play();
            audio_bp.loop = true;
        }, { once: true });
    });
    audio_bp.loop = true;
}

function check_selection(name) {
    for (let i in HSRCharacter) {
        if (HSRCharacter[i].name == name) {
            return HSRCharacter[i].selected;
        }
    }
}

function picking_selection(name) {
    for (let i in HSRCharacter) {
        if (HSRCharacter[i].name == name) {
            return HSRCharacter[i].selected = true;
        }
    }
}

let i = 1;
let l = 0, r = 0, lp = 0, rp = 0;
const characters = document.querySelectorAll('.character-list img');

const BlueBanSlot = ['b1', 'b2', 'b3'];
const RedBanSlot = ['r1', 'r2', 'r3'];
const BluePickSlot = ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'];
const RedPickSlot = ['rp1', 'rp2', 'rp3', 'rp4', 'rp5', 'rp6', 'rp7', 'rp8'];

let current, current_log;
let current_n = 0;

function updateTeamTurn(i) {
    const team1Element = document.getElementById('team1-name');
    const team2Element = document.getElementById('team2-name');
    const team1Container = team1Element.closest('.roomTeamReady');
    const team2Container = team2Element.closest('.roomTeamReady');

    // Reset classes and text
    team1Container.classList.remove('turn');
    team2Container.classList.remove('turn');
    team1Element.textContent = globalTeam1;
    team2Element.textContent = globalTeam2;

    if (logic_BP[i] == "RedBan") {
        team2Element.textContent = `${team2Element.textContent}'s BANNING.`;
        team2Container.classList.add('turn');
    }
    else if (logic_BP[i] == "BlueBan") {
        team1Element.textContent = `${team1Element.textContent}'s BANNING.`;
        team1Container.classList.add('turn');
    }
    else if (logic_BP[i] == "BluePick") {
        team1Element.textContent = `${team1Element.textContent}'s PICKING.`;
        team1Container.classList.add('turn');
    }
    else if (logic_BP[i] == "RedPick") {
        team2Element.textContent = `${team2Element.textContent}'s PICKING.`;
        team2Container.classList.add('turn');
    }
}

function begin(i) {
    if (logic_BP[i] == "RedBan") {
        console.log("RedBan");
        current = RedBanSlot[r];
        current_n = r;
        current_log = 'ban';
        document.getElementById(current).style.animation = 'blink2 1s linear infinite';
    }
    else if (logic_BP[i] == "BlueBan") {
        console.log("BlueBan");
        console.log(BlueBanSlot[l]);
        current = BlueBanSlot[l];
        current_n = l;
        current_log = 'ban';
        document.getElementById(current).style.animation = 'blink2 1s linear infinite';
    }
    else if (logic_BP[i] == "BluePick") {
        console.log("BluePick");
        current = BluePickSlot[lp];
        current_n = lp;
        current_log = 'pick';
    }
    else if (logic_BP[i] == "RedPick") {
        console.log("RedPick");
        current = RedPickSlot[rp];
        current_n = rp;
        current_log = 'pick';
    }
    else {
        current_log = 'stop';
    }
}

function check(i) {
    if (logic_BP[i] == "RedBan") {
        console.log("RedBan");
        current = RedBanSlot[r];
        current_n = r;
        current_log = 'ban';
        r++;
    }
    else if (logic_BP[i] == "BlueBan") {
        console.log("BlueBan");
        console.log(BlueBanSlot[l]);
        current = BlueBanSlot[l];
        current_n = l;
        current_log = 'ban';
        l++;
    }
    else if (logic_BP[i] == "BluePick") {
        console.log("BluePick");
        current = BluePickSlot[lp];
        current_n = lp;
        current_log = 'pick';
        lp++;
    }
    else if (logic_BP[i] == "RedPick") {
        console.log("RedPick");
        current = RedPickSlot[rp];
        current_n = rp;
        current_log = 'pick';
        rp++;
    }
    else {
        current_log = 'stop';
    }
}

function blink(i) {
    if (logic_BP[i] == "BluePick") {
        current = BluePickSlot[lp];
        document.getElementById(current).style.animation = 'blink2 1s linear infinite';
    }
    else if (logic_BP[i] == "RedPick") {
        current = RedPickSlot[rp];
        document.getElementById(current).style.animation = 'blink1 1s linear infinite';
    }
    else if (logic_BP[i] == "BlueBan") {
        current = BlueBanSlot[l];
        document.getElementById(current).style.animation = 'blink2 1s linear infinite';
    }
    else if (logic_BP[i] == "RedBan") {
        current = RedBanSlot[r];
        document.getElementById(current).style.animation = 'blink1 1s linear infinite';
    }
}

function removeSpaces(inputText) {
    if (inputText) {
        return inputText.replace(/\s/g, "");
    }
    return "";
}

begin(i);

export function chooseCharacter(character) {
    console.log(character);
    if (check_selection(character.name) == true) {
        const alertElement = document.getElementById('duplicate-alert');
        alertElement.style.display = 'block';

        // Hide the alert after 2 seconds
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 2000);
    }
    else {
        const img = document.createElement('img');
        const file_name = character.image_path;
        check(i);
        switch (current_log) {
            case 'ban':
                //Character Image
                img.src = `../../../asset/images/selection_character/${file_name}`;
                img.style.filter = 'grayscale(1)';
                //Element
                let element = character.elements;
                const img_element = document.createElement('div');
                img_element.style.backgroundImage = `url('../../../asset/icons/elements/${element}.png')`;
                img_element.alt = element;
                img_element.classList.add('element-icon');
                //Add to banSlots
                const banSlots = document.getElementById(current);
                banSlots.style.backgroundImage = 'none';
                banSlots.appendChild(img);
                banSlots.appendChild(img_element);
                i++;
                updateTeamTurn(i);
                const listImg = document.querySelector(`.character-list img[alt="${character.name.toLowerCase()}"]`);
                listImg.style.backgroundColor = '#ccc';
                listImg.style.filter = 'grayscale(1)';
                picking_selection(character.name);
                document.getElementById(current).style.animation = 'null';
                ban_sound_play();
                resetTime(globalTimeSetting);
                break;
            case 'pick':
                //Image Character
                console.log(character.name);
                picking_selection(character.name);
                img.src = `../../../asset/images/selection_character/${file_name}`;
                const name = document.createElement('p');
                name.innerHTML = character.name;
                //Element
                let element_p = character.elements;
                const img_element_p = document.createElement('div');
                img_element_p.style.backgroundImage = `url('../../../asset/icons/elements/${element_p}.png')`;
                img_element_p.alt = element_p;
                img_element_p.classList.add('element-icon');
                //Weapons
                let weapon_p = character.path;
                const img_weapon_p = document.createElement('div');
                img_weapon_p.style.backgroundImage = `url('../../../asset/icons/path/${weapon_p}.png')`;
                img_weapon_p.alt = weapon_p;
                img_weapon_p.classList.add('weapon-icon');
                //Rarity
                let star = character.stars;
                const img_star = document.createElement('div');
                img_star.style.backgroundImage = `url('../../../asset/icons/rarities/star-${star}.svg')`;
                img_star.alt = star;
                img_star.classList.add('star-icon');
                //Testing
                console.log(removeSpaces(character.name.toLowerCase()));

                const pickSlots = document.getElementById(current);
                pickSlots.style.backgroundImage = 'none';
                // If an empty slot was found, add the image to it
                pickSlots.appendChild(img);
                pickSlots.appendChild(name);
                pickSlots.appendChild(img_element_p);
                pickSlots.appendChild(img_weapon_p);
                pickSlots.appendChild(img_star);
                i++;
                updateTeamTurn(i);
                const listImgPick = document.querySelector(`.character-list img[alt="${character.name.toLowerCase()}"]`);
                if (listImgPick) {
                    listImgPick.style.filter = 'grayscale(1)';
                    listImgPick.style.backgroundColor = '#ccc';
                }
                document.getElementById(current).style.animation = 'null';
                pick_sound_play();
                resetTime(globalTimeSetting);
                break;
            case 'stop':
                console.log('Ban Pick End!!!');
                break;
        };
        console.log(i);
        blink(i);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModal = document.getElementById('settings-modal');

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

    // Listen for messages from the iframe
    window.addEventListener('message', (event) => {
        const settingsData = event.data;

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
            document.querySelector('.roomTitleBar p:nth-child(2)').textContent = settingsData.team1Score;
        }
        if (settingsData.team2Score) {
            document.querySelector('.roomTitleBar p:nth-child(4)').textContent = settingsData.team2Score;
        }

        // Update time setting
        if (settingsData.timeSetting) {
            globalTimeSetting = settingsData.timeSetting;
            setTimer(settingsData.timeSetting);
        }

        // Update volume
        if (settingsData.volume !== undefined) {
            settingsData.volume /= 100;
            bpSound.volume = settingsData.volume;
            banSound.volume = settingsData.volume;
            pickSound.volume = settingsData.volume;
        }

        // Update ban/pick turn logic
        if (settingsData.banPickTurn) {
            // Implement your custom logic here
            console.log(`Ban/Pick Turn Logic: ${settingsData.banPickTurn}`);
        }

        playBackgroundMusic();
        startCountdown(settingsData.timeSetting);
    });
});

// Function to set the timer (example implementation)
function setTimer(seconds) {
    // Your timer logic here
    console.log(`Timer set to ${seconds} seconds`);
}

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