import { GenshinCharacter } from "../../../../database/character.js";
import { logic_BP } from "../../../../database/logic_bp.js";
import { resetTime } from "../Vertical/time.js";

function ban_sound_play() {
    var audio = document.getElementById("ban-sound");
    audio.play();
}

function pick_sound_play() {
    var audio = document.getElementById("pick-sound");
    audio.play();
}

var audio_bp = document.getElementById("bp-sound");
audio_bp.play();
audio_bp.loop = true;

const characterSelection = document.querySelector('.character-list');
const ul = document.createElement('ul');

// for (let i in GenshinCharacter) {
//     let lowerCaseText = GenshinCharacter[i].shortName.toLowerCase();
//     const removeSpaces = (inputText) => {
//         return inputText.replace(/\s/g, "");
//     };
//     let character_file = removeSpaces(lowerCaseText);
//     // console.log(character_file);
//     const li = document.createElement('li');
//     const img = document.createElement('img');
//     img.src = `../../../../asset/images/selection_character/${character_file}.webp`;
//     img.alt = lowerCaseText;
//     img.classList.add('character');
//     if (GenshinCharacter[i].stars == '4') {
//         img.style.backgroundColor = "#935DB1";
//     } else {
//         img.style.backgroundColor = "#D07825";
//     }
//     li.appendChild(img);
//     ul.appendChild(li);
//     characterSelection.appendChild(ul);
//     //add the name of the character
//     const characterName = document.createElement('div');
//     characterName.classList.add('character-name');
//     characterName.innerHTML = GenshinCharacter[i].fullName;
//     li.appendChild(characterName);
// };

function findFullName(name) {
    for (let i in GenshinCharacter) {
        let lowerCaseText = GenshinCharacter[i].shortName.toLowerCase()
        if (lowerCaseText == name) {
            return GenshinCharacter[i].fullName;
        }
    }
}

function check_selection(name) {
    for (let i in GenshinCharacter) {
        let lowerCaseText = GenshinCharacter[i].shortName.toLowerCase()
        if (lowerCaseText == name) {
            return GenshinCharacter[i].selected;
        }
    }
}

function picking_selection(name) {
    for (let i in GenshinCharacter) {
        let lowerCaseText = GenshinCharacter[i].shortName.toLowerCase()
        if (lowerCaseText == name) {
            GenshinCharacter[i].selected = true;
        }
    }
}

let i = 1;
let l = 0, r = 0, lp = 0, rp = 0;
const characters = document.querySelectorAll('.character-list img');
let testing;
setInterval(function () {
    testing.push(document.querySelectorAll('.character-list img'));
    console.log('Texting');
    console.log(testing);
}, 1000);
console.log(testing);
const BlueBanSlot = ['b1', 'b2', 'b3', 'b4', 'b5'];
const RedBanSlot = ['r1', 'r2', 'r3', 'r4', 'r5'];
const BluePickSlot = ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'];
const RedPickSlot = ['rp1', 'rp2', 'rp3', 'rp4', 'rp5', 'rp6', 'rp7', 'rp8'];

let current, current_log;
let current_n = 0;
function check(i) {
    if (logic_BP[i] == "RedBan") {
        console.log("RedBan");
        current = RedBanSlot[r];
        current_n = r;
        current_log = 'ban';
        // document.getElementById(current).style.animation = 'blink2 1s linear infinite';
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

console.log(characters);
characters.forEach(character => {
    character.addEventListener('click', () => {
        console.log(character.alt);
        if (check_selection(character.alt) == true) {
            alert('You cant pick this character');
        }
        else {
            const img = document.createElement('img');
            const file_name = character.alt;
            img.alt = character.alt;
            const removeSpaces = (inputText) => {
                return inputText.replace(/\s/g, "");
            };
            let file = removeSpaces(character.alt);
            check(i);
            switch (current_log) {
                case 'ban':
                    img.src = `../../../../asset/images/selection_character/${file}.webp`;
                    img.style.filter = 'grayscale(1)';
                    const banSlots = document.getElementById(current);
                    banSlots.appendChild(img);
                    i++;
                    character.style.backgroundColor = '#ccc';
                    character.style.filter = 'grayscale(1)';
                    picking_selection(character.alt);
                    document.getElementById(current).style.animation = 'null';
                    ban_sound_play();
                    resetTime();
                    // document.getElementById('.timer').innerHTML = '60';
                    break;
                case 'pick':
                    picking_selection(character.alt);
                    img.src = `../../../../asset/images/character/${file}.webp`;
                    const name = document.createElement('p');
                    name.innerHTML = findFullName(character.alt);
                    const pickSlots = document.getElementById(current);
                    // If an empty slot was found, add the image to it
                    pickSlots.appendChild(img);
                    pickSlots.appendChild(name);
                    i++;
                    character.style.backgroundColor = '#ccc';
                    character.style.filter = 'grayscale(1)';
                    document.getElementById(current).style.animation = 'null';
                    pick_sound_play();
                    resetTime();
                    // document.getElementById('.timer').innerHTML = '60';
                    break;
                case 'stop':
                    console.log('Ban Pick End!!!');
                    break;
            };
            console.log(i);
            blink(i);
        }
    });
});