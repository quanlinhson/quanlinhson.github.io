// Timer

let countdown;

document.addEventListener('DOMContentLoaded', (event) => {
    const countdownElement = document.querySelector('.timer');
    const duration = 60 * 1; // 1 minute
    startCountdown(duration, countdownElement);
});

function startCountdown(duration, display) {
    clearInterval(countdown);
    let timer = duration, minutes, seconds;
    countdown = setInterval(function () {
        seconds = parseInt(timer, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

export function resetTime() {
    const countdownElement = document.querySelector('.timer');
    const duration = 60 * 1; // 1 minute
    startCountdown(duration, countdownElement);
}