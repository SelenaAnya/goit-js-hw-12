import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery, clearGallery,
    showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton
} from './js/render-functions.js';
import iziToast from 'izitoast';

let query = '';
let page = 1;
let totalHits = 0;

const ImageList = document.querySelector('.js-image-list');
const loadMore = document.querySelector('.js-load-more');
const form = document.querySelector('.search-form');
const galleryItem = document.querySelector('.gallery-item');

function handleTouch(event) {
    console.log('Touch started', event);
}

document.addEventListener('touchstart', handleTouch, { passive: true });

document.querySelector('.search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    query = e.target.elements.searchQuery.value.trim();
    page = 1;
    clearGallery();
    hideLoadMoreButton();

    if (!query) return;

    try {
        showLoader();
        const data = await getImagesByQuery(query, page);
        hideLoader();

        totalHits = data.totalHits;

        if (data.hits.length === 0) {
            iziToast.error({ message: 'Нічого не знайдено' });
            return;
        }

        createGallery(data.hits);
        if (page < Math.ceil(totalHits / 15)) {
            showLoadMoreButton();
        }
    } catch (error) {
        hideLoader();
        iziToast.error({ message: 'Помилка завантаження' });
    }
});

loadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
    page++;
    loadMore.disabled = true;
    loadMore.innerHTML = "Loading...";
    showLoader();

    try {
        const data = await getImagesByQuery(query, page);
        hideLoader();
        createGallery(data.hits);
        loadMore.disabled = false;
        loadMore.innerHTML = "Load more";

        // Checking if the end has been reached
        if (page * 15 >= totalHits) {
            loadMore.classList.replace("load-more", "load-more-hidden");
            alert("We're sorry, but you've reached the end of search results.");
        }

        // Smooth scrolling to new cards
        const galleryItem = document.querySelector(".gallery-item");
        if (galleryItem) {
            const cardHeight = galleryItem.getBoundingClientRect().height;
            window.scrollBy({
                left: 0,
                top: cardHeight * 2,
                behavior: "smooth"
            });
        }

    } catch (error) {
        hideLoader();
        loadMore.disabled = false;
        loadMore.innerHTML = "Load more";
        alert(error.message);
    }
}
