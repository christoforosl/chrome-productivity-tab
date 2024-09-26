import {$html} from './common.js';

export function hideItem(id) {
    $("#" + id).addClass("invisible");
    $("#" + id).css("display", "none");
}

export function showItem(id) {
    $("#" + id).removeClass("invisible");
    $("#" + id).css("display", "block");
}

export function noFocusTimerUI() {
    if (window.jQuery) {
        hideItem("divFocus");
        hideItem("divEndTimer");
        showItem("divAskAndSetGreeting");
        document.title = "Solid Focus";
    }
}

export function setNotPausedTimerUI(timerRecord) {
    $html("currentFocus", "[" + timerRecord.focusTaskName + "]");
    $("#btnPauseFocusTimer").value = "Pause";
    $("#btnPauseFocusTimer").title = "Pause Current Focus Timer";
}

export function setPausedTimerUI(timerRecord) {
    $html("currentFocus", "[" + timerRecord.focusTaskName + " PAUSED ]");
    $("#btnPauseFocusTimer").value = "Continue";
    $("#btnPauseFocusTimer").title = "Continue Task Timer";
}

export function withFocusTimerUI() {
    if (window.jQuery) {
        showItem("divFocus");
        showItem("divEndTimer");
        hideItem("divAskAndSetGreeting");
    }
}
