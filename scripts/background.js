// note: JQuery is not available to this backround js script
var timer = null;

function setTimer() {

  timer = setInterval(myTimer, 1000);

};

function myTimer() {
  var d = new Date();
  var t = d.toDateString() + ', ' + d.toLocaleTimeString();
  var greeting;

  if (d.getHours() > 0 && d.getHours() <= 12) {
    greeting = "Good Morning " + options.greetingName;
  } else if (d.getHours() > 12 && d.getHours() <= 19) {
    greeting = "Good Afternoon " + options.greetingName;
  } else {
    greeting = "Good Evening " + options.greetingName;
  }
  
  $html('whatShallWeWorkOnQuestionText',  options.whatShallWeWorkOnQuestionText);
  $html("currentTime", t );
  $html("greeting", greeting );
  $html("currentFocus", options.currentFocus);

}

function initBackground() {
  chrome.tabs.onRemoved.addListener(function () {
    if (timer) {
      console.log("Clearing Interval")
      clearInterval(timer);
    }
  });

}

chrome.runtime.onInstalled.addListener(function () {
  console.log("my extension is on!")
  initBackground();
  setTimer();

});

initBackground();
setTimer();
