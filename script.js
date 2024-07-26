let timer;
let isRunning = false;
let minutes = 25;
let seconds = 0;
let totalPomodoroCycles;
let currentCycle = 0;
let inBreak = false;

const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const quoteDisplay = document.getElementById('quote');
const totalTimeInput = document.getElementById('totalTime');

const localQuotes = [
    "Keep going, you're doing great!",
    "Focus on your goals!",
    "Every step counts!",
    "Believe in yourself!",
    "Make every minute count!"
];

async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error fetching quote:', error);
        return localQuotes[Math.floor(Math.random() * localQuotes.length)];
    }
}

function startTimer() {
    if (isRunning) return;

    const totalTime = parseFloat(totalTimeInput.value);
    if (isNaN(totalTime) || totalTime <= 0) {
        alert("Please enter a valid total time in hours.");
        return;
    }

    totalPomodoroCycles = Math.floor((totalTime * 60) / 30);
    currentCycle = 0;
    inBreak = false;
    minutes = 25;
    seconds = 0;
    updateDisplay();
    isRunning = true;

    timer = setInterval(async () => {
        if (seconds === 0) {
            if (minutes === 0) {
                if (inBreak) {
                    currentCycle++;
                    if (currentCycle < totalPomodoroCycles) {
                        inBreak = false;
                        minutes = 25;
                        quoteDisplay.innerText = '';
                    } else {
                        clearInterval(timer);
                        isRunning = false;
                        alert("Pomodoro session completed!");
                        return;
                    }
                } else {
                    inBreak = true;
                    minutes = 5;
                    const quote = await fetchQuote();
                    showQuote(quote);
                    showBreakNotification();
                }
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    minutes = 25;
    seconds = 0;
    updateDisplay();
    quoteDisplay.innerText = '';
}

function updateDisplay() {
    minutesDisplay.innerText = String(minutes).padStart(2, '0');
    secondsDisplay.innerText = String(seconds).padStart(2, '0');
}

function showQuote(quote) {
    quoteDisplay.innerText = quote;
}

function showBreakNotification() {
    if (Notification.permission === "granted") {
        new Notification("Break Time!", {
            body: "Take a 5-minute break. Here's a motivational quote for you!",
            icon: "break_icon.png" // Optional: add an icon for the notification
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Break Time!", {
                    body: "Take a 5-minute break. Here's a motivational quote for you!",
                    icon: "break_icon.png"
                });
            }
        });
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
