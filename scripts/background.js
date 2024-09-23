
/* jshint esversion: 6 */
// note: JQuery is not available to this backround js script

import { options, $e, $html, randomIntFromInterval } from './common.js';
import { startFocusTimer, checkForActiveFocusTimer } from './backgroundFocusTimer.js';

let curentDateTimeTimer = null;





export function setCurrentDateTimeTimer() {

  curentDateTimeTimer = setInterval(setCurrentDateTime, 1000);

}

/**
 * returns true if quote is older than 24 hours
 * @param {long} quoteDate: the quote's set time, in epoch seconds
 */
function getQuoteIsOld(quoteDate) {
  if (!quoteDate) return true;
  const dt = new Date().toDateString();
  return dt !== quoteDate;

}

function setQuote() {

  chrome.storage.local.get(["quote", "quoteDate", "quoteBy"], function (value) {

    const oldq = getQuoteIsOld(value ? value.quoteDate : null);

    if (!value || value.length === 0 || value.quote === '' || oldq) {
      setQuoteFromService();
    } else {
      console.log('Set quote from storage :-)');
      $html("quote", '\"' + value.quote + '\"');
      $html("quoteBy", value.quoteBy);
    }
  });

}


function setQuoteFromService() {

  const myRequest = new Request(options.APIQuoteOfTheDayApiHost, {
    "method": "GET",
    "headers": CALL_QUOTE_HEADERS,
    "mode": 'cors',
    "cache": 'default'
  });

  fetch(myRequest)
    .then(response => {
      if (!response.ok) {
        console.log('QuoteFromService:Network response was not ok ' + response?.statusText);
        $html("quote", `Failed to fetch quote: status:  ${response?.status} ${response?.statusText}`);
        $html("quoteBy", '');
        return {};
      }
      return response.json();
    })
    .then(contents => {

      if(contents[0]) {
        const quote = contents[0].content;
        const author =contents[0].author;
        $html("quote", `"${quote}"`);
        $html("quoteBy", author);
        const dt = new Date().toDateString();
        const quoteObj = { "quote": quote, "quoteBy": author, "quoteDate": dt };
        chrome.storage.local.set(quoteObj, function () {
          console.log('set quote in storage' + JSON.stringify(quoteObj));
        });
      }

    }).catch(error => {
      console.warn('Fetch error:', error);
      $html("quote", 'Failed to fetch quote.');
      $html("quoteBy", '');
    });

}

function setCurrentDateTime() {
  const d = new Date();
  const centeredText = d.toDateString() + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let greeting;

  if (d.getHours() > 0 && d.getHours() <= 12) {
    greeting = "Good Morning, ";
  } else if (d.getHours() > 12 && d.getHours() <= 19) {
    greeting = "Good Afternoon, ";
  } else {
    greeting = "Good Evening, ";
  }
  greeting = greeting + (settings.greetingName || "[Specify Name In Settings]");
  $html('btnSetWorkItem', options.whatShallWeWorkOnQuestionText);
  $html("currentTime", centeredText + "<br>" + "Solid Focus, version " + options.version);
  $html("greeting", greeting);

}

function pageLoadActions() {

  if (!settings) {

    settings = JSON.parse(window.localStorage.getItem("settings")) || { "imageKeywords": "nature" };
    if (!settings) {
      settings = {};
    }
  }
  checkBackroundImageOnLoad();
  noFocusTimerUI();
  checkForActiveFocusTimer();
  setCurrentDateTimeTimer();
  setQuote();

  chrome.tabs.onRemoved.addListener(function () {
    if (curentDateTimeTimer) {
      console.log("Clearing Interval");
      clearInterval(curentDateTimeTimer);
    }
  });

}

export function checkBackroundImageOnLoad() {

  if (window.jQuery) {
    $(document).ready(function () {
      const currentBackroundImage = JSON.parse(localStorage.getItem('currentBackroundImage')) || {};

      const setImageFromStorage = currentBackroundImage.src && !( isOlderThanXDays( new Date(currentBackroundImage.setDate) , ( parseInt(settings.daysToKeepImage)??30)));
      if (setImageFromStorage) {
        setBackroundImageFromStorage(currentBackroundImage);
      } else {
        fetchImageFromApiService();
      }
    });
  }
}





function arrayOfItems() {

  const finalArr = [];

  for (const argument of arguments) {
    if (argument) {
      finalArr.push(argument);
    }
  }
  return finalArr.join(',');
}



chrome.runtime.onInstalled.addListener(function () {
  pageLoadActions();
});

pageLoadActions();

if ($e("btnSetCurrentFocusAndStartTimer")) {
  $e("btnSetCurrentFocusAndStartTimer").addEventListener("click", SetCurrentFocusAndStartTimer);

  $e("frmEnterTaskName").addEventListener('submit', function (event) {
    if ($e("frmEnterTaskName").checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);

}
if ($e("btnShowSettings")) {
  $('#backroundImageSearchTerms').val(settings.imageKeywords);
  $('#greetingName').val(settings.greetingName);
}

if ($e("btnChangeWallpaper")) {
  $e("btnChangeWallpaper").addEventListener("click", function () {

    localStorage.removeItem('currentBackroundImage');
    fetchImageFromApiService();

  });
}


// an array of epoch dates indicating the last 10 times the user was active.
// this is a way to detect inactivity and register potential end time of focus task
let lastActiveTime = 0;
let previousActiveTime = 0;
let potentialEndTimeDueToInactivity = 0;

const inactivityTime = function () {
  let time;
  window.onload = resetTimer;
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

  events.forEach(function (name) {
    document.addEventListener(name, resetTimer, true);
  });

  function logout() {
    previousActiveTime = lastActiveTime;
    lastActiveTime = new Date().getTime();

    if (lastActiveTime - previousActiveTime > 30 * 60 * 1000) {
      potentialEndTimeDueToInactivity = previousActiveTime;
      $('#potentialEndTimeDueToInactivity').html(new Date(potentialEndTimeDueToInactivity).toDateString());
    } else {
      potentialEndTimeDueToInactivity = 0;
    }
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 10 * 60 * 1000); // set a ten minute timeout

  }
};


function isOlderThanXDays(date, days) {
  const now = new Date();
  const diffTime = now - date.getTime();
  const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000 ));

  return diffDays > days;
}
