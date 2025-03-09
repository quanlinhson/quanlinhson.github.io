import { HSRCharacter } from "../../../database/character.js";
import { logic_BP } from "../../../database/logic_bp.js";
import { resetTime } from "./time.js";

function ban_sound_play() {
    var audio = document.getElementById("ban-sound");
    audio.play();
}

function pick_sound_play() {
    var audio = document.getElementById("pick-sound");
    audio.play();
}

// var audio_bp = document.getElementById("bp-sound");
// audio_bp.play();
// audio_bp.loop = true;

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

// Attempt to play background music immediately
playBackgroundMusic();

// const characterSelection = document.querySelector('.character-list');
// const ul = document.createElement('ul');

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
                const listImg = document.querySelector(`.character-list img[alt="${character.name.toLowerCase()}"]`);
                listImg.style.backgroundColor = '#ccc';
                listImg.style.filter = 'grayscale(1)';
                picking_selection(character.name);
                document.getElementById(current).style.animation = 'null';
                ban_sound_play();
                resetTime();
                // document.getElementById('.timer').innerHTML = '60';
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
                const listImgPick = document.querySelector(`.character-list img[alt="${character.name.toLowerCase()}"]`);
                if (listImgPick) {
                    listImgPick.style.filter = 'grayscale(1)';
                    listImgPick.style.backgroundColor = '#ccc';
                }
                // character.style.backgroundColor = '#ccc';
                // character.style.filter = 'grayscale(1)';
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
}
// function chooseCharacter(characters) {
//     characters.forEach(character => {
//         character.addEventListener('click', () => {
//             console.log(character.alt);
//             if (check_selection(character.alt) == true) {
//                 alert('You cant pick this character');
//             }
//             else {
//                 const img = document.createElement('img');
//                 const file_name = character.alt;
//                 img.alt = character.alt;
//                 const removeSpaces = (inputText) => {
//                     return inputText.replace(/\s/g, "");
//                 };
//                 let file = removeSpaces(character.alt);
//                 check(i);
//                 switch (current_log) {
//                     case 'ban':
//                         img.src = `../../../../asset/images/selection_character/${file}.webp`;
//                         img.style.filter = 'grayscale(1)';
//                         const banSlots = document.getElementById(current);
//                         banSlots.appendChild(img);
//                         i++;
//                         character.style.backgroundColor = '#ccc';
//                         character.style.filter = 'grayscale(1)';
//                         picking_selection(character.alt);
//                         document.getElementById(current).style.animation = 'null';
//                         ban_sound_play();
//                         resetTime();
//                         // document.getElementById('.timer').innerHTML = '60';
//                         break;
//                     case 'pick':
//                         picking_selection(character.alt);
//                         img.src = `../../../../asset/images/character/${file}.webp`;
//                         const name = document.createElement('p');
//                         name.innerHTML = findFullName(character.alt);
//                         const pickSlots = document.getElementById(current);
//                         // If an empty slot was found, add the image to it
//                         pickSlots.appendChild(img);
//                         pickSlots.appendChild(name);
//                         i++;
//                         character.style.backgroundColor = '#ccc';
//                         character.style.filter = 'grayscale(1)';
//                         document.getElementById(current).style.animation = 'null';
//                         pick_sound_play();
//                         resetTime();
//                         // document.getElementById('.timer').innerHTML = '60';
//                         break;
//                     case 'stop':
//                         console.log('Ban Pick End!!!');
//                         break;
//                 };
//                 console.log(i);
//                 blink(i);
//             }
//         });
//     });
// }