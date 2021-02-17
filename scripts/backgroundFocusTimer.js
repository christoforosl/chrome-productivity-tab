/* jshint esversion: 6 */ 

var focusTimerVars = {};

const DB_API_HEADERS = new Headers({
  "Accept": "application/json",
  "content-type": "application/json",
  "x-apikey": "602510f75ad3610fb5bb5ec5"
});

window.SetCurrentFocusAndStartTimer = function () {

  var record = {
    "user": localStorage.getItem("userInfo"),
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
    $html('currentFocus', "[" + record.focusTaskName + "]");
    $('#workItemModal').modal('hide');
};

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

  $html('currentFocus',  "[" + timerRecord.focusTaskName + "]");
  
  focusTimerVars.focusTimerClientId = setInterval(updateFocusTimer, 1000);
  withFocusTimerUI();
};

window.endFocusTimer = function () {

  var timerRecord = getTimerRecordFromStorage();

  if (timerRecord) {
    console.log("will end timer:" + timerRecord.timerId);
    setTaskEndTime(timerRecord.timerId);
    localStorage.removeItem("focusTimer");

  }


};

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

};

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

  var timeStr = getElapsedTime(startTime, new Date().getTime());
  $html('currentTimerTime', timeStr);
  document.title = "Focus:[" + timeStr+"]";
  withFocusTimerUI();

};

function getElapsedTime(startTime, endTime) {
  if(!startTime)return '';
  if(!endTime)return '';
  var elapsedSecs = (endTime - startTime) / 1000;
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
  return hours + ':' + minutes + ':' + seconds;
}

function clearFocusTimerInterval() {
  if (focusTimerVars.focusTimerClientId) {
    console.log("clearInterval " + focusTimerVars.focusTimerClientId);
    clearInterval(focusTimerVars.focusTimerClientId);
    focusTimerVars.focusTimerClientId = null;
  }

}

function noFocusTimerUI() {
  if (window.jQuery) {
    
    $('#divFocus').addClass('invisible');
    $('#divEndTimer').addClass('invisible');
    $('#btnSetWorkItem').removeClass('invisible');
  }
}
function withFocusTimerUI() {
  if (window.jQuery) {
    $('#divFocus').removeClass('invisible');
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

function getFocusHistoryData(callback) {
  var user = localStorage.getItem("userInfo");
  var query = "max=20&h={\"$orderby\":{\"startTime\":-1}}&q={\"user\":\"" + user + "\"}";
  var myRequest = new Request(options.APIDBHost + "?" + query, {
    "method": "GET",
    "headers": DB_API_HEADERS
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      callback(contents);

    });

}

if ($e("btnShowSettings")) {
  $e("btnShowSettings").addEventListener("click", function(){
    $('#settingsModal').modal('show');
  });
}
if ($e("btnSaveSettings")) {
  $e("btnSaveSettings").addEventListener("click", function(){

    if(! $('#greetingName').val()) {
      
      return;
    }

    var tmp = $('#backroundImageSearchTerms').val();
    if(!tmp){
      tmp = "nature,forest,mountain,water";
    }
    if(settings.imageKeywords !== tmp) {
      settings.imageKeywords = tmp;
      setBackroundImage();
    }
       
    settings.greetingName = $('#greetingName').val();

    window.localStorage.setItem("settings", JSON.stringify(settings));
    $('#settingsModal').modal('hide');
  });
}

if($e("btnShowHistory")) {
  $e("btnShowHistory").addEventListener("click", function(){

        getFocusHistoryData(function(data){
          data.forEach(function (obj) {
            obj.endDateTime= obj.endTime  ? new Date( obj.endTime ).toLocaleString("el-GR"): '';
            obj.startDateTime = obj.startTime? new Date( obj.startTime ).toLocaleString("el-GR"): '';
            obj.workHours = getElapsedTime(obj.startTime, obj.endTime);
          });
          var $table = $('#tblFocusTimerHistory');
          //https://bootstrap-table.com/docs/getting-started/introduction/
          $table.bootstrapTable({ data:data });
          $table.bootstrapTable('resetView');
          $('#listTimersModal').modal('show');
        });
    
  });
}