import { $html, options, isPositiveInteger, settings, showChromeNotification } from "./common.js";

const randomImages = [
    {
        title: "Three Men Standing Near Waterfalls",
        url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&dpr=3",
    },
    {
        title: "Body of Water Near Brown Sand",
        url: "https://images.pexels.com/photos/7999461/pexels-photo-7999461.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Brown Mountain",
        url: "https://images.pexels.com/photos/3308741/pexels-photo-3308741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Porto, Portugal",
        url: "https://images.pexels.com/photos/2549156/pexels-photo-2549156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Yosemite Valley, United States",
        url: "https://images.pexels.com/photos/1571108/pexels-photo-1571108.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Torres del Paine, Chile",
        url: "https://images.pexels.com/photos/3739624/pexels-photo-3739624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Florence, Italy",
        url: "https://images.pexels.com/photos/4015473/pexels-photo-4015473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Hlavní město Praha, Czechia",
        url: "https://images.pexels.com/photos/783739/pexels-photo-783739.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "New York",
        url: "https://images.pexels.com/photos/3875821/pexels-photo-3875821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Stop Wishing...",
        url: "https://images.pexels.com/photos/2045600/pexels-photo-2045600.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Huangpu Qu, China",
        url: "https://images.pexels.com/photos/842654/pexels-photo-842654.jpeg?cs=srgb&dl=pexels-zhang-kaiyv-842654.jpg&fm=jpg",
    },
    {
        title: "Guatemala",
        url: "https://images.pexels.com/photos/2661176/pexels-photo-2661176.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Batang Kali, Malaysia",
        url: "https://images.pexels.com/photos/1173777/pexels-photo-1173777.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    },
    {
        title: "Maldives",
        url: "https://images.pexels.com/photos/2775196/pexels-photo-2775196.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Cyprus coast",
        url: "https://images.pexels.com/photos/6860099/pexels-photo-6860099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        title: "Morskie Oko, Sea Eye, Tatra National Park, Poland",
        url: "https://st3.depositphotos.com/14847044/i/600/depositphotos_178404276-stock-photo-view-rocky-shore-stones-water.jpg",
    },
    {
        title: "Serpentine",
        url: "https://st4.depositphotos.com/18241762/i/600/depositphotos_202584372-stock-photo-serpentine.jpg",
    },
    {
        title: "Green Fields Near Brown Mountain",
        url: "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        photographer: "Brett Sayles",
        title: "White Mountains Under White and Gray Sky",
        url: "https://images.pexels.com/photos/1701188/pexels-photo-1701188.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        photographer: "Olga Lioncat",
        title: "Cathedral and Ferris wheel in London",
        url: "https://images.pexels.com/photos/7245352/pexels-photo-7245352.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        photographer: "Rachel Claire",
        title: "Rome",
        url: "https://images.pexels.com/photos/4819654/pexels-photo-4819654.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
];

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
                document.body.style.backgroundImage = `url('${ chrome.runtime.getURL(options.defaultImage)}')`;
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

function setBackroundImageFromStorage(currentBackroundImage) {
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
            setBackroundImageFromStorage(currentBackroundImage);
        })
        .catch(() => {
            console.error("Failed to fetch image from API, using random image");
            const currentImageIndexParsed = isPositiveInteger(
                localStorage.getItem("currentBackroundImageIndex")
            )
                ? parseInt(localStorage.getItem("currentBackroundImageIndex")) +
                1
                : 0;

            const currentImageIndex =
                currentImageIndexParsed > randomImages.length - 1
                    ? 0
                    : currentImageIndexParsed;

            const currentBackroundImage = {};
            currentBackroundImage.photographer = "Unknown";
            currentBackroundImage.src = randomImages[currentImageIndex].url;
            currentBackroundImage.photographer =
                randomImages[currentImageIndex].photographer;
            currentBackroundImage.setDate = new Date().toDateString();
            currentBackroundImage.location = `${randomImages[currentImageIndex].title}, Image index: ${currentImageIndex}`;
            currentBackroundImage.description = "";

            localStorage.setItem(
                "currentBackroundImage",
                JSON.stringify(currentBackroundImage)
            );
            localStorage.setItem(
                "currentBackroundImageIndex",
                currentImageIndex.toString()
            );
            setBackroundImageFromStorage(currentBackroundImage);
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
        setBackroundImageFromStorage(currentBackroundImage);
    } else {
        fetchImageFromApiService();
    }
}
