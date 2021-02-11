/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var DEFAULT_A1_TT = '09:30';
var DEFAULT_A1_AMPM = 0;
var DEFAULT_A2_TT = '03:30';
var DEFAULT_A2_AMPM = 1;
var DEFAULT_RATE = 1.0;
var DEFAULT_VOLUME = 1.0;
var DEFAULT_PHRASE = 'It\'s $TIME, so get up!';
var DEFAULT_SOUND = 'ringing';

var audio = null;

var isPlaying = false;
var isSpeaking = false;
var isAnimating = false;

var options = {
  "APIDBHost": "https://chrometimertasks-879e.restdb.io/rest/chrome-timer-tasks/",
  "APIQuoteOfTheDayApiHost": "https://quotes.rest/qod?language=en",
  "focusTimerAlarmName": "focusTimerAlarm",
  "username": "christoforosl@netu.com.cy",
  "greetingName": "Christoforos",
  "greetingNameFontSizePixels": 70,
  "whatShallWeWorkOnQuestionText": "What is our focus now?",
  "whatShallWeWorkOnQuestionTextFontSizePixels": 50,
  "currentFocus": ""
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

if (window.jQuery) {
  $('#divStartTimer').removeClass('invisible');
  $('#divEndTimer').addClass('invisible');
}