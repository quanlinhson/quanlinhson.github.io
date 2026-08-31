import { DraftEngine } from "../../../../All/core/draftEngine.js";
import { GIConfig } from "./gi-config.js";

export const draftEngine = new DraftEngine(GIConfig);

document.addEventListener('DOMContentLoaded', () => {
    draftEngine.init();
});

export function chooseCharacter(character) {
    draftEngine.chooseCharacter(character);
}