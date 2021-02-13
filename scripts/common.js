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
