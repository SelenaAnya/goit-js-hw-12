import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.js-image-list');
const loader = document.querySelector('.js-loader');
const loadMoreButton = document.querySelector('.js-load-more');

let lightbox = new SimpleLightbox('.gallery a');

export function createGallery(images) {
    const markup = images.map(image => `
        <li class="gallery-item">
            <a href="${image.largeImageURL}">
                <div class="image-container">
                    <span class="loader"></span>
                    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
                </div>
            </a>
            <div class="image-info">
                <p><strong>Likes:</strong> ${image.likes}</p>
                <p><strong>Views:</strong> ${image.views}</p>
                <p><strong>Comments:</strong> ${image.comments}</p>
                <p><strong>Downloads:</strong> ${image.downloads}</p>
            </div>
        </li>
    `).join('');

    galleryContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    hideLoader();
}

export function clearGallery() {
    galleryContainer.innerHTML = '';
}

export function showLoader() {
    loader.style.display = 'block';
}

export function hideLoader() {
    loader.style.display = 'none';
}

export function showLoadMoreButton() {
    loadMoreButton.style.display = 'block';
}

export function hideLoadMoreButton() {
    loadMoreButton.style.display = 'none';
}