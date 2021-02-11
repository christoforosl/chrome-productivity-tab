const DB_API_HEADERS = new Headers({
  "content-type": "application/json",
  "x-apikey": "602510f75ad3610fb5bb5ec5",
})

window.SetCurrentFocusAndStartTimer = function() {

  var myRequest = new Request(options.APIDBHost, {
    "method": "POST",
    "headers": DB_API_HEADERS,
    "mode": 'cors',
    "cache": 'default',
    body: JSON.stringify({
      "user": "chris",
      "startTime": new Date().getTime(),
      "focusTaskName": $('#taskName').val()
    })
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      var timerid = contents._id;
      startFocusTimer(timerid);

    });

    $('#workItemModal').modal('hide');
}

window.startFocusTimer = function ( timerid ) {
  if (options.startFocusTimer) {
    clearInterval(options.startFocusTimer);
    options.startFocusTimer = null;
  }

  var value = new Date().getTime();
  chrome.storage.local.set({
    "TIMER_START_KEY": value,
    "TIMER_ID":timerid
  }, function () {
    console.log('Start Timer set to ' + value + ", server timerid: " + timerid);
  });

  $('#divStartTimer').addClass('invisible');
  $('#divEndTimer').removeClass('invisible');

  options.startFocusTimer = setInterval(updateFocusTimer, 1000);

};

/**
 * Called on tab open. Checks if a focus timer is active from another tab and continues
 */
window.checkForActiveFocusTimer = function () {

  chrome.storage.local.get(["TIMER_START_KEY","TIMER_ID"], function (value) {
    if ( value && value.TIMER_START_KEY > 0 && value.TIMER_ID ) {
      options.startFocusTimer = setInterval(updateFocusTimer, 1000);
    } else {

      if(window.jQuery) {
        $('#divEndTimer').addClass('invisible');
        $('#divStartTimer').removeClass('invisible');
      }

    }
  });

};

window.endFocusTimer = function () {

  chrome.storage.local.get( ["TIMER_START_KEY","TIMER_ID"] , function (getStorageResult) {
    
    if ( getStorageResult.TIMER_ID  ) {
      var timerid =  getStorageResult.TIMER_ID;

      chrome.storage.local.remove( "TIMER_START_KEY");
      chrome.storage.local.remove( "TIMER_ID" );
  
      // skip active tab ... 
      chrome.tabs.query({active: false}, function (tabs) {

        for (var i = 0; i < tabs.length; ++i) {
          console.log("sending END_TIMER message to tab:"+ tabs[i].id);
          chrome.tabs.sendMessage(tabs[i].id, "END_TIMER");
        }
      });

      var dnow = new Date().getTime();

      var myRequest = new Request(options.APIDBHost + "/" + timerid, {
        "method": "PATCH",
        "headers": DB_API_HEADERS,
        "mode": 'cors',
        "cache": 'default',
        body: JSON.stringify({
          "endTime": dnow,
          "lastHeartbeat": dnow
        })
      });
    
      fetch(myRequest)
        .then(response => response.json())
        .then(contents => {
          console.log('Ended Timer ' + timerid);
      });
     
    };
 });

}



window.updateFocusTimer = function () {

  chrome.storage.local.get( ["TIMER_START_KEY","TIMER_ID"] , function (result) {
    
    var startTime = result.TIMER_START_KEY;
    var taskTimerId = result.TIMER_ID;
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
    if (window.jQuery) {
      $('#divStartTimer').addClass('invisible');
      $('#divEndTimer').removeClass('invisible');
    }

  });
};


chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {
      console.log("we just received a message")
      console.log(request);
      console.log(sender);
      if (options.startFocusTimer) {
        console.log("clearInterval "+ options.startFocusTimer );
        clearInterval(options.startFocusTimer);
        options.startFocusTimer = null;
      }
      if(window.jQuery) {
        $('#divEndTimer').addClass('invisible');
        $('#divStartTimer').removeClass('invisible');
      }
      sendResponse("END_TIMER_DONE_SUCCESS");
  }

);
