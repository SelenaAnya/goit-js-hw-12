import { fetchImages } from './js/pixabay-api.js';
import {
    createGallery, clearGallery, showLoader,
    hideLoader, showLoadMoreButton, hideLoadMoreButton
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('#search-form');
const loadMoreButton = document.querySelector('.js-load-more');
let searchQuery = '';
let page = 1;

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    searchQuery = event.target.elements.search.value.trim();
    if (!searchQuery) return;
    page = 1;
    clearGallery();
    hideLoadMoreButton();
    fetchNewImages();
});

loadMoreButton.addEventListener('click', () => {
    page++;
    fetchNewImages();
});

async function fetchNewImages() {
    showLoader();
    const data = await fetchImages(page, searchQuery);
    hideLoader();

    if (!data || !data.hits.length) {
        iziToast.error({ title: 'Oops!', message: 'No images found.' });
        hideLoadMoreButton();
        return;
    }

    createGallery(data.hits);

    if (page * 15 >= data.totalHits) {
        hideLoadMoreButton();
        iziToast.info({ title: 'End of results', message: "We're sorry, but you've reached the end of search results." });
    } else {
        showLoadMoreButton();
    }

    smoothScroll();
}

function smoothScroll() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const lastItem = galleryItems[galleryItems.length - 1];
        const height = lastItem.getBoundingClientRect().height;
        window.scrollBy({ top: height * 2, behavior: 'smooth' });
    }
}