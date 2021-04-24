const loader = document.querySelector('.loader');
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');

const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed ');


// NASA API
const apiCount = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${apiCount}`;

let resultsArray = [];
let favorites = {};


function createDOMNodes(page) {
    const cardsToDisplay = (page === 'results' ? resultsArray : Object.values(favorites));
    cardsToDisplay.forEach(result => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');

        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        // Image / Video
        if (result.media_type = 'image') {
            const image = document.createElement('img');
            image.src = result.url;
            image.alt = 'NASA picture of the day';
            image.loading = 'lazy';
            image.classList.add('card-img-top');

            link.appendChild(image);
        } else if (result.media_type = 'video') {
            const video = document.createElement('video');
            video.src = result.url;
            video.alt = 'NASA video of the day';
            video.loading = 'lazy';
            video.controls = false;
            video.classList.add('card-video-top');
            video.play();
        }

        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        // Add to favorites link
        const favorites = document.createElement('p');
        favorites.classList.add('clickable');
        if (page === 'results') {
            favorites.textContent = 'Add to favorites';
            favorites.setAttribute('onclick', `saveToFavorites('${result.url}')`);
        } else {
            favorites.textContent = 'Remove from favorites';
            favorites.setAttribute('onclick', `removeFromFavorites('${result.url}')`);
        }

        // Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;

        // Footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        // Copyright
        const copyright = document.createElement('span');
        copyright.textContent = result.copyright ? ` ${result.copyright}` : '';

        footer.append(date, copyright);
        cardBody.append(cardTitle, favorites, cardText, footer);

        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function saveToFavorites(url) {
    resultsArray.forEach(item => {
        if (item.url.includes(url) && !favorites[url]) {
            favorites[item.url] = item;
            saveConfirmed.classList.remove('hidden');
            setTimeout(() => {
                saveConfirmed.classList.add('hidden');
            }, 2000);
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
            return;
        }
    });
}

function removeFromFavorites(url) {
    if (favorites[url]) {
        delete favorites[url];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

function updateDOM(page) {
    imagesContainer.textContent = '';
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    createDOMNodes(page);

    window.scrollTo({ top: 0, behavior: 'instant' });
    loader.classList.add('hidden');
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    }
}

async function getNasaData() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const res = await fetch(apiUrl);
        resultsArray = await res.json();
        updateDOM('results');
    } catch (error) {
        console.error('Error occurred while fetching data from NASA', error);
    }
}

// On Load
getNasaData();