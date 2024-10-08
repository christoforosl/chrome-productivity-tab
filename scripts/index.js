import { settings, options, $html, $e } from "./common.js";
import { checkForActiveFocusTimer,setCurrentFocusAndStartTimer } from "./newTab.js";
import { setQuote } from "./getQuote.js";
import { checkBackroundImageOnLoad, fetchImageFromApiService } from "./backgroundImage.js";

let curentDateTimeTimer = null;

function setCurrentDateTimeTimer() {
    curentDateTimeTimer = setInterval(setCurrentDateTime, 1000);
}

chrome.tabs.onRemoved.addListener(function () {
  if (curentDateTimeTimer) {
    console.log("Clearing Interval");
    clearInterval(curentDateTimeTimer);
  }
});

function loadSettings() {

    if (Object.keys(settings).length === 0) {
        const parsed = JSON.parse(window.localStorage.getItem("settings")) || { imageKeywords: "nature" };
        Object.keys(parsed).forEach((k) => (settings[k] = parsed[k]));
    }
}

function setCurrentDateTime() {
    const d = new Date();
    const centeredText = d.toDateString() + ", " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    let greeting;

    if (d.getHours() > 0 && d.getHours() <= 12) {
        greeting = "Good Morning, ";
    } else if (d.getHours() > 12 && d.getHours() <= 19) {
        greeting = "Good Afternoon, ";
    } else {
        greeting = "Good Evening, ";
    }
    greeting = greeting + (settings.greetingName || "[Specify Name In Settings]");
    $html("btnSetWorkItem", options.whatShallWeWorkOnQuestionText);
    $html("currentTime", `${centeredText}<br>Solid Focus, version ${options.version}<br>${options.profileUserEmail} [Id:${options.profileUserId}]`);
    $html("greeting", greeting);
}

$(document).ready(() => {
    loadSettings();
    chrome.identity.getProfileUserInfo(function (userInfo) {

        if (userInfo.email) {
            options.profileUserEmail = userInfo.email;
            options.profileUserId = userInfo.id;

            checkBackroundImageOnLoad();
            checkForActiveFocusTimer();
            setCurrentDateTimeTimer();
            setQuote();

            if ($e("btnSetCurrentFocusAndStartTimer")) {
                $e("btnSetCurrentFocusAndStartTimer").addEventListener("click", setCurrentFocusAndStartTimer);

                $e("frmEnterTaskName").addEventListener(
                    "submit",
                    function (event) {
                        if ($e("frmEnterTaskName").checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add("was-validated");
                    },
                    false
                );
            }
            if ($e("btnShowSettings")) {
                $("#backroundImageSearchTerms").val(settings.imageKeywords);
                $("#greetingName").val(settings.greetingName);
            }

            if ($e("btnChangeWallpaper")) {
                $e("btnChangeWallpaper").addEventListener("click", function () {
                    localStorage.removeItem("currentBackroundImage");
                    fetchImageFromApiService();
                });
            }
        } else {
            console.log("User info not available");
        }
    });
});


