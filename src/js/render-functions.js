import SimpleLightbox from 'simplelightbox';

export function createGallery(images) {
    const markup = images.map(({ webformatURL, tags }) => `
        <li class="gallery-item">
            <a href="${webformatURL}">
                <img src="${webformatURL}" alt="${tags}" />
            </a>
        </li>
    `).join('');
    document.querySelector('.gallery').innerHTML += markup;

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}

export function clearGallery() {
    document.querySelector('.gallery').innerHTML = '';
}

export function showLoader() {
    document.querySelector('.loader').classList.add('visible');
}

export function hideLoader() {
    document.querySelector('.loader').classList.remove('visible');
}

export function showLoadMoreButton() {
    document.querySelector('.load-more').classList.add('visible');
}

export function hideLoadMoreButton() {
    document.querySelector('.load-more').classList.remove('visible');
}