import { DraftEngine } from "../../../../All/core/draftEngine.js";
import { HSRConfig } from "./hsr-config.js";

export const draftEngine = new DraftEngine(HSRConfig);

document.addEventListener('DOMContentLoaded', () => {
    draftEngine.init();
});

export function chooseCharacter(character) {
    draftEngine.chooseCharacter(character);
}