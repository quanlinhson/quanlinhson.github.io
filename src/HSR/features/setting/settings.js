document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.getElementById('settings-icon');
    const settingsPanel = document.getElementById('settings-panel');
    const saveSettingsButton = document.getElementById('save-settings');
    const layoutSelect = document.getElementById('hud-layout-setting');

    // Load saved layout preference
    if (layoutSelect) {
        layoutSelect.value = localStorage.getItem('hudLayout') || 'classic';
    }

    if (settingsIcon && settingsPanel) {
        settingsIcon.addEventListener('click', () => {
            if (settingsPanel.style.display === 'block') {
                settingsPanel.style.display = 'none';
            } else {
                settingsPanel.style.display = 'block';
            }
        });
    }

    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', () => {
            const selectedLayout = layoutSelect ? layoutSelect.value : 'classic';
            localStorage.setItem('hudLayout', selectedLayout);

            // Collect settings data
            const settingsData = {
                team1Name: document.getElementById('team1-name-input').value,
                team2Name: document.getElementById('team2-name-input').value,
                team1Score: document.getElementById('team1-score-input').value,
                team2Score: document.getElementById('team2-score-input').value,
                banTime: document.getElementById('ban-time-setting').value,
                pickTime: document.getElementById('pick-time-setting').value,
                hudLayout: selectedLayout
            };

            // Send settings data to parent document
            window.parent.postMessage({ settingsData, settingsSaved: true }, '*');

            // Hide settings panel after saving
            const settingsModal = window.parent.document.getElementById('settings-modal');
            if (settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }
});