import { $html, options, settings, showChromeNotification } from "./common.js";

const CALL_IMAGE_API_HEADERS = new Headers({
    accept: "application/json",
    Authorization: "Client-ID " + options.imageApiKey,
});

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
                    console.log('Background image set successfully');
                    resolve(true);
                }
            })
            .catch(error => {
                document.body.style.backgroundImage = `url('${chrome.runtime.getURL(options.defaultImage)}')`;
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
                console.log('Background set successfully');
                setPhotoDesriptions(currentBackroundImage);

            } else {
                showChromeNotification('Failed to update background, used default image');
                currentBackroundImage.src = chrome.runtime.getURL(options.defaultImage);
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

export function checkBackroundImageOnLoad() {
    const currentBackroundImage = JSON.parse(localStorage.getItem("currentBackroundImage")) || {};

    const doImageFromStorage =
        currentBackroundImage.src &&
        !isOlderThanXDays(
            new Date(currentBackroundImage.setDate),
            parseInt(settings.daysToKeepImage) ?? 30
        );

    if (doImageFromStorage) {
        setBackroundImage(currentBackroundImage);
    } else {
        fetchImageFromApiService();
    }
}


/**
 * Checks and requests permission for a given image URL if not already granted.
 * @param {string} imageUrl - The complete URL of the image.
 * @returns {Promise<boolean>} - Resolves to true if permission is granted, false otherwise.
 */
export function checkAndRequestPermission(imageUrl) {
    return new Promise((resolve, reject) => {
        try {
            // Extract the origin from the URL
            const url = new URL(imageUrl);
            const origin = url.origin + '/*';
           
            // Check if we already have permission
            chrome.permissions.contains({ origins: [origin] }, (result) => {
                if (result) {
                    // We already have permission
                    resolve(true);
                } else {
                    // We don't have permission, so let's request it
                    chrome.permissions.request({ origins: [origin] }, (granted) => {
                        if (granted) {
                            // Permission was granted
                            resolve(true);
                        } else {
                            // Permission was denied
                            resolve(false);
                        }
                    });
                }
            });
        } catch (error) {
            // If there's an error (e.g., invalid URL), reject the promise
            reject(new Error(`Invalid URL or permission error: ${error.message}`));
        }
    });
}
