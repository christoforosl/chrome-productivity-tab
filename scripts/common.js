/* jshint esversion: 6 */

//"APITaskDescriptionList":"https://chrometimertasks-879e.restdb.io/rest/chrome-timer-tasks?q=%7B%22%24distinct%22%3A%20%22focusTaskName%22%7D&h=%7B%22%24max%22%3A10%2C%22%24orderby%22%3A%7B%22startTime%22%3A-1%7D%7D",
const options = {
  "version":"3.11",
  "APIDBHostTasks": "https://chrometimertasks-879e.restdb.io/rest/chrome-timer-tasks",
  "APIDBHostPauses": "https://chrometimertasks-879e.restdb.io/rest/task-pause",
  "APIQuoteOfTheDayApiHost-old": "https://quotes.rest/qod?language=en",
  "APIQuoteOfTheDayApiHost": "https://api.quotable.io/quotes/random",
  "focusTimerAlarmName": "focusTimerAlarm",
  "username": "christoforosl@netu.com.cy",

  "greetingNameFontSizePixels": 70,
  "whatShallWeWorkOnQuestionText": "What is our focus now?",
  "whatShallWeWorkOnQuestionTextFontSizePixels": 50,

   "imageApiKeyPexels":"563492ad6f917000010000013f1e4531d3454bb2a13e4cfc11f4e189",

  "imageApiKey":"SidraH8wDMI92Y_bXxn2Tg1PLJWt24RI310YYUHJ1xY",
  "imageApiQuery":"https://api.unsplash.com/photos/random?query=",

  "language" : window.navigator.userLanguage || window.navigator.language || 'en'
};

const CALL_QUOTE_HEADERS = new Headers({
  "accept": "application/json",
  "useQueryString": true
});

const CALL_IMAGE_API_HEADERS = new Headers({
  "accept": "application/json",
  "Authorization": "Client-ID " + options.imageApiKey
});

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
