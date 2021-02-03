var timer = null;


function setTimer() {
  
  setInterval(myTimer, 1000);
    
};

function myTimer() {
  var d = new Date();
  var t = d.toLocaleTimeString();
  document.getElementById("currentTime").innerHTML = t;
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
