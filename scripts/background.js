var timer = null;
var userName = "Christoforos"

function setTimer() {
  
  setInterval(myTimer, 1000);
    
};

function myTimer() {
  var d = new Date();
  var t = d.toDateString() + ', ' + d.toLocaleTimeString();
  var greeting;

  if (d.getHours() > 0 && d.getHours() <= 12) {
    greeting = "Good Morning " + userName;
  } else if (d.getHours() > 12 && d.getHours() <= 19) {
    greeting = "Good Afternoon " + userName;
  } else {
    greeting = "Good Evening " + userName;
  }

  document.getElementById("currentTime").innerHTML = t;
  document.getElementById("greeting").innerHTML = greeting;
  
}

function initBackground() {
  chrome.tabs.onRemoved.addListener(function() {
     if (timer)  {
      clearInterval(timer);
     }
  });
  
}

initBackground();
setTimer();
