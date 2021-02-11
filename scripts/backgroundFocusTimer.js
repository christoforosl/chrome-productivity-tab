

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


/**
 * Called on tab open. Checks if a focus timer is active from another tab and continues
 */
window.checkForActiveFocusTimer = function () {

  chrome.storage.local.get("TIMER_START_KEY", function (value) {
    if (value != null) {
      options.startFocusTimer = setInterval(updateFocusTimer, 1000);
    }
  });

};

window.endFocusTimer = function () {

  chrome.storage.local.get("TIMER_START_KEY", function (result) {
    var endTaskTime = new Date().getTime();
    console.log("set end time to:" + endTaskTime);
  });

  chrome.tabs.query({}, function (tabs) {

    for (var i = 0; i < tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, "END_TIMER");
    }

  });

}

window.startFocusTimer = function () {
  if (options.startFocusTimer) {
    clearInterval(options.startFocusTimer);
    options.startFocusTimer = null;
  }

  var value = new Date().getTime();
  chrome.storage.local.set({
    "TIMER_START_KEY": value
  }, function () {
    console.log('Start Timer set to ' + value);
  });

  $('#divStartTimer').addClass('invisible');
  $('#divEndTimer').removeClass('invisible');

  options.startFocusTimer = setInterval(updateFocusTimer, 1000);

};

window.updateFocusTimer = function () {

  chrome.storage.local.get("TIMER_START_KEY", function (result) {
    var startTime = result.TIMER_START_KEY;
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
