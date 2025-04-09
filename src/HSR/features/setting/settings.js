document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.getElementById('settings-icon');
    const settingsPanel = document.getElementById('settings-panel');
    const saveSettingsButton = document.getElementById('save-settings');

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
            // Collect settings data
            const settingsData = {
                team1Name: document.getElementById('team1-name-input').value,
                team2Name: document.getElementById('team2-name-input').value,
                team1Score: document.getElementById('team1-score-input').value,
                team2Score: document.getElementById('team2-score-input').value,
                timeSetting: document.getElementById('time-setting').value
                // banPickTurn: document.getElementById('ban-pick-turn').value
            };

            // Send settings data to parent document
            window.parent.postMessage(settingsData, '*');

            // Hide settings panel after saving
            const settingsPanel = window.parent.document.getElementById('settings-modal');
            if (settingsPanel) {
                settingsPanel.style.display = 'none';
            }
        });
    }
});

// Function to set the timer (example implementation)
function setTimer(seconds) {
    // Your timer logic here
    console.log(`Timer set to ${seconds} seconds`);
}