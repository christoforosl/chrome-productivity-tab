/* jshint esversion: 6 */


var options = {
  "APIDBHost": "https://chrometimertasks-879e.restdb.io/rest/chrome-timer-tasks",
  "APIQuoteOfTheDayApiHost": "https://quotes.rest/qod?language=en",
  "focusTimerAlarmName": "focusTimerAlarm",
  "username": "christoforosl@netu.com.cy",
  "greetingName": "Christoforos",
  "greetingNameFontSizePixels": 70,
  "whatShallWeWorkOnQuestionText": "What is our focus now?",
  "whatShallWeWorkOnQuestionTextFontSizePixels": 50
};

function $e(id) {
  return document.getElementById(id);
}

function $html(id, text) {
  const elent = $e(id);
  if (elent) {

    if (elent.nodeName === 'DIV') {
      if (elent.innerHTML != text) {
        elent.innerHTML = text;
      }
    } else if (elent.nodeName === 'BUTTON') {
      if (elent.value != text) {
        elent.value = text;
      }
    }

  }



}
if (!window.localStorage.getItem("userInfo")) {

  chrome.identity.getProfileUserInfo(function (userInfo) {
    if ( userInfo.email ) {
      window.localStorage.setItem("userInfo", userInfo.email);
    } else {
      window.localStorage.setItem("userInfo", randomIntFromInterval(1000000,9999999));
    }

  });
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}