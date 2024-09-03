/* jshint esversion: 6 */
// note: JQuery is not available to this backround js script
let curentDateTimeTimer = null;
let settings;
const randomImages = [
  { title: "Three Men Standing Near Waterfalls", url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&dpr=3" },
  { title: "Body of Water Near Brown Sand", url: "https://images.pexels.com/photos/7999461/pexels-photo-7999461.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Brown Mountain", url: "https://images.pexels.com/photos/3308741/pexels-photo-3308741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Porto, Portugal", url: "https://images.pexels.com/photos/2549156/pexels-photo-2549156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Yosemite Valley, United States", url: "https://images.pexels.com/photos/1571108/pexels-photo-1571108.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Torres del Paine, Chile", url: "https://images.pexels.com/photos/3739624/pexels-photo-3739624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Florence, Italy", url: "https://images.pexels.com/photos/4015473/pexels-photo-4015473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Hlavní město Praha, Czechia", url: "https://images.pexels.com/photos/783739/pexels-photo-783739.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "New York", url: "https://images.pexels.com/photos/3875821/pexels-photo-3875821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Stop Wishing...", url: "https://images.pexels.com/photos/2045600/pexels-photo-2045600.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Huangpu Qu, China", url: "https://images.pexels.com/photos/842654/pexels-photo-842654.jpeg?cs=srgb&dl=pexels-zhang-kaiyv-842654.jpg&fm=jpg" },
  { title: "Guatemala", url: "https://images.pexels.com/photos/2661176/pexels-photo-2661176.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { title: "Batang Kali, Malaysia", url: "https://images.pexels.com/photos/1173777/pexels-photo-1173777.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" },
  { title: "Maldives", url: "https://images.pexels.com/photos/2775196/pexels-photo-2775196.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { "title": "Cyprus coast", "url": "https://images.pexels.com/photos/6860099/pexels-photo-6860099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { "title": "Morskie Oko, Sea Eye, Tatra National Park, Poland", "url": "https://st3.depositphotos.com/14847044/i/600/depositphotos_178404276-stock-photo-view-rocky-shore-stones-water.jpg" },
  { "title": "Serpentine", "url": "https://st4.depositphotos.com/18241762/i/600/depositphotos_202584372-stock-photo-serpentine.jpg" },
  { "title": "Green Fields Near Brown Mountain", "url": "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  { "photographer": "Brett Sayles", "title": "White Mountains Under White and Gray Sky", "url": "https://images.pexels.com/photos/1701188/pexels-photo-1701188.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" },
  {
    "photographer": "Olga Lioncat",
    "title": "Cathedral and Ferris wheel in London",
    "url": "https://images.pexels.com/photos/7245352/pexels-photo-7245352.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "photographer": "Rachel Claire",
    "title": "Rome",
    "url": "https://images.pexels.com/photos/4819654/pexels-photo-4819654.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
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
  if (!quoteDate) return true;
  const dt = new Date().toDateString();
  return dt !== quoteDate;

}

function setQuote() {

  chrome.storage.local.get(["quote", "quoteDate", "quoteBy"], function (value) {

    const oldq = getQuoteIsOld(value ? value.quoteDate : null);

    if (!value || value.length === 0 || value.quote === '' || oldq) {
      setQuoteFromService();
    } else {
      console.log('Set quote from storage :-)');
      $html("quote", '\"' + value.quote + '\"');
      $html("quoteBy", value.quoteBy);
    }
  });

}


function setQuoteFromService() {

  const myRequest = new Request(options.APIQuoteOfTheDayApiHost, {
    "method": "GET",
    "headers": CALL_QUOTE_HEADERS,
    "mode": 'cors',
    "cache": 'default'
  });

  fetch(myRequest)
    .then(response => {
      if (!response.ok) {
        console.log('QuoteFromService:Network response was not ok ' + response?.statusText);
        $html("quote", `Failed to fetch quote: status:  ${response?.status} ${response?.statusText}`);
        $html("quoteBy", '');
        return {};
      }
      return response.json();
    })
    .then(contents => {

      if(contents[0]) {
        const quote = contents[0].content;
        const author =contents[0].author;
        $html("quote", `"${quote}"`);
        $html("quoteBy", author);
        const dt = new Date().toDateString();
        const quoteObj = { "quote": quote, "quoteBy": author, "quoteDate": dt };
        chrome.storage.local.set(quoteObj, function () {
          console.log('set quote in storage' + JSON.stringify(quoteObj));
        });
      }

    }).catch(error => {
      console.warn('Fetch error:', error);
      $html("quote", 'Failed to fetch quote.');
      $html("quoteBy", '');
    });

}

function setCurrentDateTime() {
  const d = new Date();
  const centeredText = d.toDateString() + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let greeting;

  if (d.getHours() > 0 && d.getHours() <= 12) {
    greeting = "Good Morning, ";
  } else if (d.getHours() > 12 && d.getHours() <= 19) {
    greeting = "Good Afternoon, ";
  } else {
    greeting = "Good Evening, ";
  }
  greeting = greeting + (settings.greetingName || "[Specify Name In Settings]");
  $html('btnSetWorkItem', options.whatShallWeWorkOnQuestionText);
  $html("currentTime", centeredText + "<br>" + "Solid Focus, version " + options.version);
  $html("greeting", greeting);

}

function pageLoadActions() {

  if (!settings) {

    settings = JSON.parse(window.localStorage.getItem("settings")) || { "imageKeywords": "nature" };
    if (!settings) {
      settings = {};
    }
  }
  checkBackroundImageOnLoad();
  noFocusTimerUI();
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
    $(document).ready(function () {
      const currentBackroundImage = JSON.parse(localStorage.getItem('currentBackroundImage')) || {};

      const setImageFromStorage = currentBackroundImage.src && !( isOlderThanXDays( new Date(currentBackroundImage.setDate) , ( parseInt(settings.daysToKeepImage)??30)));
      if (setImageFromStorage) {
        setBackroundImageFromStorage(currentBackroundImage);
      } else {
        fetchImageFromApiService();
      }
    });
  }
}

function fetchImageFromApiService() {

  const imageApiUrl = options.imageApiQuery + settings.imageKeywords;
  const myRequest = new Request(imageApiUrl, {
    "method": "GET",
    "headers": CALL_IMAGE_API_HEADERS,
    "mode": 'cors'
  });

  fetch(myRequest)
    .then(response => response.json())
    .then(contents => {

      const photo = contents;
      const currentBackroundImage = {};
      currentBackroundImage.photographer = photo.user.name;
      currentBackroundImage.photographerUrl = photo.user.portfolio_url;
      currentBackroundImage.src = photo.urls.full;
      currentBackroundImage.setDate = new Date().toDateString();
      currentBackroundImage.location = photo.location ? photo.location.title : '';
      currentBackroundImage.description = photo.alt_description ? photo.alt_description : photo.description;

      localStorage.setItem('currentBackroundImage', JSON.stringify(currentBackroundImage));
      setBackroundImageFromStorage(currentBackroundImage);

    })
    .catch(() => {
      console.error('Failed to fetch image from API, using random image');
      const currentImageIndexParsed = isPositiveInteger(localStorage.getItem('currentBackroundImageIndex'))
        ? parseInt(localStorage.getItem('currentBackroundImageIndex')) + 1
        : 0;

      const currentImageIndex = currentImageIndexParsed > randomImages.length - 1 ? 0 : currentImageIndexParsed;

      const currentBackroundImage = {};
      currentBackroundImage.photographer = "Unknown";
      currentBackroundImage.src = randomImages[currentImageIndex].url;
      currentBackroundImage.photographer = randomImages[currentImageIndex].photographer;
      currentBackroundImage.setDate = new Date().toDateString();
      currentBackroundImage.location = `${randomImages[currentImageIndex].title}, Image index: ${currentImageIndex}`;
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

  const finalArr = [];

  for (const argument of arguments) {
    if (argument) {
      finalArr.push(argument);
    }
  }
  return finalArr.join(',');
}

function setBackroundImageFromStorage(currentBackroundImage) {
  $("html").css("background-image", "url('" + currentBackroundImage.src + "')");
  let photoInfo = 'Photo By ';
  if (currentBackroundImage.photographerUrl) {
    photoInfo += '<a style="color:white" target="_new" href="' + currentBackroundImage.photographerUrl + '">' + currentBackroundImage.photographer + '</a>';
  } else {
    photoInfo += currentBackroundImage.photographer;
  }
  photoInfo += (currentBackroundImage.location ? ', ' + currentBackroundImage.location : '');
  $('#photoinfo').attr('title', currentBackroundImage.description);
  $html("photographer", photoInfo);
}

chrome.runtime.onInstalled.addListener(function () {
  pageLoadActions();
});

pageLoadActions();

if ($e("btnSetCurrentFocusAndStartTimer")) {
  $e("btnSetCurrentFocusAndStartTimer").addEventListener("click", SetCurrentFocusAndStartTimer);

  $e("frmEnterTaskName").addEventListener('submit', function (event) {
    if ($e("frmEnterTaskName").checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);

}
if ($e("btnShowSettings")) {
  $('#backroundImageSearchTerms').val(settings.imageKeywords);
  $('#greetingName').val(settings.greetingName);
}

if ($e("btnChangeWallpaper")) {
  $e("btnChangeWallpaper").addEventListener("click", function () {

    localStorage.removeItem('currentBackroundImage');
    fetchImageFromApiService();

  });
}


// an array of epoch dates indicating the last 10 times the user was active.
// this is a way to detect inactivity and register potential end time of focus task
let lastActiveTime = 0;
let previousActiveTime = 0;
let potentialEndTimeDueToInactivity = 0;

const inactivityTime = function () {
  let time;
  window.onload = resetTimer;
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

  events.forEach(function (name) {
    document.addEventListener(name, resetTimer, true);
  });

  function logout() {
    previousActiveTime = lastActiveTime;
    lastActiveTime = new Date().getTime();

    if (lastActiveTime - previousActiveTime > 30 * 60 * 1000) {
      potentialEndTimeDueToInactivity = previousActiveTime;
      $('#potentialEndTimeDueToInactivity').html(new Date(potentialEndTimeDueToInactivity).toDateString());
    } else {
      potentialEndTimeDueToInactivity = 0;
    }
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 10 * 60 * 1000); // set a ten minute timeout

  }
};


function isOlderThanXDays(date, days) {
  const now = new Date();
  const diffTime = now - date.getTime();
  const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000 ));

  return diffDays > days;
}
