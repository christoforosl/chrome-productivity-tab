/* jshint esversion: 6 */ 
// note: JQuery is not available to this backround js script
var curentDateTimeTimer = null;
var settings;

const CALL_QUOTE_HEADERS = new Headers({
  "accept": "application/json",
  "useQueryString": true
});

const CALL_PREXELS_HEADERS = new Headers({
  "accept": "application/json",
  "Authorization": options.pexelsApiKey
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
  var t = d.toDateString() + ', ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  var greeting;

  if (d.getHours() > 0 && d.getHours() <= 12) {
    greeting = "Good Morning, ";
  } else if (d.getHours() > 12 && d.getHours() <= 19) {
    greeting = "Good Afternoon, " ;
  } else {
    greeting = "Good Evening, " ;
  }
  greeting = greeting + (settings.greetingName || "[Specify Name In Settings]");
  $html('btnSetWorkItem',  options.whatShallWeWorkOnQuestionText);
  $html("currentTime", t );
  $html("greeting", greeting );
  
}

function initBackground() {

  //console.log("init backround");
  if(!settings) {
    console.log("loading settings");
    settings = JSON.parse( window.localStorage.getItem("settings") ) || {"imageKeywords":"nature"};
    if(!settings){
      settings = {};
    }
  }
  setBackroundImage();
  noFocusTimerUI() ;
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

function setBackroundImage(inGetImageCall) {

  if (window.jQuery) {
    var getImageCall = inGetImageCall || settings.imageKeywords||"nature,forest,mountain,water";
    $(document).ready(function(){
      var myRequest = new Request(options.pexelsApiQuery+getImageCall, {
        "method": "GET",
        "headers": CALL_PREXELS_HEADERS,
        "mode": 'cors'
      });
    
      fetch(myRequest)
        .then(response => response.json())
        .then(contents => {
          var photo = contents.photos[0];
          var photographer = photo.photographer;
          var photographer_url = photo.photographer_url;
          var src = photo.src;
          
          localStorage.setItem('nextPhotoPage',contents.next_page);
          $("html").css("background-image", "url('"  + src.landscape +"')");
          $html("photographer", 'Photo By <a style="color:white" target="_new" href="'+photographer_url+'">'+photographer+'</a>');
    
        });

      
    });
  }
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
if($e("btnShowSettings")) {
  $('#backroundImageSearchTerms').val(settings.imageKeywords);
  $('#greetingName').val(settings.greetingName);
  
  $e("btnShowSettings").addEventListener("click", function(){

  });
}

if($e("btnChangeWallpaper")) {
  $e("btnChangeWallpaper").addEventListener("click", function(){
    var nextPhotoPage = localStorage.getItem('nextPhotoPage');
    setBackroundImage(nextPhotoPage);
  });
}
