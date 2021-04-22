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
  var form = $e("frmEnterTaskName");
  form.classList.add('was-validated');
  if (form.checkValidity() === false) {
    return;
  }
  

  var record = {
    "user": localStorage.getItem("userInfo"),
    "startTime": dnow,
    "focusTaskName": $('#taskName').val()
  };

  var myRequest = new Request(options.APIDBHost, {
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


window.updateTimerService = function (timerRow) {
  if (!timerRow) {
    throw ('Error: no timer id');
  }
  
  var myRequest = new Request(options.APIDBHost + "/" + timerRow.timerId, {
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
function withFocusTimerUI() {

  if (window.jQuery) {
    showItem('divFocus');
    showItem('divEndTimer');
    //hideItem('btnSetWorkItem');
    hideItem('divAskAndSetGreeting');


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
  var query = "max=20&h={\"$orderby\":{\"startTime\":-1}}&q={\"user\":\"" + user + "\"}&d=" + new Date().getTime();
  var myRequest = new Request(options.APIDBHost + "?" + query, {
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
    $('#listTimersModal').modal('show');
    
    getFocusHistoryData(function (data) {
      var $table = $('#tblFocusTimerHistory');
      data.forEach(function (obj) {
        obj.endDateTime = obj.endTime ? new Date(obj.endTime).toLocaleString(options.language) : '';
        obj.startDateTime = obj.startTime ? new Date(obj.startTime).toLocaleString(options.language) : '';
        obj.workHours = getElapsedTime(obj.startTime, obj.endTime);
      });

      //https://bootstrap-table.com/docs/getting-started/introduction/
      $table.bootstrapTable({ data: data });
      $table.bootstrapTable('resetView');
      //$table.on('click-row.bs.table', openEditPage);
      
    });
  });
}

if ($e("currentFocusAddNote")) {
  $e("currentFocusAddNote").addEventListener("click", function () {
    $('#noteModal').modal('show');

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
    '<a class="timer-edit" href="#" title="Edit">',
    '<i class="far fa-edit"></i>',
    '</a>&nbsp;',
    '<a id="del'+row._id+'" data-confirm-title="My Super Title" data-confirm-content="My Super Question" class="timer-remove popconfirm" href="#" title="Remove" data-toggle="confirmation">',
    '<i class="far fa-trash-alt"></i>',
    '</a>'
  ].join('');
}

window.operateEvents = {
  'click .timer-edit': function (e, value, row, index) {
    openEditPage(row);
  },
  'click .timer-remove': function (e, value, row, index) {

  }
}

/**
 * open edit page, fill controls with data
 */
function openEditPage(row) {
  
  $('#dateModal').modal('show');
  //https://stackoverflow.com/questions/38369240/jquery-set-current-date-to-input-type-datetime-local
  if(row.endTime) {
    let std = convertUTCDateToLocalDate( new Date(parseInt(row.endTime))).toJSON().slice(0,19);
    $('#endDateTime').val( std );
  }
  let etd = convertUTCDateToLocalDate( new Date(parseInt(row.startTime))).toJSON().slice(0,19);
  $('#startDateTime').val( etd );
  $('#focusTaskName').val( row.focusTaskName );
  $('#timerId').val( row._id );
  
};
