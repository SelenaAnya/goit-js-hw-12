import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more-btn');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

// Ховаємо кнопку при запуску
hideLoadMoreButton();

// Обробник подій форми пошуку
searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    currentQuery = e.target.elements.searchQuery.value.trim();
    currentPage = 1;

    if (!currentQuery) {
        iziToast.error({ title: 'Error', message: 'Please enter a search query', position: 'topRight' });
        return;
    }

    clearGallery();
    showLoader();
    hideLoadMoreButton();

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);
        totalHits = data.totalHits;

        if (data.hits.length === 0) {
            iziToast.error({ title: 'Error', message: 'No images found. Try again.', position: 'topRight' });
            return;
        }

        createGallery(data.hits);

        iziToast.success({ title: 'Success', message: `Found ${totalHits} images!`, position: 'topRight' });

        if (currentPage < Math.ceil(totalHits / 15)) {
            showLoadMoreButton();
        } else {
            hideLoadMoreButton();
            iziToast.info({ title: 'Info', message: "You've reached the end of search results.", position: 'topRight' });
        }
    } catch (error) {
        iziToast.error({ title: 'Error', message: `Error fetching images: ${error.message}`, position: 'topRight' });
    } finally {
        hideLoader();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) {
        console.error("loadMoreBtn not found in DOM!");
        return;
    }

    loadMoreBtn.addEventListener('click', async function () {
        showGlobalLoader();
        currentPage++;

        try {
            const data = await getImagesByQuery(currentQuery, currentPage);
            if (data.hits.length === 0) {
                hideLoadMoreButton();
                iziToast.info({ title: 'Info', message: "You've reached the end of search results.", position: 'topRight' });
                return;
            }

            createGallery(data.hits);
            smoothScroll();
        } catch (error) {
            iziToast.error({ title: 'Error', message: `Error fetching more images: ${error.message}`, position: 'topRight' });
        } finally {
            hideGlobalLoader();
        }
    });
});