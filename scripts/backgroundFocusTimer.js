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


window.startFocusTimer = function () {
    if(options.startFocusTimer) {
      cancelInterval(options.startFocusTimer);
      options.startFocusTimer = null;
    }
  
    var value = new Date().getTime();
    chrome.storage.local.set({
      "TIMER_START_KEY": value
    }, function () {
      console.log('Start Timer set to ' + value);
    });
  
    $('#divStartTimer').addClass('invisible');
    $('#divStopTimer').removeClass('invisible');

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
      if(window.jQuery){
        $('#divStartTimer').addClass('invisible');
        $('#divStopTimer').removeClass('invisible');
      }
  
    });
  };
  