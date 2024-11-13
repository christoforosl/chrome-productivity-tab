import { $html, options, settings } from "./common.js";

const CALL_IMAGE_API_HEADERS = new Headers({
    accept: "application/json",
    Authorization: "Client-ID " + options.imageApiKey,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size

function fetchAndSetBackgroundImage(url) {
    return new Promise((resolve) => {
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    console.log('Image could not be fetched');
                    resolve(false);
                }
            })
            .then(blob => {
                if (blob) {
                    const objectURL = URL.createObjectURL(blob);
                    document.body.style.backgroundImage = `url('${objectURL}')`;
                    backroundImageProps();
                    console.log(`Background image set successfully from ${objectURL}`);
                    resolve(true);
                }
            })
            .catch(error => {
                document.body.style.backgroundImage = `url('${chrome.runtime.getURL(options.defaultBackround)}')`;
                backroundImageProps();
                console.error('Error fetching image:', error);
                resolve(false);
            });
    });
}

function backroundImageProps() {
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
}

export function setBackroundImage(currentBackroundImage) {
    fetchAndSetBackgroundImage(currentBackroundImage.src)
        .then(success => {
            if (success) {
                setPhotoDesriptions(currentBackroundImage);

            } else {
                console.log('Failed to update background, using default image');
                currentBackroundImage.src = chrome.runtime.getURL(options.defaultBackround);
                currentBackroundImage.photographerUrl = "https://www.freepik.com/free-vector/dark-studio-room-vector-background_2395298.htm";
                currentBackroundImage.photographer = "Starline / Freepik"
                setPhotoDesriptions(currentBackroundImage);
                console.log('Failed to update background, used default image');
            }
        });

}

function setPhotoDesriptions(currentBackroundImage) {
    let photoInfo = "Photo By ";
    if (currentBackroundImage.photographerUrl) {
        photoInfo += `<a style="color:white" target="_new" href="${currentBackroundImage.photographerUrl}">${currentBackroundImage.photographer}</a>`;
    } else {
        photoInfo += currentBackroundImage.photographer;
    }
    photoInfo += currentBackroundImage.location ? ", " + currentBackroundImage.location : "";
    $("#photoinfo").attr("title", currentBackroundImage.description);
    $html("photographer", photoInfo);
}

export function fetchImageFromApiService() {

    const imageApiUrl = options.imageApiQuery + settings.imageKeywords;
    const myRequest = new Request(imageApiUrl, {
        method: "GET",
        headers: CALL_IMAGE_API_HEADERS,
        mode: "cors",
    });
    fetchImageFromURL(myRequest);
}

export function fetchImageFromURL(myRequest) {

    fetch(myRequest)
        .then((response) => response.json())
        .then((contents) => {
            const photo = contents;
            const currentBackroundImage = {};
            currentBackroundImage.photographer = photo.user.name;
            currentBackroundImage.photographerUrl = photo.user.portfolio_url;
            currentBackroundImage.src = photo.urls.full;
            currentBackroundImage.setDate = new Date().toDateString();
            currentBackroundImage.location = photo.location
                ? photo.location.title
                : "";
            currentBackroundImage.description = photo.alt_description
                ? photo.alt_description
                : photo.description;

            localStorage.setItem(
                "currentBackroundImage",
                JSON.stringify(currentBackroundImage)
            );
            setBackroundImage(currentBackroundImage);
        });


}

function isOlderThanXDays(date, days) {
    const now = new Date();
    const diffTime = now - date.getTime();
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));

    return diffDays > days;
}

// Initialize the custom background functionality
export function initializeCustomBackground() {
    const fileInput = document.getElementById('customBackgroundInput');
    const removeButton = document.getElementById('removeCustomBackground');

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);

        // Update file input label with selected filename
        fileInput.addEventListener('change', function (e) {
            const fileName = e.target.files[0]?.name || 'Choose file...';
            e.target.nextElementSibling.textContent = fileName;
        });
    }

    if (removeButton) {
        removeButton.addEventListener('click', removeCustomBackground);
    }

    // Check for existing custom background
    chrome.storage.local.get(['customBackground'], function (result) {
        if (result.customBackground) {
            document.getElementById('currentImageName').textContent = 'Custom image set';
            document.getElementById('removeCustomBackground').style.display = 'inline-block';
        }
    });
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        alert('Please select an image smaller than 5MB.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const imageData = e.target.result;

        // Store the image data in Chrome storage
        chrome.storage.local.set({
            customBackground: {
                data: imageData,
                name: file.name,
                type: file.type,
                timestamp: new Date().getTime()
            }
        }, function () {
            document.getElementById('currentImageName').textContent = file.name;
            document.getElementById('removeCustomBackground').style.display = 'inline-block';
            setCustomBackgroundImage(imageData);
        });
    };

    reader.readAsDataURL(file);
}

// Remove custom background
function removeCustomBackground() {
    chrome.storage.local.remove(['customBackground'], function () {
        document.getElementById('currentImageName').textContent = 'None';
        document.getElementById('removeCustomBackground').style.display = 'none';
        document.getElementById('customBackgroundInput').value = '';
        document.getElementById('customBackgroundInput').nextElementSibling.textContent = 'Choose file...';

        // Revert to default background behavior
        checkBackroundImageOnLoad();
    });
}

// Set the custom background image
function setCustomBackgroundImage(imageData) {
    if (window.jQuery) {
        $("html").css("background-image", `url('${imageData}')`);
        $("#photoinfo").attr("title", "Custom Background Image");
        $html("photographer", "Custom Background");
    }
}

function setDefaultBackgroundImage() {
    
    const defaultImageUrl = chrome.runtime.getURL(options.defaultBackground);
    $("html").css("background-image", `url('${defaultImageUrl}')`);
    $("#photoinfo").attr("title", "Default Background");
    $html("photographer", "Default Background");
}

// Modify the existing checkBackroundImageOnLoad function
export function checkBackroundImageOnLoad() {
    if (window.jQuery) {
        $(document).ready(function () {
            // First check for custom background
            chrome.storage.local.get(['customBackground'], function (result) {
                if (result.customBackground) {
                    // Use custom background if it exists
                    setCustomBackgroundImage(result.customBackground.data);
                } else {
                    // set default background
                    setDefaultBackgroundImage();
                }
            });
        });
    }
}


