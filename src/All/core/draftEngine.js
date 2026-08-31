import { startCountdown, stopCountdown } from "../tools/time.js";

export class DraftEngine {
    constructor(config) {
        this.config = config;

        // Turn & Phase counters
        this.i = 1;
        this.l = 0;
        this.r = 0;
        this.lp = 0;
        this.rp = 0;
        this.current = null;
        this.current_log = null;
        this.current_n = 0;

        // State variables
        this.tempSelectedCharacter = null;
        this.isBanPickFinished = false;
        this.isSettingsSaved = false;

        // Time settings
        this.banTimeSetting = 30;
        this.pickTimeSetting = 60;
        this.isBanTimeSet = false;
        this.isPickTimeSet = false;

        // Team info
        this.globalTeam1 = "Team 1";
        this.globalTeam2 = "Team 2";

        // Element references
        this.confirmBtn = null;
    }

    init() {
        this.renderBanSlots();
        this.renderPickSlots();

        this.confirmBtn = document.getElementById('confirm');
        if (this.confirmBtn) {
            this.confirmBtn.disabled = true;
            this.confirmBtn.addEventListener('click', () => this.handleConfirmClick());
        }

        this.bindSettingsModal();
        this.bindSettingsMessage();
        this.bindVolumeControls();
    }

    renderBanSlots() {
        const leftContainer = document.querySelector('.ban-slot-left');
        const rightContainer = document.querySelector('.ban-slot-right');
        if (!leftContainer || !rightContainer || !this.config.slots) return;

        if (leftContainer.children.length === 0 && this.config.slots.blueBan) {
            this.config.slots.blueBan.forEach((slotId) => {
                const slot = document.createElement('div');
                slot.className = 'ban-slot';
                slot.id = slotId;
                leftContainer.appendChild(slot);

                const line = document.createElement('div');
                line.className = 'verticalLine';
                leftContainer.appendChild(line);
            });
        }

        if (rightContainer.children.length === 0 && this.config.slots.redBan) {
            this.config.slots.redBan.forEach((slotId) => {
                const slot = document.createElement('div');
                slot.className = 'ban-slot';
                slot.id = slotId;
                rightContainer.appendChild(slot);

                const line = document.createElement('div');
                line.className = 'verticalLine';
                rightContainer.appendChild(line);
            });
        }
    }

    renderPickSlots() {
        const leftContainer = document.querySelector('.pick-slot-left');
        const rightContainer = document.querySelector('.pick-slot-right');
        if (!leftContainer || !rightContainer || !this.config.slots) return;

        if (leftContainer.children.length === 0 && this.config.slots.bluePick) {
            this.config.slots.bluePick.forEach(slotId => {
                const slot = document.createElement('div');
                slot.className = 'pick-slot';
                slot.id = slotId;
                leftContainer.appendChild(slot);
            });
        }

        if (rightContainer.children.length === 0 && this.config.slots.redPick) {
            this.config.slots.redPick.forEach(slotId => {
                const slot = document.createElement('div');
                slot.className = 'pick-slot';
                slot.id = slotId;
                rightContainer.appendChild(slot);
            });
        }
    }

    ban_sound_play() {
        const audio = document.getElementById("ban-sound");
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }

    pick_sound_play() {
        const audio = document.getElementById("pick-sound");
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }

    playBackgroundMusic() {
        const audio_bp = document.getElementById("bp-sound");
        if (!audio_bp) return;
        audio_bp.loop = true;
        audio_bp.play().catch(() => {
            document.addEventListener('click', () => {
                audio_bp.play().catch(() => {});
            }, { once: true });
        });
    }

    check_selection(identifier) {
        const char = this.config.characters.find(c =>
            this.config.getCharacterIdentifier(c).toLowerCase() === identifier.toLowerCase()
        );
        return char ? char.selected : false;
    }

    picking_selection(identifier) {
        const char = this.config.characters.find(c =>
            this.config.getCharacterIdentifier(c).toLowerCase() === identifier.toLowerCase()
        );
        if (char) {
            char.selected = true;
        }
    }

    updateTeamTurn(i) {
        const team1Element = document.getElementById('team1-name');
        const team2Element = document.getElementById('team2-name');
        if (!team1Element || !team2Element) return;

        const team1Container = team1Element.closest('.roomTeamName');
        const team2Container = team2Element.closest('.roomTeamName');

        if (team1Container) team1Container.classList.remove('turn');
        if (team2Container) team2Container.classList.remove('turn');
        team1Element.textContent = this.globalTeam1;
        team2Element.textContent = this.globalTeam2;

        const phase = this.config.logicBP[i];
        if (phase === "RedBan") {
            team2Element.textContent = `${this.globalTeam2}'s BANNING...`;
            if (team2Container) team2Container.classList.add('turn');
        } else if (phase === "BlueBan") {
            team1Element.textContent = `${this.globalTeam1}'s BANNING...`;
            if (team1Container) team1Container.classList.add('turn');
        } else if (phase === "BluePick") {
            team1Element.textContent = `${this.globalTeam1}'s PICKING...`;
            if (team1Container) team1Container.classList.add('turn');
        } else if (phase === "RedPick") {
            team2Element.textContent = `${this.globalTeam2}'s PICKING...`;
            if (team2Container) team2Container.classList.add('turn');
        }
    }

    handleNoBan(slotId) {
        const slot = document.getElementById(slotId);
        if (!slot) return;
        slot.innerHTML = '';
        slot.classList.remove('active', 'blue-blink', 'red-blink');
        slot.classList.add('filled');
        const noBanDiv = document.createElement('div');
        noBanDiv.className = 'no-ban-icon';
        noBanDiv.title = 'No Ban';
        const iconUrl = this.config.noBanIconUrl || '../../../../All/asset/icons/normal/no_ban.svg';
        noBanDiv.style.backgroundImage = `url("${iconUrl}")`;
        slot.appendChild(noBanDiv);
    }

    getTeamSlotsByCurrent() {
        if (this.current_log !== 'pick') return [];
        if (this.config.slots.bluePick.includes(this.current)) return this.config.slots.bluePick;
        if (this.config.slots.redPick.includes(this.current)) return this.config.slots.redPick;
        return [];
    }

    getValidRandomCharacter() {
        const teamSlots = this.getTeamSlotsByCurrent();
        const validCharacters = this.config.characters.filter(char => {
            if (char.selected) return false;
            if (this.config.checkGroupConflict && this.config.checkGroupConflict(char, teamSlots, this.current)) {
                return false;
            }
            return true;
        });
        if (validCharacters.length === 0) return null;
        const idx = Math.floor(Math.random() * validCharacters.length);
        return validCharacters[idx];
    }

    handleCharacterPick(character, slotId) {
        const identifier = this.config.getCharacterIdentifier(character);
        this.picking_selection(identifier);
        this.updateSlotUI(slotId, character);
        this.setSlotSelected(slotId);

        if (this.current_log === 'ban') {
            const slot = document.getElementById(this.current);
            if (slot) {
                const img = slot.querySelector('img');
                if (img) img.classList.add('grayscaled');
            }
        }

        const listImgPick = document.querySelector(`.character-list img[alt="${identifier.toLowerCase()}"]`);
        if (listImgPick) {
            listImgPick.style.filter = 'grayscale(1)';
            listImgPick.style.backgroundColor = '#ccc';
        }
    }

    setSlotSelected(slotId) {
        const slot = document.getElementById(slotId);
        if (slot) {
            slot.classList.remove('active', 'blue-blink', 'red-blink');
            slot.classList.add('selected');
            setTimeout(() => slot.classList.remove('selected'), 600);
        }
    }

    showAlert(message) {
        const alertElement = document.getElementById('duplicate-alert');
        if (!alertElement) return;
        alertElement.style.display = 'block';
        alertElement.textContent = message;
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 2000);
    }

    chooseCharacter(character) {
        if (this.isBanPickFinished) return;

        // Group conflict check (e.g. alternate forms of same character in same team)
        if (this.config.checkGroupConflict) {
            const teamSlots = this.getTeamSlotsByCurrent();
            if (this.config.checkGroupConflict(character, teamSlots, this.current)) {
                this.showAlert("You can't choose this character again!");
                return;
            }
        }

        // Selected check
        const identifier = this.config.getCharacterIdentifier(character);
        if (this.check_selection(identifier)) {
            this.showAlert("You can't choose this character again!");
            return;
        }

        this.tempSelectedCharacter = character;
        this.updateSlotUI(this.current, character);

        if (this.confirmBtn) {
            this.confirmBtn.disabled = false;
        }
    }

    updateSlotUI(slotId, character) {
        const slot = document.getElementById(slotId);
        if (!slot) return;
        slot.innerHTML = '';
        slot.classList.add('filled');

        if (this.current_log === 'ban') {
            this.config.renderBanSlot(character, slot);
        } else if (this.current_log === 'pick') {
            this.config.renderPickSlot(character, slot);
        }
    }

    handleBanPickEnd() {
        const timer = document.querySelector('.timer');
        if (timer) timer.textContent = 'Ended';
        stopCountdown();

        if (this.confirmBtn) this.confirmBtn.disabled = true;
        this.isBanPickFinished = true;
        this.tempSelectedCharacter = null;

        const team1Element = document.getElementById('team1-name');
        const team2Element = document.getElementById('team2-name');
        if (team1Element) team1Element.textContent = this.globalTeam1;
        if (team2Element) team2Element.textContent = this.globalTeam2;

        this.hideBanPickUI();
    }

    hideBanPickUI() {
        document.querySelector('.character-filter')?.classList.add('hide-banpick-ui');
        document.querySelector('.character-list')?.classList.add('hide-banpick-ui');
        if (this.confirmBtn) {
            this.confirmBtn.classList.add('hide-banpick-ui');
            this.confirmBtn.style.display = 'none';
        }
    }

    check() {
        const phase = this.config.logicBP[this.i];
        if (phase === "RedBan") {
            this.current = this.config.slots.redBan[this.r];
            this.current_n = this.r;
            this.current_log = 'ban';
        } else if (phase === "BlueBan") {
            this.current = this.config.slots.blueBan[this.l];
            this.current_n = this.l;
            this.current_log = 'ban';
        } else if (phase === "BluePick") {
            this.current = this.config.slots.bluePick[this.lp];
            this.current_n = this.lp;
            this.current_log = 'pick';
        } else if (phase === "RedPick") {
            this.current = this.config.slots.redPick[this.rp];
            this.current_n = this.rp;
            this.current_log = 'pick';
        } else {
            this.current_log = 'stop';
        }
    }

    begin() {
        if (!this.isSettingsSaved) return;

        if (this.i >= this.config.maxSteps) {
            this.handleBanPickEnd();
            return;
        }

        const phase = this.config.logicBP[this.i];
        let slot;

        if (phase === "RedBan") {
            this.current = this.config.slots.redBan[this.r];
            this.current_n = this.r;
            this.current_log = 'ban';
            slot = document.getElementById(this.current);
            if (slot) slot.classList.add('active', 'red-blink');

            startCountdown(this.banTimeSetting, () => {
                if (this.i >= this.config.maxSteps) return;
                this.handleNoBan(this.current);
                if (slot) slot.classList.remove('active', 'red-blink');
                this.r++;
                this.i++;
                this.ban_sound_play();
                this.check();
                this.begin();
                if (this.confirmBtn) this.confirmBtn.disabled = true;
            });
            this.updateTeamTurn(this.i);
        } else if (phase === "BlueBan") {
            this.current = this.config.slots.blueBan[this.l];
            this.current_n = this.l;
            this.current_log = 'ban';
            slot = document.getElementById(this.current);
            if (slot) slot.classList.add('active', 'blue-blink');

            startCountdown(this.banTimeSetting, () => {
                if (this.i >= this.config.maxSteps) return;
                this.handleNoBan(this.current);
                if (slot) slot.classList.remove('active', 'blue-blink');
                this.l++;
                this.i++;
                this.ban_sound_play();
                this.check();
                this.begin();
                if (this.confirmBtn) this.confirmBtn.disabled = true;
            });
            this.updateTeamTurn(this.i);
        } else if (phase === "BluePick") {
            this.current = this.config.slots.bluePick[this.lp];
            this.current_n = this.lp;
            this.current_log = 'pick';
            slot = document.getElementById(this.current);
            if (slot) slot.classList.add('active', 'blue-blink');

            startCountdown(this.pickTimeSetting, () => {
                if (this.i >= this.config.maxSteps) return;
                if (this.tempSelectedCharacter) {
                    this.handleCharacterPick(this.tempSelectedCharacter, this.current);
                    this.pick_sound_play();
                } else {
                    const randomChar = this.getValidRandomCharacter();
                    if (randomChar) {
                        this.tempSelectedCharacter = randomChar;
                        this.handleCharacterPick(randomChar, this.current);
                        this.pick_sound_play();
                    }
                }
                this.lp++;
                this.i++;
                if (this.i >= this.config.maxSteps) {
                    this.handleBanPickEnd();
                    return;
                }
                this.check();
                this.begin();
                if (this.confirmBtn) this.confirmBtn.disabled = true;
                this.tempSelectedCharacter = null;
            });
            this.updateTeamTurn(this.i);
        } else if (phase === "RedPick") {
            this.current = this.config.slots.redPick[this.rp];
            this.current_n = this.rp;
            this.current_log = 'pick';
            slot = document.getElementById(this.current);
            if (slot) slot.classList.add('active', 'red-blink');

            startCountdown(this.pickTimeSetting, () => {
                if (this.i >= this.config.maxSteps) return;
                if (this.tempSelectedCharacter) {
                    this.handleCharacterPick(this.tempSelectedCharacter, this.current);
                    this.pick_sound_play();
                } else {
                    const randomChar = this.getValidRandomCharacter();
                    if (randomChar) {
                        this.tempSelectedCharacter = randomChar;
                        this.handleCharacterPick(randomChar, this.current);
                        this.pick_sound_play();
                    }
                }
                this.rp++;
                this.i++;
                if (this.i >= this.config.maxSteps) {
                    this.handleBanPickEnd();
                    return;
                }
                this.check();
                this.begin();
                if (this.confirmBtn) this.confirmBtn.disabled = true;
                this.tempSelectedCharacter = null;
            });
            this.updateTeamTurn(this.i);
        } else {
            this.current_log = 'stop';
        }
    }

    handleConfirmClick() {
        if (!this.tempSelectedCharacter) return;

        this.handleCharacterPick(this.tempSelectedCharacter, this.current);

        if (this.current_log === 'ban') this.ban_sound_play();
        else if (this.current_log === 'pick') this.pick_sound_play();

        const phase = this.config.logicBP[this.i];
        if (phase === "RedBan") this.r++;
        else if (phase === "BlueBan") this.l++;
        else if (phase === "BluePick") this.lp++;
        else if (phase === "RedPick") this.rp++;

        this.i++;
        if (this.i >= this.config.maxSteps) {
            this.handleBanPickEnd();
            return;
        }

        this.check();
        this.begin();

        this.tempSelectedCharacter = null;
        if (this.confirmBtn) this.confirmBtn.disabled = true;
    }

    bindSettingsModal() {
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
    }

    bindSettingsMessage() {
        const characterFilter = document.querySelector('.character-filter');
        const characterList = document.querySelector('.character-list');
        const confirmButton = document.getElementById('confirm');

        window.addEventListener('message', (event) => {
            const { settingsData, settingsSaved } = event.data || {};

            if (settingsSaved && settingsData) {
                this.isSettingsSaved = true;

                // Update team names
                if (settingsData.team1Name) {
                    this.globalTeam1 = settingsData.team1Name;
                    const el = document.getElementById('team1-name');
                    if (el) el.textContent = settingsData.team1Name;
                }
                if (settingsData.team2Name) {
                    this.globalTeam2 = settingsData.team2Name;
                    const el = document.getElementById('team2-name');
                    if (el) el.textContent = settingsData.team2Name;
                }

                // Update team scores
                if (settingsData.team1Score !== undefined) {
                    const el = document.getElementById('team1-score');
                    if (el) el.textContent = settingsData.team1Score;
                }
                if (settingsData.team2Score !== undefined) {
                    const el = document.getElementById('team2-score');
                    if (el) el.textContent = settingsData.team2Score;
                }

                // Update timer values
                if (settingsData.banTime && !this.isBanTimeSet) {
                    this.banTimeSetting = parseInt(settingsData.banTime, 10);
                    this.isBanTimeSet = true;
                }
                if (settingsData.pickTime && !this.isPickTimeSet) {
                    this.pickTimeSetting = parseInt(settingsData.pickTime, 10);
                    this.isPickTimeSet = true;
                }

                // Update sound volume
                if (settingsData.volume !== undefined) {
                    const vol = settingsData.volume / 100;
                    const bpSound = document.getElementById('bp-sound');
                    const banSound = document.getElementById('ban-sound');
                    const pickSound = document.getElementById('pick-sound');
                    if (bpSound) bpSound.volume = vol;
                    if (banSound) banSound.volume = vol;
                    if (pickSound) pickSound.volume = vol;
                }

                if (characterFilter) characterFilter.style.pointerEvents = 'auto';
                if (characterList) characterList.style.pointerEvents = 'auto';
                if (confirmButton) confirmButton.style.pointerEvents = 'auto';

                this.playBackgroundMusic();
                this.begin();
            }
        });
    }

    bindVolumeControls() {
        const volumeDropdown = document.getElementById('volume-dropdown');
        const volumeControl = document.getElementById('volume-control');
        const bpVolumeRange = document.getElementById('bp-volume-range');
        const banVolumeRange = document.getElementById('ban-volume-range');
        const pickVolumeRange = document.getElementById('pick-volume-range');
        const bpSound = document.getElementById('bp-sound');
        const banSound = document.getElementById('ban-sound');
        const pickSound = document.getElementById('pick-sound');

        if (volumeDropdown && volumeControl) {
            volumeDropdown.addEventListener('click', () => {
                volumeControl.style.display = (volumeControl.style.display === 'block') ? 'none' : 'block';
            });
        }

        if (bpVolumeRange && bpSound) {
            bpVolumeRange.addEventListener('input', () => {
                bpSound.volume = bpVolumeRange.value / 100;
            });
        }

        if (banVolumeRange && banSound) {
            banVolumeRange.addEventListener('input', () => {
                banSound.volume = banVolumeRange.value / 100;
            });
        }

        if (pickVolumeRange && pickSound) {
            pickVolumeRange.addEventListener('input', () => {
                pickSound.volume = pickVolumeRange.value / 100;
            });
        }
    }
}

