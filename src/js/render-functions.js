import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');

export function createGallery(images) {
    const markup = images.map(img =>
        `<a href="${img.largeImageURL}" class="gallery-item">
            <img src="${img.webformatURL}" alt="${img.tags}" />
        </a>`).join('');
    galleryContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
}

export function clearGallery() {
    galleryContainer.innerHTML = '';
}

export function showLoader() {
    loader.classList.add('visible');
}

export function hideLoader() {
    loader.classList.remove('visible');
}

export function showLoadMoreButton() {
    loadMoreButton.classList.add('visible');
}

export function hideLoadMoreButton() {
    loadMoreButton.classList.remove('visible');
}