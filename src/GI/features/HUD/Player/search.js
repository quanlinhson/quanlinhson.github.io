import { FilterEngine } from "../../../../All/core/filterEngine.js";
import { GIConfig } from "./gi-config.js";
import { chooseCharacter } from "./code.js";

export const filterEngine = new FilterEngine(GIConfig, chooseCharacter);

document.addEventListener('DOMContentLoaded', () => {
    filterEngine.init();
});