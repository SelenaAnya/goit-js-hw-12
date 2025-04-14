import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loadingMessage = document.querySelector('.loading-message');

let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

export function createGallery(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <li class="gallery-item">
            <a href="${largeImageURL}">
                <div class="image-wrapper">
                    <span class="loader"></span>
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" onload="this.previousElementSibling.style.display='none'" />
                </div>
            </a>
            <div class="image-info">
                <p class="info-item"><span class="info-value">Likes:</span> ${likes}</p>
                <p class="info-item"><span class="info-value">Views:</span> ${views}</p>
                <p class="info-item"><span class="info-value">Comments:</span> ${comments}</p>
                <p class="info-item"><span class="info-value">Downloads:</span> ${downloads}</p>
            </div>
        </li>
    `).join('');

    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
}

export function clearGallery() {
    gallery.innerHTML = '';
}

export function showLoader() {
    loader.classList.add('visible');
}

export function hideLoader() {
    loader.classList.remove('visible');
}

export function showLoadMoreButton() {
    loadMoreBtn.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
    loadMoreBtn.classList.add('is-hidden');
}

export function showLoadingMessage() {
    loadingMessage.classList.remove('is-hidden');
}

export function hideLoadingMessage() {
    loadingMessage.classList.add('is-hidden');
}

export function smoothScroll() {
    const card = document.querySelector('.gallery-item');
    if (card) {
        const cardHeight = card.getBoundingClientRect().height;
        window.scrollBy({
            left: 0,
            top: cardHeight * 2,
            behavior: 'smooth'
        });
    }
}