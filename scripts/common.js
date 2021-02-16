/* jshint esversion: 6 */

var settings = JSON.parse( window.localStorage.getItem("settings") ) || {"imageKeywords":"nature,forest,mountain,water"};
var options = {
  
  "APIDBHost": "https://chrometimertasks-879e.restdb.io/rest/chrome-timer-tasks",
  "APIQuoteOfTheDayApiHost": "https://quotes.rest/qod?language=en",
  "focusTimerAlarmName": "focusTimerAlarm",
  "username": "christoforosl@netu.com.cy",
  "greetingName": "Christoforos",
  "greetingNameFontSizePixels": 70,
  "whatShallWeWorkOnQuestionText": "What is our focus now?",
  "whatShallWeWorkOnQuestionTextFontSizePixels": 50,

  "pexelsApiKey":"563492ad6f9170000100000122d321b272644f1ea47df0b35c3ff2bf",
  "pexelsApiQuery":"https://api.pexels.com/v1/search?query=people&orientation=landscape&per_page=1&page=1",
  "backroundImageUrl":"https://source.unsplash.com/daily?nature,forest,mountain,water"

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


if (window.jQuery) {
  var defaultKeywords = settings.imageKeywords||"nature,forest,mountain,water";
  $(document).ready(function(){
    $("html").css("background-image", "url('https://source.unsplash.com/daily?" + defaultKeywords +"')");
  });
}


