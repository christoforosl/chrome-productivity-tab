/* jshint esversion: 6 */ 
// note: JQuery is not available to this backround js script
var curentDateTimeTimer = null;
var settings;

const CALL_QUOTE_HEADERS = new Headers({
  "accept": "application/json",
  "useQueryString": true
});

const CALL_IMAGE_API_HEADERS = new Headers({
  "accept": "application/json",
  "Authorization": "Client-ID " + options.imageApiKey
});


function setCurrentDateTimeTimer() {

  curentDateTimeTimer = setInterval(setCurrentDateTime, 1000);

}

/**
 * returns true if quote is older than 24 hours
 * @param {long} quoteDate: the quote's set time, in epoch seconds
 */
function getQuoteIsOld(quoteDate) {
  if(!quoteDate)return true;
  var dt = new Date().toDateString();
  return dt !== quoteDate;

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
      var dt = new Date().toDateString();
      var quoteObj = { "quote": quote, "quoteBy": author, "quoteDate": dt };
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
  checkBackroundImageOnLoad();
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

function checkBackroundImageOnLoad() {

  if (window.jQuery) {
    $(document).ready(function(){
      var currentBackroundImage = JSON.parse(localStorage.getItem('currentBackroundImage')) || {};
      var setImageFromStorage = currentBackroundImage.src && (currentBackroundImage.setDate === new Date().toDateString());
      if ( setImageFromStorage ) {
        setBackroundImageFromStorage(currentBackroundImage);
      } else {
        fetchImageFromApiService();
      }
    });
  }
}

function fetchImageFromApiService() {

  var imageApiUrl = options.imageApiQuery + settings.imageKeywords;
  var myRequest = new Request(imageApiUrl, {
    "method": "GET",
    "headers": CALL_IMAGE_API_HEADERS,
    "mode": 'cors'
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {
      var currentBackroundImage = {};
      var photo = contents;
      currentBackroundImage.photographer = photo.user.name;
      currentBackroundImage.photographerUrl = photo.user.portfolio_url;
      currentBackroundImage.src = photo.urls.full;
      //currentBackroundImage.nextPhotoPage = contents.next_page;
      currentBackroundImage.setDate = new Date().toDateString();
      currentBackroundImage.location = photo.location ? photo.location.title : '';
      currentBackroundImage.description = photo.alt_description ? photo.alt_description : photo.description;
      
      localStorage.setItem('currentBackroundImage', JSON.stringify(currentBackroundImage));
      setBackroundImageFromStorage(currentBackroundImage);
    });
  
}

function arrayOfItems() {

	var finalArr = [];

	for (var i = 0; i < arguments.length; i++) {
    if(arguments[i]) {
      finalArr.push(arguments[i]);
    }
	}
	return finalArr.join(',');
}

function setBackroundImageFromStorage(currentBackroundImage) {
  $("html").css("background-image", "url('"  + currentBackroundImage.src +"')");
  var photoInfo = 'Photo By ';
  if (currentBackroundImage.photographerUrl) {
    photoInfo += '<a style="color:white" target="_new" href="'+currentBackroundImage.photographerUrl+'">'+currentBackroundImage.photographer+'</a>';
  } else {
    photoInfo += currentBackroundImage.photographer;
  }
  photoInfo += (currentBackroundImage.location ? ', ' + currentBackroundImage.location : '');
  $('#photoinfo').attr('title', currentBackroundImage.description);
  $html("photographer", photoInfo);
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
  
  
}

if($e("btnChangeWallpaper")) {
  $e("btnChangeWallpaper").addEventListener("click", function(){
    var currentBackroundImage = JSON.parse(localStorage.getItem('currentBackroundImage')) || {};
    localStorage.removeItem('currentBackroundImage');
    fetchImageFromApiService();

  });
}
