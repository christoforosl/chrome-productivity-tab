import {options,settings} from './common.js';
import {fetchImageFromApiService} from './backgroundImage.js';

const CALL_QUOTE_HEADERS = new Headers({
    "accept": "application/json",
    "useQueryString": true
  });

function loadSettings() {
    if (settings.length === 0) {
        const parsed =  JSON.parse(window.localStorage.getItem("settings")) || {imageKeywords: "nature"};
        settings.unshift (parsed);
    }
}

$(document).ready(() => {
    loadSettings();
    fetchImageFromApiService();
});
