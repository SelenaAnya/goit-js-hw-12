import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');

export function createGallery(images) {
    clearGallery();

    const markup = images.map(image => `
    <li class="gallery-item" style="list-style: none;">
      <a href="${image.largeImageURL}">
      <div class="image-container">
      <span class="loader visible"></span>
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" 
        style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); object-fit: cover;">
      </div>
      </a>
     <div class="image-info">
        <p class="info-item"><span class="info-value">Likes</span> ${image.likes}</p>
        <p class="info-item"><span class="info-value">Views</span> ${image.views}</p>
        <p class="info-item"><span class="info-value">Comments</span> ${image.comments}</p>
        <p class="info-item"><span class="info-value">Downloads</span> ${image.downloads}</p>
      </div>
    </li>
  `).join('');
    galleryContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    hideLoader();

    document.querySelectorAll(".image-container img").forEach((img) => {
        const loader = img.closest(".image-container")?.querySelector(".loader");
        if (loader) {
            if (img.complete) {
                loader.classList.remove("visible");
            } else {
                img.addEventListener("load", () => loader.classList.remove("visible"));
            }
        }
    });

    if (!images || images.length === 0) {
        console.warn("Немає зображень для відображення!");
        return;
    }

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

galleryContainer.style.listStyle = "none";
galleryContainer.style.width = "1200px";
galleryContainer.style.display = "grid";
galleryContainer.style.textAlign = "center";
galleryContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
galleryContainer.style.gap = "24px";
galleryContainer.style.margin = "0 auto";
galleryContainer.style.justifyContent = "center";
galleryContainer.style.alignItems = "center";
galleryContainer.style.marginTop = "108px";


// Styling gallery cards
const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach((item) => {
    item.style.overflow = "hidden";
    item.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    item.style.transition = "transform 0.3s ease-in-out";

    item.addEventListener("mouseover", () => {
        item.style.transform = "scale(1.05)";
    });

    item.addEventListener("mouseout", () => {
        item.style.transform = "scale(1)";
    });

    const infoBlocks = document.querySelectorAll(".image-info");

    infoBlocks.forEach((block) => {
        block.style.display = "flex";
        block.style.flexWrap = "wrap";
        block.style.justifyContent = "center";
        block.style.textAlign = "center";
        block.style.fontSize = "12px";
        block.style.border = "1px solid #808080";
        block.style.padding = "10px";
        block.style.margin = "0";
    });

});
