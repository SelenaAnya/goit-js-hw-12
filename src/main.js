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

    const searchQuery = e.target.elements.searchQuery.value.trim();

    if (!searchQuery) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query',
            position: 'topRight',
        });
        return;
    }

    // Очищаємо галерею, показуємо завантажувач та скидаємо сторінку
    clearGallery();
    showLoader();
    hideLoadMoreButton();

    currentQuery = searchQuery;
    currentPage = 1;

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);
        totalHits = data.totalHits;

        if (data.hits.length === 0) {
            iziToast.error({
                title: 'Error',
                message: 'Sorry, there are no images matching your search query. Please try again.',
                position: 'topRight',
            });
            return;
        }

        createGallery(data.hits);

        iziToast.success({
            title: 'Success',
            message: `Hooray! We found ${totalHits} images.`,
            position: 'topRight',
        });

        // Визначаємо, чи є ще зображення для завантаження
        if (data.hits.length < totalHits && currentPage < Math.ceil(totalHits / 15)) {
            showLoadMoreButton();
        } else {
            hideLoadMoreButton();
            if (data.hits.length > 0) {
                iziToast.info({
                    title: 'Info',
                    message: "We're sorry, but you've reached the end of search results.",
                    position: 'topRight',
                });
            }
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: `Error fetching images: ${error.message}`,
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
});

// Обробник подій кнопки "Load more"
loadMoreBtn.addEventListener('click', async function () {
    showLoader();
    currentPage += 1;

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);

        if (data.hits.length === 0) {
            hideLoadMoreButton();
            iziToast.info({
                title: 'Info',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
            return;
        }

        createGallery(data.hits);

        // Плавне прокручування сторінки
        const cardHeight = document.querySelector('.photo-card').getBoundingClientRect().height;
        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });

        // Перевіряємо, чи це кінець колекції
        if (currentPage * 15 >= totalHits) {
            hideLoadMoreButton();
            iziToast.info({
                title: 'Info',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: `Error fetching more images: ${error.message}`,
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
});