// note: JQuery is not available to this backround js script
var curentDateTimeTimer = null;

const CALL_QUOTE_HEADERS = new Headers({
  "accept": "application/json",
  "useQueryString": true
});

function setCurrentDateTimeTimer() {

  curentDateTimeTimer = setInterval(setCurrentDateTime, 1000);

}

/**
 * returns true if quote is older than 24 hours
 * @param {long} quoteTime: the quote's set time, in epoch seconds
 */
function getQuoteIsOld(quoteTime) {
  if(!quoteTime)return true;
  var elapsedSecs = (new Date().getTime() - parseInt(quoteTime)) / 1000;
  var hours = Math.floor(elapsedSecs / 3600);
  //console.log("quote is "+ hours + " hours old");
  return hours > 24 ;

} 

function setQuote() {

  chrome.storage.local.get(["quote","quoteDate","quoteBy"],function(value) {
    
    var oldq = getQuoteIsOld(value ? value.quoteDate: null);
    //console.log('oldq xxx' +  oldq);
    if (!value || value.length ===0  || value.quote==='' || oldq) {
      setQuoteFromService();
    } else {
      console.log('Set quote from storage :-)' );
      $html("quote", '\"' + value.quote + '\"');
      $html("quoteBy", value.quoteBy);
    } 
  });
          
}

function setQuoteFromService() {
  
  var myRequest = new Request(options.APIQuoteOfTheDayApiHost, {
    "method": "GET",
    "headers": CALL_QUOTE_HEADERS,
    "mode": 'cors',
    "cache": 'default'
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      var quote = contents.contents.quotes[0].quote;
      var author = contents.contents.quotes[0].author;
      $html("quote", '\"' + quote + '\"');
      $html("quoteBy", author);
      var quoteObj = { "quote": quote, "quoteBy": author, "quoteDate": new Date().getTime() };
      chrome.storage.local.set(quoteObj, function () {
        console.log('set quote in storage' + JSON.stringify(quoteObj));
      });

    });
}

function setCurrentDateTime() {
  var d = new Date();
  var t = d.toDateString() + ', ' + d.toLocaleTimeString();
  var greeting;

  if (d.getHours() > 0 && d.getHours() <= 12) {
    greeting = "Good Morning " + options.greetingName;
  } else if (d.getHours() > 12 && d.getHours() <= 19) {
    greeting = "Good Afternoon " + options.greetingName;
  } else {
    greeting = "Good Evening " + options.greetingName;
  }
  
  $html('btnSetWorkItem',  options.whatShallWeWorkOnQuestionText);
  $html("currentTime", t );
  $html("greeting", greeting );
  $html("currentFocus", options.currentFocus);

}

function initBackground() {
  console.log("init backround");
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

chrome.runtime.onInstalled.addListener(function () {
  initBackground();
});

initBackground();

if($e("btnEndTimer")) {
  $e("btnEndTimer").addEventListener("click", endFocusTimer);
}
if($e("btnSetCurrentFocusAndStartTimer")) {
  $e("btnSetCurrentFocusAndStartTimer").addEventListener("click", SetCurrentFocusAndStartTimer);
}


