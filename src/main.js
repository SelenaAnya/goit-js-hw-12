import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreButton = document.querySelector('.load-more');
let searchQuery = '';
let page = 1;

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    searchQuery = event.target.elements.search.value.trim();
    if (!searchQuery) return;
    page = 1;
    clearGallery();
    hideLoadMoreButton();
    fetchImages();
});

loadMoreButton.addEventListener('click', () => {
    page++;
    fetchImages();
});

async function fetchImages() {
    showLoader();
    const data = await getImagesByQuery(searchQuery, page);
    hideLoader();

    if (data.hits.length === 0) {
        iziToast.error({ title: 'Oops!', message: 'No images found.' });
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
    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
        const height = galleryItem.getBoundingClientRect().height;
        window.scrollBy({ top: height * 2, behavior: 'smooth' });
    }
}