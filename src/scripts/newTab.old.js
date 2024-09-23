import { options, $e, $html, getLanguage } from './common.js';
import { $e, $html } from './dom.ts';
import {
  SetCurrentFocusAndStartTimer,
  checkForActiveFocusTimer,
  togglePauseStatus,
  getFocusHistoryData,
  operateFormatter,
  getElapsedTime,
  convertUTCDateToLocalDate,
  showTimerData,
  updateTimerService,
  setTaskEndTime,
  noFocusTimerUI,
  withFocusTimerUI
} from './backgroundFocusTimer.js';

let currentDateTimeTimer = null;

document.addEventListener('DOMContentLoaded', function() {
  initializeNewTabPage();
});

function initializeNewTabPage() {
  checkBackroundImageOnLoad();
  checkForActiveFocusTimer();
  setCurrentDateTimeTimer();
  setQuote();
  initializeEventHandlers();
}

function setCurrentDateTimeTimer() {
  currentDateTimeTimer = setInterval(setCurrentDateTime, 1000);
}

function setCurrentDateTime() {
  const d = new Date();
  const centeredText = d.toDateString() + ", " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  let greeting;

  if (d.getHours() >= 5 && d.getHours() < 12) {
    greeting = "Good Morning, ";
  } else if (d.getHours() >= 12 && d.getHours() < 18) {
    greeting = "Good Afternoon, ";
  } else {
    greeting = "Good Evening, ";
  }

  chrome.storage.local.get("settings", function (result) {
    let settings = result.settings || {};
    greeting += (settings.greetingName || "[Specify Name In Settings]");
    $html("btnSetWorkItem", options.whatShallWeWorkOnQuestionText);
    $html("currentTime", centeredText + "<br>" + "Solid Focus, version " + options.version);
    $html("greeting", greeting);
  });
}

function setQuote() {
  chrome.storage.local.get(["quote", "quoteDate", "quoteBy"], function (value) {
    const oldq = getQuoteIsOld(value ? value.quoteDate : null);

    if (!value || value.length === 0 || value.quote === "" || oldq) {
      setQuoteFromService();
    } else {
      $html("quote", '"' + value.quote + '"');
      $html("quoteBy", value.quoteBy);
    }
  });
}

function setQuoteFromService() {
  fetch(options.APIQuoteOfTheDayApiHost)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      return response.json();
    })
    .then(contents => {
      if (contents[0]) {
        const quote = contents[0].content;
        const author = contents[0].author;
        $html("quote", `"${quote}"`);
        $html("quoteBy", author);
        const dt = new Date().toDateString();
        const quoteObj = { quote: quote, quoteBy: author, quoteDate: dt };
        chrome.storage.local.set(quoteObj, function () {
          console.log("Set quote in storage: " + JSON.stringify(quoteObj));
        });
      }
    })
    .catch(error => {
      console.warn("Fetch error:", error);
      $html("quote", "Failed to fetch quote.");
      $html("quoteBy", "");
    });
}

function getQuoteIsOld(quoteDate) {
  if (!quoteDate) return true;
  const dt = new Date().toDateString();
  return dt !== quoteDate;
}

function checkBackroundImageOnLoad() {
  const currentBackroundImage = JSON.parse(localStorage.getItem("currentBackroundImage")) || {};

  chrome.storage.local.get("settings", function (result) {
    let settings = result.settings || {};
    const setImageFromStorage = currentBackroundImage.src &&
      !isOlderThanXDays(new Date(currentBackroundImage.setDate), parseInt(settings.daysToKeepImage) || 30);

    if (setImageFromStorage) {
      setBackroundImageFromStorage(currentBackroundImage);
    } else {
      fetchImageFromApiService();
    }
  });
}

function setBackroundImageFromStorage(currentBackroundImage) {
  document.documentElement.style.backgroundImage = `url('${currentBackroundImage.src}')`;
  let photoInfo = "Photo By ";
  if (currentBackroundImage.photographerUrl) {
    photoInfo += `<a style="color:white" target="_new" href="${currentBackroundImage.photographerUrl}">${currentBackroundImage.photographer}</a>`;
  } else {
    photoInfo += currentBackroundImage.photographer;
  }
  photoInfo += currentBackroundImage.location ? ", " + currentBackroundImage.location : "";
  $e("photoinfo").setAttribute("title", currentBackroundImage.description);
  $html("photographer", photoInfo);
}

function fetchImageFromApiService() {
  chrome.storage.local.get("settings", function (result) {
    let settings = result.settings || {};
    const imageApiUrl = options.imageApiQuery + (settings.imageKeywords || "nature");

    fetch(imageApiUrl, {
      headers: {
        'Authorization': 'Client-ID ' + options.imageApiKey
      }
    })
    .then(response => response.json())
    .then(photo => {
      const currentBackroundImage = {
        photographer: photo.user.name,
        photographerUrl: photo.user.portfolio_url,
        src: photo.urls.full,
        setDate: new Date().toDateString(),
        location: photo.location ? photo.location.title : "",
        description: photo.alt_description || photo.description
      };

      localStorage.setItem("currentBackroundImage", JSON.stringify(currentBackroundImage));
      setBackroundImageFromStorage(currentBackroundImage);
    })
    .catch(error => {
      console.error("Failed to fetch image from API, using random image", error);
      // Implement fallback to random image logic here
    });
  });
}

function initializeEventHandlers() {
  if ($e("btnSetCurrentFocusAndStartTimer")) {
    $e("btnSetCurrentFocusAndStartTimer").addEventListener("click", SetCurrentFocusAndStartTimer);
  }

  if ($e("btnShowSettings")) {
    $e("btnShowSettings").addEventListener("click", function () {
      $("#settingsModal").modal("show");
    });
  }

  if ($e("btnSaveSettings")) {
    $e("btnSaveSettings").addEventListener("click", function () {
      if (!$("#greetingName").val()) {
        return;
      }

      let tmp = $("#backroundImageSearchTerms").val() || "nature";
      chrome.storage.local.get("settings", function (result) {
        let settings = result.settings || {};
        if (settings.imageKeywords !== tmp) {
          settings.imageKeywords = tmp;
          fetchImageFromApiService();
        }

        settings.greetingName = $("#greetingName").val();
        settings.daysToKeepImage = $("#daysToKeepImage").val();
        chrome.storage.local.set({"settings" : settings}, function(){
          console.log('Settings saved');
          $("#settingsModal").modal("hide");
        });
      });
    });
  }

  if ($e("btnShowHistory")) {
    $e("btnShowHistory").addEventListener("click", function () {
      getFocusHistoryData(function (data) {
        const $table = $("#tblFocusTimerHistory");
        data.forEach(function (obj) {
          getLanguage().then((language) => {
            obj.endDateTime = obj.endTime ? new Date(obj.endTime).toLocaleString(language) : "";
            obj.startDateTime = obj.startTime ? new Date(obj.startTime).toLocaleString(language) : "";
            obj.workHours = getElapsedTime(obj.startTime, obj.endTime);
          });
        });

        $table.bootstrapTable({ data: data });
        $table.bootstrapTable("load", data);
        $("#listTimersModal").modal("show");
      });
    });
  }

  if ($e("btnSaveFocusData")) {
    $e("btnSaveFocusData").addEventListener("click", function () {
      const timerRecord = {
        timerId: $("#timerId").val(),
        _id: $("#timerId").val(),
        startTime: new Date($("#startDateTime").val()).getTime(),
        focusTaskName: $("#focusTaskName").val()
      };

      if ($("#endDateTime").val()) {
        timerRecord.endTime = new Date($("#endDateTime").val()).getTime();
      }

      updateTimerService(timerRecord);

      const mode = $("#modal-mode").val();
      getLanguage().then((language) => {
        if (mode === "table-edit") {
          const $table = $("#tblFocusTimerHistory");
          $table.bootstrapTable("updateByUniqueId", {
            id: timerRecord.timerId,
            row: {
              focusTaskName: timerRecord.focusTaskName,
              endDateTime: timerRecord.endTime ? new Date(timerRecord.endTime).toLocaleString(language) : "",
              startDateTime: timerRecord.startTime ? new Date(timerRecord.startTime).toLocaleString(language) : "",
              workHours: getElapsedTime(timerRecord.startTime, timerRecord.endTime),
            },
          });
        } else if (mode === "stop-timer-edit") {
          localStorage.removeItem("focusTimer");
          noFocusTimerUI();
        }

        $("#dateModal").modal("hide");
      });
    });
  }

  // Add more event handlers as needed
}

function isOlderThanXDays(date, days) {
  const now = new Date();
  const diffTime = now - date.getTime();
  const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
  return diffDays > days;
}

// Make operateFormatter available globally for the table
window.operateFormatter = operateFormatter;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateDateTime") {
    $html("currentTime", request.dateTime + "<br>" + "Solid Focus, version " + request.version);
  } else if (request.action === "updateQuote") {
    $html("quote", `"${request.quote.quote}"`);
    $html("quoteBy", request.quote.quoteBy);
  }
});
