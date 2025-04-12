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
                    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"
                    style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); object-fit: cover;>
                </div>
            </a>
            <div class="image-info">
                <p class="info-item"><span class="info-value">Likes:</span> ${image.likes}</p>
                <p class="info-item"><span class="info-value">Views:</span> ${image.views}</p>
                <p class="info-item"><span class="info-value">Comments:</span> ${image.comments}</p>
                <p class="info-item"><span class="info-value">Downloads:</span> ${image.downloads}</p>
            </div>
        </li>
    `).join('');

    galleryContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    hideLoader();

    document.querySelectorAll(".image-container img").forEach((img) => {
        const loader = img.closest(".image-container").querySelector(".loader");
        if (img.complete) {
            loader.classList.remove("visible");
        } else {
            img.addEventListener("load", () => {
                loader.classList.remove("visible");
            });
        }
    });

    if (!lightbox) {
        lightbox = new SimpleLightbox(".gallery a");
    } else {
        lightbox.refresh();
    }
}

const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach((item) => {

    item.addEventListener("mouseover", () => {
        item.style.transform = "scale(1.05)";
    });

    item.addEventListener("mouseout", () => {
        item.style.transform = "scale(1)";
    });
});

console.log(loader);
console.log(loadMoreButton);


export function showLoader() {
    const loader = document.querySelector(".loader");
    if (loader) {
        loader.classList.add("visible"); // show loader
    }
}

export function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) {
        loader.classList.remove("visible"); // hide loader
    }
}

export function clearGallery() {
    galleryContainer.innerHTML = '';
}

export function showLoadMoreButton() {
    loadMoreButton.style.display = 'block';
}

export function hideLoadMoreButton() {
    loadMoreButton.style.display = 'none';
}