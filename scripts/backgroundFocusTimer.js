/* jshint esversion: 6 */

import { options, $e, $html } from './common.js';
import { initializeEventHandlers, operateEvents } from './eventHandling.js';
import {noFocusTimerUI} from './pageUI.js';

const focusTimerVars = {};

const DB_API_HEADERS = new Headers({
    Accept: "application/json",
    "content-type": "application/json",
    "x-apikey": "602510f75ad3610fb5bb5ec5"
});

export const setCurrentFocusAndStartTimer = function () {
    $e("frmEnterTaskName").classList.add("was-validated");
    if ($e("frmEnterTaskName").checkValidity() === false) {
        return;
    }

    let dnowWithSecs = new Date();
    dnowWithSecs = new Date(dnowWithSecs.setSeconds(0, 0));
    const dnow = dnowWithSecs.getTime();

    const record = {
        user: localStorage.getItem("userInfo"),
        startTime: $("#taskStartDateTime").val() ? new Date($("#taskStartDateTime").val()).getTime() : dnow,
        focusTaskName: $("#taskName").val()
    };

    const myRequest = new Request(options.APIDBHostTasks, {
        method: "POST",
        headers: DB_API_HEADERS,
        mode: "cors",
        cache: "no-cache",
        body: JSON.stringify(record)
    });

    fetch(myRequest)
        .then((response) => response.json())
        .then((contents) => {
            record.timerId = contents._id;
            startFocusTimer(record);
        });
    $html("currentFocus", "[" + record.focusTaskName + "]");
    $("#workItemModal").modal("hide");
};

export const startFocusTimer = function (record) {
    if (focusTimerVars.focusTimerClientId) {
        console.log("clear existing timer: " + focusTimerVars.focusTimerClientId);
        clearInterval(focusTimerVars.focusTimerClientId);
        focusTimerVars.focusTimerClientId = null;
    }

    localStorage.setItem("focusTimer", JSON.stringify(record));
    console.log("Start Timer set to " + record.startTime + ", server timerId: " + record.timerId);

    withFocusTimerUI();
    focusTimerVars.focusTimerClientId = setInterval(updateFocusTimer, 1000);
};

export const checkForActiveFocusTimer = function () {
    const timerRecord = getTimerRecordFromStorage();

    if (timerRecord) {
        const myRequest = new Request(options.APIDBHostTasks + "/" + timerRecord.timerId, {
            method: "GET",
            headers: DB_API_HEADERS
        });

        fetch(myRequest)
            .then((response) => response.json())
            .then((contents) => {
                if (contents.endTime) {
                    localStorage.removeItem("focusTimer");
                    noFocusTimerUI();
                } else {
                    $html("currentFocus", "[" + timerRecord.focusTaskName + "]");
                    focusTimerVars.focusTimerClientId = setInterval(updateFocusTimer, 1000);
                    withFocusTimerUI();
                }
            });
    } else {
        noFocusTimerUI();
    }
};

export const togglePauseStatus = function () {
    const timerRecord = getTimerRecordFromStorage();
    if (!timerRecord) {
        return;
    }
    let dnowWithSecs = new Date();
    dnowWithSecs = new Date(dnowWithSecs.setSeconds(0, 0));
    const dnow = dnowWithSecs.getTime();

    if (timerRecord.status === "PAUSED") {
        const pauseRecord = getRecordFromStorage("pause");
        pauseRecord.pauseEnd = dnow;
        const myRequest = new Request(options.APIDBHostPauses + "/" + pauseRecord._id, {
            method: "PATCH",
            headers: DB_API_HEADERS,
            body: JSON.stringify(pauseRecord)
        });

        fetch(myRequest)
            .then((response) => response.json())
            .then((contents) => {
                timerRecord.status = "NOT_PAUSED";
                localStorage.setItem("focusTimer", JSON.stringify(timerRecord));
                localStorage.removeItem("pause");
                setNotPausedTimerUI();
            });
    } else {
        const newPauseRecord = {
            timerId: timerRecord.timerId,
            pauseStart: dnow
        };

        const newPauseRequest = new Request(options.APIDBHostPauses, {
            method: "POST",
            headers: DB_API_HEADERS,
            mode: "cors",
            cache: "no-cache",
            body: JSON.stringify(newPauseRecord)
        });

        fetch(newPauseRequest)
            .then((response) => response.json())
            .then((contents) => {
                newPauseRecord.pauseId = contents._id;
                startPauseTimer(newPauseRecord);

                timerRecord.status = "PAUSED";
                localStorage.setItem("focusTimer", JSON.stringify(timerRecord));
                localStorage.setItem("pause", JSON.stringify(newPauseRecord));

                setPausedTimerUI(timerRecord);
            });
    }
};

export const updateTimerService = function (timerRow) {
    if (!timerRow) {
        throw new Error("Error: no timer id");
    }

    const myRequest = new Request(options.APIDBHostTasks + "/" + timerRow.timerId, {
        method: "PATCH",
        headers: DB_API_HEADERS,
        body: JSON.stringify(timerRow)
    });

    fetch(myRequest)
        .then((response) => response.json())
        .then((contents) => {
            console.log("Updated timer:" + timerRow.timerId);
        });
};

export const setTaskEndTime = function (timerId) {
    if (!timerId) {
        throw new Error("Error: no timer id");
    }

    let dnowWithSecs = new Date();
    dnowWithSecs = new Date(dnowWithSecs.setSeconds(0, 0));
    const dnow = dnowWithSecs.getTime();

    const myRequest = new Request(options.APIDBHostTasks + "/" + timerId, {
        method: "PATCH",
        headers: DB_API_HEADERS,
        body: JSON.stringify({
            endTime: dnow,
            lastHeartbeat: dnow
        })
    });

    fetch(myRequest)
        .then((response) => response.json())
        .then((contents) => {
            console.log("Ended Timer " + timerId);
        });
};

export const updateFocusTimer = function () {
    const timerRecord = getTimerRecordFromStorage();
    if (!timerRecord) {
        console.warn("I am in updateFocusTimer but there is no timerRecord. I am resetting the timer!");
        clearFocusTimerInterval();
        noFocusTimerUI();
        return;
    }

    const startTime = timerRecord.startTime;

    if (!startTime) {
        throw new Error("updateFocusTimer Error: no startTime");
    }

    const timeStr = getElapsedTime(startTime, new Date().getTime());
    $html("currentTimerTime", timeStr);
    document.title = "Solid Focus [" + timeStr + "]";
    withFocusTimerUI();
};

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

export function clearFocusTimerInterval() {
    if (focusTimerVars.focusTimerClientId) {
        console.log("clearInterval " + focusTimerVars.focusTimerClientId);
        clearInterval(focusTimerVars.focusTimerClientId);
        focusTimerVars.focusTimerClientId = null;
    }
}

export function getRecordFromStorage(key) {
    const recordStr = localStorage.getItem(key);
    if (!recordStr) return null;

    const record = JSON.parse(recordStr);
    if (!record) return null;
    return record;
}

export function getTimerRecordFromStorage() {
    return getRecordFromStorage("focusTimer");
}

export function getFocusHistoryData(callback) {
    const user = localStorage.getItem("userInfo");
    const query = 'max=200&h={"$orderby":{"startTime":-1}}&q={"user":"' + user + '"}&d=' + new Date().getTime();
    const myRequest = new Request(options.APIDBHostTasks + "?" + query, {
        method: "GET",
        headers: DB_API_HEADERS,
        cache: "no-cache"
    });

    fetch(myRequest)
        .then((response) => response.json())
        .then((contents) => {
            callback(contents);
        });
}

export function convertUTCDateToLocalDate(date) {
    const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

export function operateFormatter(value, row, index) {
    return [
        '<a class="timer-edit" href="#" title="Edit" id="edit' + row._id +
        '" data-toggle="modal" data-target="#dateModal" data-modal-mode="table-edit" data-rowid="' +
        row._id +
        '">',
        '<i class="far fa-edit"></i>',
        "</a>&nbsp;",
        '<a class="timer-edit" href="#" title="Delete" id="edit' +
        row._id +
        '" data-toggle="modal" data-target="#deleteEntryModal" data-rowid="' +
        row._id +
        '">',
        '<i class="far fa-trash-alt"></i>',
        "</a>"
    ].join("");
}

export function showTimerData(row) {
    if (row.endTime) {
        let std = convertUTCDateToLocalDate(new Date(parseInt(row.endTime)))
            .toJSON()
            .slice(0, 16);
        $("#endDateTime").val(std);
    }
    let etd = convertUTCDateToLocalDate(new Date(parseInt(row.startTime)))
        .toJSON()
        .slice(0, 16);
    $("#startDateTime").val(etd);
    $("#focusTaskName").val(row.focusTaskName);
    $("#timerId").val(row._id || row.timerId);
}

// Initialize event handlers
initializeEventHandlers();

// Assign operateEvents to window.operateEvents
window.operateEvents = operateEvents;
