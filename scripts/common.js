export const options = {
    version: "1.11",
    APIDBHostTasks: "https://chrometimertasks-879e.restdb.io/rest/chrome-timer-tasks",
    APIDBHostPauses: "https://chrometimertasks-879e.restdb.io/rest/task-pause",
    APIQuoteOfTheDayApiHost: "https://api.quotable.io/quotes/random",
    greetingNameFontSizePixels: 70,
    whatShallWeWorkOnQuestionText: "What is our focus now?",
    imageApiKey: "SidraH8wDMI92Y_bXxn2Tg1PLJWt24RI310YYUHJ1xY",
    imageApiQuery: "https://api.unsplash.com/photos/random?query=",
    language: window.navigator.userLanguage || window.navigator.language || "en",
    user:null
};

export const settings = {};

export function $e(id) {
    return document.getElementById(id);
}

export function $html(id, text) {
    const elent = $e(id);
    if (elent) {
        if (elent.nodeName === "DIV") {
            if (elent.innerHTML != text) {
                elent.innerHTML = text;
            }
        } else if (elent.nodeName === "BUTTON") {
            if (elent.value != text) {
                elent.value = text;
            }
        }
    }
}

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isPositiveInteger(n) {
    return n >>> 0 === parseFloat(n);
}

export function getElapsedTime(startTime, endTime) {
    if (!startTime) return "";
    if (!endTime) return "";
    const elapsedSecs = (endTime - startTime) / 1000;
    let hours = Math.floor(elapsedSecs / 3600);
    let minutes = Math.floor((elapsedSecs - hours * 3600) / 60);
    let seconds = Math.round(elapsedSecs - hours * 3600 - minutes * 60, 0);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
}
