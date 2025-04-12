import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery, clearGallery, showLoader, hideLoader,
    showLoadMoreButton, hideLoadMoreButton
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchInput = document.querySelector("input[name='search']");
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
        const height = galleryItem.getBoundingClientRect()?.height || 0;
        if (height) {
            window.scrollBy({ top: height * 2, behavior: 'smooth' });
        }
    }
}

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

    if (loadMoreButton) {
        loadMoreButton.style.padding = "12px 24px";
        loadMoreButton.style.fontSize = "16px";
        loadMoreButton.style.fontWeight = "bold";
        loadMoreButton.style.color = "#ffffff";
        loadMoreButton.style.backgroundColor = "#4E35DE";
        loadMoreButton.style.border = "none";
        loadMoreButton.style.borderRadius = "8px";
        loadMoreButton.style.cursor = "pointer";
        loadMoreButton.style.transition = "0.3s";
    }

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