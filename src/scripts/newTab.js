let currentDateTimeTimer = null;

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

document.addEventListener('DOMContentLoaded', function() {
  initializeNewTabPage();
});

function initializeNewTabPage() {
  checkBackroundImageOnLoad();
}
