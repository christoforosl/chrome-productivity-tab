/* jshint esversion: 6 */
// note: JQuery is not available to this backround js script

chrome.tabs.onRemoved.addListener(function () {
  if (curentDateTimeTimer) {
    console.log("Clearing Interval");
    clearInterval(curentDateTimeTimer);
  }
});

chrome.runtime.onInstalled.addListener(function () {
  console.log("onInstalled");

});
