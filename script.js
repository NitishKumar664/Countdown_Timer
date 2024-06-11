let audio;
let interval;
let isPaused = false;
let targetDateTime;
let duration;

const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const cancelButton = document.getElementById('cancel-button');
const themeSelect = document.getElementById('theme-select');

startButton.addEventListener('click', startCountdown);
pauseButton.addEventListener('click', pauseResumeHandler);
resetButton.addEventListener('click', resetCountdown);
cancelButton.addEventListener('click', cancelCountdown);
themeSelect.addEventListener('change', changeTheme);

function startCountdown() {
    const targetDateInput = document.getElementById('target-date').value;
    const targetTimeInput = document.getElementById('target-time').value;
    const music = document.getElementById('music-select').value;

    if (!targetDateInput || !targetTimeInput) {
        alert('Please enter both the target date and time.');
        return;
    }

    document.querySelector('.setup-slide').style.display = 'none';
    document.querySelector('.countdown-slide').style.display = 'block';

    targetDateTime = new Date(`${targetDateInput}T${targetTimeInput}`).getTime();
    duration = targetDateTime - new Date().getTime();

    if (music) {
        if (!audio || audio.src !== music) {
            audio = new Audio(music);
        }
        audio.loop = true;
        audio.play();
    }

    isPaused = false;
    pauseButton.textContent = 'Pause';
    startInterval();
}

function startInterval() {
    interval = setInterval(() => {
        const now = new Date().getTime();
        const timeRemaining = targetDateTime - now;

        if (timeRemaining < 0) {
            clearInterval(interval);
            document.querySelector('.countdown').innerHTML = '<h2>Time is up!</h2>';
            if (audio) audio.pause();
            return;
        }

        updateTimeDisplay(timeRemaining);
        updateProgressBar(timeRemaining);
    }, 1000);
}

function updateTimeDisplay(timeRemaining) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function updateProgressBar(timeRemaining) {
    const progressBar = document.querySelector('.progress-bar .progress');
    const progressPercentage = ((duration - timeRemaining) / duration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function pauseResumeHandler() {
    if (isPaused) {
        startInterval();
        if (audio) audio.play();
        pauseButton.textContent = 'Pause';
    } else {
        clearInterval(interval);
        if (audio) audio.pause();
        pauseButton.textContent = 'Resume';
    }
    isPaused = !isPaused;
}

function resetCountdown() {
    clearInterval(interval);
    document.querySelector('.countdown').innerHTML = `
        <div class="circle">
            <div class="time-unit">
                <span id="days" class="time-value">00</span>
                <span>:</span>
                <span id="days-label" class="unit-label">Days</span>
            </div>
            <div class="time-unit">
                <span id="hours" class="time-value">00</span>
                <span>:</span>
                <span id="hours-label" class="unit-label">Hours</span>
            </div>
            <div class="time-unit">
                <span id="minutes" class="time-value">00</span>
                <span>:</span>
                <span id="minutes-label" class="unit-label">Minutes</span>
            </div>
            <div class="time-unit">
                <span id="seconds" class="time-value">00</span>
                <span id="seconds-label" class="unit-label">Seconds</span>
            </div>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress"></div>
        </div>
    `;

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    document.getElementById('target-date').value = '';
    document.getElementById('target-time').value = '';
    document.getElementById('music-select').value = '';
    document.querySelector('.setup-slide').style.display = 'block';
    document.querySelector('.countdown-slide').style.display = 'none';

    isPaused = false;
    pauseButton.textContent = 'Pause';
}

function cancelCountdown() {
    clearInterval(interval);
    document.querySelector('.countdown-slide').style.display = 'none';
    document.querySelector('.setup-slide').style.display = 'block';

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    isPaused = false;
    pauseButton.textContent = 'Pause';
}

function changeTheme() {
    const theme = themeSelect.value;
    document.body.className = theme;
}

// backspace key to cancel the countdown
document.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace') {
        cancelButton.click();
    }
});

//  space key to pause/resume the countdown
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        pauseButton.click();
    }
});

