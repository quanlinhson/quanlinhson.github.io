// Timer

let countdown;

// document.addEventListener('DOMContentLoaded', (event) => {
//     const countdownElement = document.querySelector('.timer');
//     const duration = 60 * 1; // 1 minute
//     startCountdown(duration, countdownElement);
// });

export function startCountdown(duration) {
    const display = document.querySelector('.timer');
    let timer = duration, minutes, seconds;

    if (countdown) {
        clearInterval(countdown);
    }
    countdown = setInterval(function () {
        seconds = parseInt(timer, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = seconds;

        if (--timer < 0) {
            clearInterval(countdown);
            display.textContent = 'Time\'s up!';
        }
    }, 1000);
    //clearInterval(countdown);
}

export function resetTime(duration) {
    startCountdown(duration);
}