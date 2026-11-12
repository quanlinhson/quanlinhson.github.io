document.addEventListener('DOMContentLoaded', () => {
    const team1Input = document.getElementById('team1-name-input');
    const team2Input = document.getElementById('team2-name-input');
    const team1Score = document.getElementById('team1-score-input');
    const team2Score = document.getElementById('team2-score-input');
    const banTimeInput = document.getElementById('ban-time-setting');
    const pickTimeInput = document.getElementById('pick-time-setting');
    const layoutHidden = document.getElementById('hud-layout-setting');
    const layoutButtons = document.querySelectorAll('.layout-btn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const stepButtons = document.querySelectorAll('.step-btn');
    const saveButton = document.getElementById('save-settings');
    const closeButton = document.getElementById('close-settings');
    const resetButton = document.getElementById('reset-settings');

    // 1. Initial Load from localStorage
    const savedLayout = localStorage.getItem('hudLayout') || 'classic';
    setLayout(savedLayout);

    if (localStorage.getItem('team1Name')) team1Input.value = localStorage.getItem('team1Name');
    if (localStorage.getItem('team2Name')) team2Input.value = localStorage.getItem('team2Name');
    if (localStorage.getItem('team1Score') !== null) team1Score.value = localStorage.getItem('team1Score');
    if (localStorage.getItem('team2Score') !== null) team2Score.value = localStorage.getItem('team2Score');
    if (localStorage.getItem('banTime')) banTimeInput.value = localStorage.getItem('banTime');
    if (localStorage.getItem('pickTime')) pickTimeInput.value = localStorage.getItem('pickTime');

    // Sync active preset highlight
    updateActivePreset();

    // 2. Score Steppers (+ / -)
    stepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const dir = parseInt(btn.getAttribute('data-dir'), 10) || 0;
            const input = document.getElementById(targetId);
            if (input) {
                let val = parseInt(input.value, 10) || 0;
                val = Math.max(0, Math.min(99, val + dir));
                input.value = val;
            }
        });
    });

    // 3. Timer Presets
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const ban = btn.getAttribute('data-ban');
            const pick = btn.getAttribute('data-pick');
            if (ban && pick) {
                banTimeInput.value = ban;
                pickTimeInput.value = pick;
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    [banTimeInput, pickTimeInput].forEach(inp => {
        inp.addEventListener('input', updateActivePreset);
    });

    function updateActivePreset() {
        const curBan = banTimeInput.value;
        const curPick = pickTimeInput.value;
        presetButtons.forEach(b => {
            if (b.getAttribute('data-ban') === curBan && b.getAttribute('data-pick') === curPick) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }

    // 4. Layout Mode Toggle
    function setLayout(mode) {
        layoutHidden.value = mode;
        layoutButtons.forEach(btn => {
            if (btn.getAttribute('data-value') === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    layoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-value');
            setLayout(mode);
        });
    });

    // 5. Reset Defaults
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            team1Input.value = 'Team 1';
            team2Input.value = 'Team 2';
            team1Score.value = '0';
            team2Score.value = '0';
            banTimeInput.value = '30';
            pickTimeInput.value = '60';
            setLayout('classic');
            updateActivePreset();
        });
    }

    // 6. Close Settings
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            window.parent.postMessage({ closeSettings: true }, '*');
        });
    }

    // 7. Save Settings
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const selectedLayout = layoutHidden.value || 'classic';
            const t1Name = team1Input.value.trim() || 'Team 1';
            const t2Name = team2Input.value.trim() || 'Team 2';
            const t1Score = Math.max(0, parseInt(team1Score.value, 10) || 0);
            const t2Score = Math.max(0, parseInt(team2Score.value, 10) || 0);
            const banTime = Math.max(5, parseInt(banTimeInput.value, 10) || 30);
            const pickTime = Math.max(5, parseInt(pickTimeInput.value, 10) || 60);

            // Persist to localStorage
            localStorage.setItem('team1Name', t1Name);
            localStorage.setItem('team2Name', t2Name);
            localStorage.setItem('team1Score', t1Score);
            localStorage.setItem('team2Score', t2Score);
            localStorage.setItem('banTime', banTime);
            localStorage.setItem('pickTime', pickTime);
            localStorage.setItem('hudLayout', selectedLayout);

            const settingsData = {
                team1Name: t1Name,
                team2Name: t2Name,
                team1Score: t1Score,
                team2Score: t2Score,
                banTime: banTime,
                pickTime: pickTime,
                hudLayout: selectedLayout
            };

            // Post to parent window
            window.parent.postMessage({ settingsData, settingsSaved: true }, '*');

            // Hide parent modal
            const settingsModal = window.parent.document.getElementById('settings-modal');
            if (settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    // 8. Listen for live prefill from parent window
    window.addEventListener('message', (event) => {
        if (event.data?.type === 'INIT_SETTINGS' && event.data.data) {
            const d = event.data.data;
            if (d.team1Name) team1Input.value = d.team1Name;
            if (d.team2Name) team2Input.value = d.team2Name;
            if (d.team1Score !== undefined) team1Score.value = d.team1Score;
            if (d.team2Score !== undefined) team2Score.value = d.team2Score;
            if (d.banTime) banTimeInput.value = d.banTime;
            if (d.pickTime) pickTimeInput.value = d.pickTime;
            if (d.hudLayout) setLayout(d.hudLayout);
            updateActivePreset();
        }
    });
});
