import { options } from './common.js';
import { checkForActiveFocusTimer, setTaskEndTime } from './backgroundFocusTimer.js';

chrome.runtime.onInstalled.addListener(function() {
  initializeExtension();
});

function initializeExtension() {
  checkForActiveFocusTimer();
  setAlarms();
  chrome.storage.local.get("settings", function(result) {
    if (!result.settings) {
      chrome.storage.local.set({ settings: { imageKeywords: "nature" } }, function() {
        console.log("Default Settings saved");
      });
    }
  });
}

function setAlarms() {
  chrome.alarms.create('updateQuoteAlarm', { periodInMinutes: 1440 }); // 24 hours
  chrome.alarms.create('updateDateTimeAlarm', { periodInMinutes: 1 }); // Every minute
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateQuoteAlarm') {
    updateQuote();
  } else if (alarm.name === 'updateDateTimeAlarm') {
    updateDateTime();
  }
});

function updateQuote() {
  fetch(options.APIQuoteOfTheDayApiHost)
    .then(response => response.json())
    .then(data => {
      if (data[0]) {
        const quoteObj = {
          quote: data[0].content,
          quoteBy: data[0].author,
          quoteDate: new Date().toDateString()
        };
        chrome.storage.local.set({ quoteObj });
        chrome.runtime.sendMessage({
          action: 'updateQuote',
          quote: quoteObj
        });
      }
    })
    .catch(error => console.error('Error fetching quote:', error));
}

function updateDateTime() {
  const now = new Date();
  const dateTimeString = now.toDateString() + ', ' +
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  chrome.runtime.sendMessage({
    action: 'updateDateTime',
    dateTime: dateTimeString,
    version: options.version
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startFocusTimer") {
    startFocusTimer(request.timerData);
  } else if (request.action === "endFocusTimer") {
    endFocusTimer(request.timerId);
  }
});

function startFocusTimer(timerData) {
  // Implement focus timer start logic
  console.log("Starting focus timer:", timerData);
  // You might want to set up an alarm for the timer here
}

function endFocusTimer(timerId) {
  // Implement focus timer end logic
  console.log("Ending focus timer:", timerId);
  setTaskEndTime(timerId);
  // Clear any alarms associated with this timer
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "newProductivityTab.html" });
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url === "chrome://newtab/") {
    chrome.tabs.update(tabId, { url: "newProductivityTab.html" });
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    chrome.storage.local.get("settings", function(result) {
      sendResponse(result.settings);
    });
    return true; // Indicates that the response is asynchronous
  }
});

// Optional: Implement periodic checks or updates if needed
function periodicUpdate() {
  // Perform any periodic tasks here
}

// Set up periodic updates if needed
// setInterval(periodicUpdate, 60000); // Every minute, for example
