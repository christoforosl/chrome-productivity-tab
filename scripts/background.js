/* jshint esversion: 6 */
// note: JQuery is not available to this backround js script

chrome.runtime.onInstalled.addListener(function () {
  console.log("onInstalled");

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchQuote") {
    const quoteUrl = 'https://stoic.tekloon.net/stoic-quote';
    console.log('fetching quote from:', quoteUrl);
    fetch(quoteUrl)
      .then(response => response.json())
      .then(data => {

        sendResponse({success: true, data: data});
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({success: false, error: error.toString()});
      });
    return true;  // Will respond asynchronously
  }
});
