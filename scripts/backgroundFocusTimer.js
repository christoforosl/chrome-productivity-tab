var focusTimerVars = {};

const DB_API_HEADERS = new Headers({
  "Accept": "application/json",
  "content-type": "application/json",
  "x-apikey": "602510f75ad3610fb5bb5ec5"
})

window.SetCurrentFocusAndStartTimer = function () {

  var record = {
    "user": "chris",
    "startTime": new Date().getTime(),
    "focusTaskName": $('#taskName').val()
  };

  var myRequest = new Request(options.APIDBHost, {
    "method": "POST",
    "headers": DB_API_HEADERS,
    "mode": 'cors',
    "cache": 'default',
    body: JSON.stringify(record)
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      record.timerId = contents._id;
      startFocusTimer(record);

    });

  $('#workItemModal').modal('hide');
}

window.startFocusTimer = function (record) {

  if (focusTimerVars.focusTimerClientId) {
    console.log("clear exsiting timer: " + focusTimerVars.focusTimerClientId);
    clearInterval(focusTimerVars.focusTimerClientId);
    focusTimerVars.focusTimerClientId = null;
  }

  localStorage.setItem("focusTimer", JSON.stringify(record));
  console.log('Start Timer set to ' + record.startTime + ", server timerId: " + record.timerId);

  withFocusTimerUI();
  focusTimerVars.focusTimerClientId = setInterval(updateFocusTimer, 1000);

};

/**
 * Called on tab open. Checks if a focus timer is active from another tab and continues
 */
window.checkForActiveFocusTimer = function () {

  var timerRecord = getTimerRecordFromStorage();

  if (!timerRecord) {
    noFocusTimerUI();
    return;
  }

  $html('currentFocus', timerRecord.focusTaskName);
  focusTimerVars.focusTimerClientId = setInterval(updateFocusTimer, 1000);
  withFocusTimerUI();
};

window.endFocusTimer = function () {

  var timerRecord = getTimerRecordFromStorage();

  if (timerRecord) {
    console.log("will end timer:" + timerRecord.timerId);
    setTaskEndTime(timerRecord.timerId);
    localStorage.removeItem("focusTimer");

    // // skip active tab ... 
    // chrome.tabs.query({active: false}, function (tabs) {
    //   for (var i = 0; i < tabs.length; ++i) {
    //     console.log("sending END_TIMER message to tab:"+ tabs[i].id);
    //     chrome.tabs.sendMessage(tabs[i].id, "END_TIMER");
    //   }
    // });

  };


}

window.setTaskEndTime = function (timerId) {
  if (!timerId) {
    throw ('Error: no timer id');
  }
  var dnow = new Date().getTime();
  var myRequest = new Request(options.APIDBHost + "/" + timerId, {
    "method": "PATCH",
    "headers": DB_API_HEADERS,

    body: JSON.stringify({
      "endTime": dnow,
      "lastHeartbeat": dnow
    })
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      console.log('Ended Timer ' + timerId);

    });

}

window.updateFocusTimer = function () {

  var timerRecord = getTimerRecordFromStorage();
  if (!timerRecord) {
    console.warn("I am in updateFocusTimer but there is no timerRecord. I am resetting the timer!");
    clearFocusTimerInterval();
    noFocusTimerUI();
    return;
  }

  var startTime = timerRecord.startTime;

  if (!startTime) {
    throw ('updateFocusTimer Error: no startTime');
  }

  var elapsedSecs = (new Date().getTime() - startTime) / 1000;
  var hours = Math.floor(elapsedSecs / 3600);
  var minutes = Math.floor((elapsedSecs - (hours * 3600)) / 60);
  var seconds = Math.round(elapsedSecs - (hours * 3600) - (minutes * 60), 0);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var timeStr = hours + ':' + minutes + ':' + seconds;
  $html('currentTimerTime', timeStr);
  withFocusTimerUI();

};


function clearFocusTimerInterval() {
  if (focusTimerVars.focusTimerClientId) {
    console.log("clearInterval " + focusTimerVars.focusTimerClientId);
    clearInterval(focusTimerVars.focusTimerClientId);
    focusTimerVars.focusTimerClientId = null;
  }

}

function noFocusTimerUI() {
  if (window.jQuery) {
    $('#divEndTimer').addClass('invisible');
    $('#btnSetWorkItem').removeClass('invisible');
  }
}
function withFocusTimerUI() {
  if (window.jQuery) {

    $('#divEndTimer').removeClass('invisible');
    $('#btnSetWorkItem').addClass('invisible');
  }
}

function getTimerRecordFromStorage() {

  var timerRecordStr = localStorage.getItem("focusTimer");
  if (!timerRecordStr) return null;

  var timerRecord = JSON.parse(timerRecordStr);
  if (!timerRecord) return null;
  return timerRecord;

}