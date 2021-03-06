/* jshint esversion: 6 */

var focusTimerVars = {};

const DB_API_HEADERS = new Headers({
  "Accept": "application/json",
  "content-type": "application/json",
  "x-apikey": "602510f75ad3610fb5bb5ec5"
});

window.SetCurrentFocusAndStartTimer = function () {

  var dnowWithSecs = new Date();
  dnowWithSecs = new Date( dnowWithSecs.setSeconds(0,0));
  var dnow = dnowWithSecs.getTime();

  var record = {
    "user": localStorage.getItem("userInfo"),
    "startTime": dnow,
    "focusTaskName": $('#taskName').val()
  };

  var myRequest = new Request(options.APIDBHostTasks, {
    "method": "POST",
    "headers": DB_API_HEADERS,
    "mode": 'cors',
    "cache": 'no-cache',
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

  $html('currentFocus', "[" + timerRecord.focusTaskName + "]");

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

window.togglePauseStatus= function () {

  var timerRecord = getTimerRecordFromStorage();
  if(!timerRecord){
    return;
  }
  var dnowWithSecs = new Date();
  dnowWithSecs = new Date( dnowWithSecs.setSeconds(0,0));
  var dnow = dnowWithSecs.getTime();

  if(timerRecord.status === 'PAUSED') {
    
    var pauseRecord = getRecordFromStorage("pause");
    pauseRecord.pauseEnd = dnow;
    var myRequest = new Request(options.APIDBHostPauses + "/" + pauseRecord._id, {
      "method": "PATCH",
      "headers": DB_API_HEADERS,
      body: JSON.stringify(pauseRecord)
    });

    fetch(myRequest)
      .then(response => response.json())
      .then(contents => {
        timerRecord.status = 'NOT_PAUSED';
        localStorage.setItem("focusTimer", JSON.stringify(record));
        localStorage.removeItem ("pause");
        setNotPausedTimerUI();
      });


  } else {

    var newPauseRecord = {
      "timerId":timerRecord.timerId,
      "pauseStart": dnow,
      
    };

    var newPauseRequest = new Request(options.APIDBHostPauses, {
      "method": "POST",
      "headers": DB_API_HEADERS,
      "mode": 'cors',
      "cache": 'no-cache',
      body: JSON.stringify(newPauseRecord)
    });

    fetch(newPauseRequest)
      .then(response => response.json())
      .then(contents => {
        newPauseRecord.pauseId = contents._id;
        startPauseTimer(newPauseRecord);
        
        timerRecord.status = 'PAUSED';
        localStorage.setItem("focusTimer", JSON.stringify(timerRecord));
        localStorage.setItem("pause", JSON.stringify(newPauseRecord));

        setPausedTimerUI(timerRecord);

      });
  }
  
};

window.startPauseTimer = function (timerRow) {

};

window.updateTimerService = function (timerRow) {
  if (!timerRow) {
    throw ('Error: no timer id');
  }
  
  var myRequest = new Request(options.APIDBHostTasks + "/" + timerRow.timerId, {
    "method": "PATCH",
    "headers": DB_API_HEADERS,
    body: JSON.stringify(timerRow)
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      console.log('Updated timer:' + timerId);
    });

};

window.setTaskEndTime = function (timerId) {
  if (!timerId) {
    throw ('Error: no timer id');
  }
  
  var dnowWithSecs = new Date();
  dnowWithSecs = new Date( dnowWithSecs.setSeconds(0,0));
  var dnow = dnowWithSecs.getTime();
    
  var myRequest = new Request(options.APIDBHostTasks + "/" + timerId, {
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
  document.title = "Solid Focus [" + timeStr + "]";
  withFocusTimerUI();

};

function getElapsedTime(startTime, endTime) {
  if (!startTime) return '';
  if (!endTime) return '';
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

function hideItem(id) {
  $('#'+id).addClass('invisible');
  $('#'+id).css('display','none');
}

function showItem(id) {
  $('#'+id).removeClass('invisible');
  $('#'+id).css('display','block');
}

function noFocusTimerUI() {
  if (window.jQuery) {

    hideItem('divFocus');
    hideItem('divEndTimer');
    showItem('divAskAndSetGreeting');
    document.title = "Solid Focus";
  }
}
function setNotPausedTimerUI (timerRecord) {
  $html('currentFocus', "[" + timerRecord.focusTaskName +"]");
  $('#btnPauseFocusTimer').value ="Pause";
  $('#btnPauseFocusTimer').title = "Pause Current Focus Timer";
}

function setPausedTimerUI(timerRecord) {
  $html('currentFocus', "[" + timerRecord.focusTaskName + " PAUSED ]");
  $('#btnPauseFocusTimer').value = "Continue";
  $('#btnPauseFocusTimer').title = "Continue Task Timer";
}


function withFocusTimerUI() {

  if (window.jQuery) {
    showItem('divFocus');
    showItem('divEndTimer');
    //hideItem('btnSetWorkItem');
    hideItem('divAskAndSetGreeting');


  }
}

/**
 * retrieve a record from storage and parse it and return it as object
 * @param {string} key 
 * @returns json object
 */
function getRecordFromStorage(key) {

  var recordStr = localStorage.getItem(key);
  if (!recordStr) return null;

  var record = JSON.parse(recordStr);
  if (!record) return null;
  return record;

}

function getTimerRecordFromStorage() {
  return getRecordFromStorage("focusTimer");
}

function getFocusHistoryData(callback) {
  var user = localStorage.getItem("userInfo");
  var query = "max=200&h={\"$orderby\":{\"startTime\":-1}}&q={\"user\":\"" + user + "\"}&d=" + new Date().getTime();
  var myRequest = new Request(options.APIDBHostTasks + "?" + query, {
    "method": "GET",
    "headers": DB_API_HEADERS,
    "cache": "no-cache"
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      callback(contents);

    });

}

if ($e("btnShowSettings")) {
  $e("btnShowSettings").addEventListener("click", function () {
    $('#settingsModal').modal('show');
  });
}
if ($e("btnSaveSettings")) {
  $e("btnSaveSettings").addEventListener("click", function () {

    if (!$('#greetingName').val()) {

      return;
    }

    var tmp = $('#backroundImageSearchTerms').val();
    if (!tmp) {
      tmp = "nature,forest,mountain,water";
    }
    if (settings.imageKeywords !== tmp) {
      settings.imageKeywords = tmp;
      fetchImageFromApiService();
    }

    settings.greetingName = $('#greetingName').val();

    window.localStorage.setItem("settings", JSON.stringify(settings));
    $('#settingsModal').modal('hide');
  });
}

function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;   
}

if ($e("btnShowHistory")) {
  $e("btnShowHistory").addEventListener("click", function () {
    
    getFocusHistoryData(function (data) {
      var $table = $('#tblFocusTimerHistory');
      data.forEach(function (obj) {
        obj.endDateTime = obj.endTime ? new Date(obj.endTime).toLocaleString(options.language) : '';
        obj.startDateTime = obj.startTime ? new Date(obj.startTime).toLocaleString(options.language) : '';
        obj.workHours = getElapsedTime(obj.startTime, obj.endTime);
      });

      //https://bootstrap-table.com/docs/getting-started/introduction/
      $table.bootstrapTable({ data: data });
      $table.bootstrapTable('load', data);
      $('#listTimersModal').modal('show');
      
    });
  });
}

if ($e("btnSaveFocusData")) {
  $e("btnSaveFocusData").addEventListener("click", function () {
    
    var timerRecord = {};
    timerRecord.timerId = $('#timerId').val();
    timerRecord._id = $('#timerId').val();
    if($('#endDateTime').val()) {
      timerRecord.endTime = new Date( $('#endDateTime').val()).getTime();
    }
    timerRecord.startTime = new Date( $('#startDateTime').val()).getTime(); //$('#startDateTime').val();
    timerRecord.focusTaskName = $('#focusTaskName').val();
    updateTimerService(timerRecord);
    var $table = $('#tblFocusTimerHistory');
    $table.bootstrapTable('updateByUniqueId', {
      id: timerRecord.timerId,
      row: {
        focusTaskName: timerRecord.focusTaskName,
        endDateTime : timerRecord.endTime ? new Date(timerRecord.endTime).toLocaleString(options.language) : '',
        startDateTime : timerRecord.startTime ? new Date(timerRecord.startTime).toLocaleString(options.language) : '',
        workHours : getElapsedTime(timerRecord.startTime, timerRecord.endTime)
      }
    });
    $('#dateModal').modal('hide');

  });
}

function operateFormatter(value, row, index) {
  return [
    '<a class="timer-edit" href="#" title="Edit" id="edit'+row._id+'" data-toggle="modal" data-target="#dateModal" data-rowid="'+row._id+'">',
    '<i class="far fa-edit"></i>',
    '</a>&nbsp;',
    '<a id="del'+row._id+'" data-confirm-title="My Super Title" data-confirm-content="My Super Question" class="timer-remove popconfirm" href="#" title="Remove" data-toggle="confirmation">',
    '<i class="far fa-trash-alt"></i>',
    '</a>'
  ].join('');
}

window.operateEvents = {
  'click .timer-edit': function (e, value, row, index) {
    // leave here. if removed, javascript error appears in cosole
  },
  'click .timer-remove': function (e, value, row, index) {;

  }
}

/**
 * open edit page, fill controls with data
 */
 $('#dateModal').on('show.bs.modal', function (event) {
  
  var button = $(event.relatedTarget) // Button that triggered the modal
  var row = $('#tblFocusTimerHistory').bootstrapTable('getRowByUniqueId', button.data('rowid')); // Extract info from data-* attributes

  //https://stackoverflow.com/questions/38369240/jquery-set-current-date-to-input-type-datetime-local
  if(row.endTime) {
    let std = convertUTCDateToLocalDate( new Date(parseInt(row.endTime))).toJSON().slice(0,19);
    $('#endDateTime').val( std );
  }
  let etd = convertUTCDateToLocalDate( new Date(parseInt(row.startTime))).toJSON().slice(0,19);
  $('#startDateTime').val( etd );
  $('#focusTaskName').val( row.focusTaskName );
  $('#timerId').val( row._id );
  
});
