export const options = {
  "version":"1.11",
  "APIDBHostTasks": "https://chrometimertasks-879e.restdb.io/rest/chrome-timer-tasks",
  "APIDBHostPauses": "https://chrometimertasks-879e.restdb.io/rest/task-pause",
  "APIQuoteOfTheDayApiHost": "https://api.quotable.io/quotes/random",
  "focusTimerAlarmName": "focusTimerAlarm",
  "username": "christoforosl@netu.com.cy",
  "greetingNameFontSizePixels": 70,
  "whatShallWeWorkOnQuestionText": "What is our focus now?",
  "whatShallWeWorkOnQuestionTextFontSizePixels": 50,
  "imageApiKey":"SidraH8wDMI92Y_bXxn2Tg1PLJWt24RI310YYUHJ1xY",
  "imageApiQuery":"https://api.unsplash.com/photos/random?query="
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLanguage") {
    sendResponse({ language: chrome.i18n.getUILanguage() });
  }
});

export function getLanguage() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.navigator) {
      resolve(window.navigator.userLanguage || window.navigator.language || 'en');
    } else {
      chrome.runtime.sendMessage({ action: "getLanguage" }, (response) => {
        resolve(response.language);
      });
    }
  });
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

chrome.identity.getProfileUserInfo(function (userInfo) {
  if (!userInfo.email) {
    console.log("User email is not available. This extension requires a logged in user, in order to create your database");

    // Create and show a notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon16.png',
      title: 'Login Required',
      message: 'This extension requires a logged in user to create your database. Please log in to your Google account.',
      priority: 2
    });
  }
});

// Optional: Handle notification click
chrome.notifications.onClicked.addListener(function(notificationId) {
  // You can add code here to handle what happens when the user clicks the notification
  console.log('Notification clicked');
  // For example, you might want to open a login page or your extension's options page
});
