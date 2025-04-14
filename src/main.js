import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
    showLoadingMessage,
    hideLoadingMessage,
    smoothScroll
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');
const searchInput = document.querySelector('input[name="searchQuery"]');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

// Ховаємо кнопку при запуску
hideLoadMoreButton();

// Обробник подій форми пошуку
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    currentQuery = e.target.elements.searchQuery.value.trim();
    currentPage = 1;

    if (!currentQuery) {
        iziToast.error({ title: 'Error', message: 'Please enter a search query', position: 'topRight' });
        return;
    }

    clearGallery();
    showLoader();
    showLoadingMessage();
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

        // Очищаємо форму після запиту
        form.reset();
    } catch (error) {
        iziToast.error({ title: 'Error', message: `Error fetching images: ${error.message}`, position: 'topRight' });
    } finally {
        hideLoader();
        hideLoadingMessage();
    }
});

// Обробник подій для кнопки "Load more"
loadMoreBtn.addEventListener('click', async function () {
    showLoader();
    showLoadingMessage();
    currentPage++;

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);
        if (data.hits.length === 0) {
            hideLoadMoreButton();
            iziToast.info({ title: 'Info', message: "You've reached the end of search results.", position: 'topRight' });
            return;
        }

        createGallery(data.hits);

        // Плавне прокручування
        const card = document.querySelector('.gallery-item');
        if (card) {
            const cardHeight = card.getBoundingClientRect().height;
            window.scrollBy({
                left: 0,
                top: cardHeight * 2,
                behavior: 'smooth'
            });
        }

        // Перевірка чи досягли кінця результатів
        if (currentPage >= Math.ceil(totalHits / 15)) {
            hideLoadMoreButton();
            iziToast.info({ title: 'Info', message: "You've reached the end of search results.", position: 'topRight' });
        }
    } catch (error) {
        iziToast.error({ title: 'Error', message: `Error fetching more images: ${error.message}`, position: 'topRight' });
    } finally {
        hideLoader();
        hideLoadingMessage();
    }
});

// Стилізація для інпута
if (searchInput) {
    searchInput.style.width = "300px";
    searchInput.style.padding = "10px";
    searchInput.style.border = "2px solid #4E35DE";
    searchInput.style.borderRadius = "8px";
    searchInput.style.fontSize = "16px";
    searchInput.style.color = "#333";
    searchInput.style.backgroundColor = "#f9f9f9";
    searchInput.style.outline = "none";
    searchInput.style.transition = "0.3s";

    // Effect in focus
    searchInput.addEventListener("focus", () => {
        searchInput.style.borderColor = "#61dafb";
        searchInput.style.boxShadow = "0 0 10px rgba(97, 218, 251, 0.5)";
    });

    searchInput.addEventListener("blur", () => {
        searchInput.style.borderColor = "#4E35DE";
        searchInput.style.boxShadow = "none";
    });
}

const searchButton = document.querySelector("button[type='submit']");

if (searchButton) {
    searchButton.style.padding = "12px 24px";
    searchButton.style.fontSize = "16px";
    searchButton.style.fontWeight = "bold";
    searchButton.style.color = "#ffffff";
    searchButton.style.backgroundColor = "#4E35DE";
    searchButton.style.border = "none";
    searchButton.style.borderRadius = "8px";
    searchButton.style.cursor = "pointer";
    searchButton.style.transition = "0.3s";

    // Hovering effect
    searchButton.addEventListener("mouseover", () => {
        searchButton.style.backgroundColor = "#61dafb";
    });

    searchButton.addEventListener("mouseout", () => {
        searchButton.style.backgroundColor = "#4E35DE";
    });

    // Effect on click
    searchButton.addEventListener("mousedown", () => {
        searchButton.style.transform = "scale(0.95)";
    });

    searchButton.addEventListener("mouseup", () => {
        searchButton.style.transform = "scale(1)";
    });
}