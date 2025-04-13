import SimpleLightbox from 'simplelightbox';

export function createGallery(images) {
    const markup = images.map(({ webformatURL, tags, likes, views, comments, downloads }) => `
        <li class="gallery-item">
            <a href="${webformatURL}">
                <div class="loader active"></div>
                <img src="${webformatURL}" alt="${tags}" onload="hideImageLoader(this)" />
            </a>
            <div class="image-info">
                <p class="info-item"><span class="info-value">Likes:</span> ${likes}</p>
                <p class="info-item"><span class="info-value">Views:</span> ${views}</p>
                <p class="info-item"><span class="info-value">Comments:</span> ${comments}</p>
                <p class="info-item"><span class="info-value">Downloads:</span> ${downloads}</p>
            </div>
        </li>
    `).join('');

    document.querySelector('.gallery').innerHTML += markup;

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}

export function hideImageLoader(image) {
    const loader = image.previousElementSibling;
    if (loader) {
        loader.classList.remove("active");
    }
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
    const button = document.querySelector('.load-more-btn');
    if (button) button.classList.add('visible');
}

export function hideLoadMoreButton() {
    const button = document.querySelector('.load-more-btn');
    if (button) button.classList.remove('visible');
}