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

document.addEventListener('DOMContentLoaded', () => {
    loadMore.addEventListener('click', onLoadMore);
});

document.querySelector('.search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    query = e.target.elements.searchQuery.value.trim();
    page = 1;
    clearGallery();
    // hideLoadMoreButton();

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

async function onLoadMore() {
    page++;
    loadMore.disabled = true;
    loadMore.innerHTML = "Loading...";

    try {
        const data = await getImagesByQuery(query, page);
        container.insertAdjacentHTML("beforeend", createMarkup(data.hits));
        loadMore.disabled = false;
        loadMore.innerHTML = "Load more";

        // Checking if the user has reached the end of the results
        if (page * 15 >= totalHits) {
            loadMore.classList.replace("load-more", "load-more-hidden");
            alert("We're sorry, but you've reached the end of search results.");
        }

        // Smooth page scrolling
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
        alert(error.message);
    }
}