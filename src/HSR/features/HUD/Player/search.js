import { FilterEngine } from "../../../../All/core/filterEngine.js";
import { HSRConfig } from "./hsr-config.js";
import { chooseCharacter } from "./code.js";

export const filterEngine = new FilterEngine(HSRConfig, chooseCharacter);

document.addEventListener('DOMContentLoaded', () => {
    filterEngine.init();
});