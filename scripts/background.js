/* jshint esversion: 6 */ 
// note: JQuery is not available to this backround js script
var curentDateTimeTimer = null;
var settings;
const randomImages = [
  {title:"Three Men Standing Near Waterfalls", url:"https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&dpr=3"},
  {title:"blogenium", url:"https://www.blogenium.com/wp-content/uploads/2019/08/blogenium-nature-wallpapers-1-1024x576.jpg"},
  {title:"1586298", url:"https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&dpr=1"},
  {title:"3244513", url:"https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&dpr=1"},
  {title:"3512848", url:"https://images.pexels.com/photos/3512848/pexels-photo-3512848.jpeg?auto=compress&cs=tinysrgb&dpr=1"},
  {title:"1144687", url:"https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg?auto=compress&cs=tinysrgb&dpr=1"},
  {title:"1428277", url:"https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&dpr=1"},
  {title:"2754200", url:"https://images.pexels.com/photos/2754200/pexels-photo-2754200.jpeg?auto=compress&cs=tinysrgb&dpr=1"},
  {title:"1612559", url:"https://images.pexels.com/photos/1612559/pexels-photo-1612559.jpeg?auto=compress&cs=tinysrgb"},
  {title:"Grey Coupe on Road", url:"https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg?cs=srgb&dl=pexels-sourav-mishra-3136673.jpg&fm=jpg"},
  {title:"Huangpu Qu, China", url:"https://images.pexels.com/photos/842654/pexels-photo-842654.jpeg?cs=srgb&dl=pexels-zhang-kaiyv-842654.jpg&fm=jpg"},
  {title:"3225517", url:"https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?cs=srgb&dl=pexels-michael-block-3225517.jpg&fm=jpg"},
  {title:"Batang Kali, Malaysia", url:"https://images.pexels.com/photos/1173777/pexels-photo-1173777.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"},
  {title:"Susan Yin", url:"https://miro.medium.com/max/2400/1*Yp19IQrDozHRZMG1OYxAOQ.jpeg"}

];

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
      
      var photo = contents;
      var currentBackroundImage = {};
      currentBackroundImage.photographer = photo.user.name;
      currentBackroundImage.photographerUrl = photo.user.portfolio_url;
      currentBackroundImage.src = photo.urls.full;
      currentBackroundImage.setDate = new Date().toDateString();
      currentBackroundImage.location = photo.location ? photo.location.title : '';
      currentBackroundImage.description = photo.alt_description ? photo.alt_description : photo.description;
     
      localStorage.setItem('currentBackroundImage', JSON.stringify(currentBackroundImage));
      setBackroundImageFromStorage(currentBackroundImage);

    })
    .catch(() =>{
      const currentImageIndexParsed =  isPositiveInteger(localStorage.getItem('currentBackroundImageIndex')) 
            ? parseInt(localStorage.getItem('currentBackroundImageIndex')) + 1 
            : 0;
      
      const currentImageIndex = currentImageIndexParsed > randomImages.length-1 ? 0 :currentImageIndexParsed ;

      var currentBackroundImage = {};
      currentBackroundImage.photographer = "Unknown";
      currentBackroundImage.src = randomImages[currentImageIndex].url;
      currentBackroundImage.setDate = new Date().toDateString();
      currentBackroundImage.location =  `${randomImages[currentImageIndex].title}, Image index: ${currentImageIndex}`;
      currentBackroundImage.description = '';
      
      localStorage.setItem('currentBackroundImage', JSON.stringify(currentBackroundImage));
      localStorage.setItem('currentBackroundImageIndex', currentImageIndex.toString());
      setBackroundImageFromStorage(currentBackroundImage);

    });
    
}

function isPositiveInteger(n) {
  return n >>> 0 === parseFloat(n);
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
if($e("btnPauseFocusTimer")) {
  $e("btnPauseFocusTimer").addEventListener("click", togglePauseStatus);
}



if($e("btnSetCurrentFocusAndStartTimer")) {
  $e("btnSetCurrentFocusAndStartTimer").addEventListener("click", SetCurrentFocusAndStartTimer);

  $e("frmEnterTaskName").addEventListener('submit', function(event) {
    if ($e("frmEnterTaskName").checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);

}
if($e("btnShowSettings")) {
  $('#backroundImageSearchTerms').val(settings.imageKeywords);
  $('#greetingName').val(settings.greetingName);
  
  
}

if($e("btnChangeWallpaper")) {
  $e("btnChangeWallpaper").addEventListener("click", function(){
    
    localStorage.removeItem('currentBackroundImage');
    fetchImageFromApiService();

  });
}
