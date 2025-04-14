const container = document.querySelector(".js-movie-list");
const loadMore = document.querySelector(".js-load-more");

loadMore.addEventListener("click", onLoadMore);

let page = 1;

async function serviceMovie(page = 1) {
    const { data } = await axios(`${BASE_URL}${END_POINT}`, {
        params: {
            api_key: API_KEY,
            page: page
        }
    });

    return data;
}

function createMarkup(arr) {
    return arr.map(({ poster_path, release_date, original_title, vote_average }) => `
        <li class="movie-card">
            <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${original_title}"/>
            <div class="movie-info">
                <h2>${original_title}</h2>
                <p>Release Date: ${release_date}</p>
                <p>Vote Average: ${vote_average}</p>
            </div>
        </li>
    `).join("");
}

serviceMovie(page)
    .then(data => {
        console.log(data);
        container.insertAdjacentHTML("beforeend", createMarkup(data.results));

        if (data.page < data.total_pages) {
            loadMore.classList.replace("load-more-hidden", "load-more");
        }
    })
    .catch(error => console.log(error.message))

async function onLoadMore() {
    page++;
    loadMore.disabled = true;
    loadMore.innerHTML = "Loading...";

    try {
        const data = await serviceMovie(page);
        container.insertAdjacentHTML("beforeend", createMarkup(data.results));
        loadMore.disabled = false;
        loadMore.innerHTML = "Load more";

        if (data.page >= data.total_pages) {
            loadMore.classList.replace("load-more", "load-more-hidden");
        }

        const card = document.querySelector(".movie-card");
        const cardHeight = card.getBoundingClientRect().height;

        window.scrollBy({
            left: 0,
            top: cardHeight,
            behavior: "smooth"
        })

    } catch (error) {
        alert(error.message);
    }
}



Твій код вже виглядає досить добре, але є помилки та дублювання, які можуть призводити до неправильного виконання.Ось основні проблеми та виправлення:

🚀 Основні проблеми та виправлення:
1️⃣ ❌ Дубльований виклик try { getImagesByQuery(...) } в кінці файлу
🔹 Ти двічі викликаєш try { const data = await getImagesByQuery(...) } — один раз у loadMoreBtn.addEventListener() і ще один безпосередньо в кінці.
✅ Виправлення: Залиш лише один виклик у loadMoreBtn.addEventListener() та видали зайвий.

2️⃣ ❌ showGlobalLoader() викликається, але ця функція не імпортована з render - functions.js
🔹 В loadMoreBtn.addEventListener() ти викликаєш showGlobalLoader(), але її немає у render - functions.js.
✅ Виправлення: Додай у render - functions.js:
export function showGlobalLoader() {
    const loader = document.querySelector('.global-loader');
    if (loader) loader.classList.add('visible');
}

export function hideGlobalLoader() {
    const loader = document.querySelector('.global-loader');
    if (loader) loader.classList.remove('visible');
}


✅ Переконайся, що є div.global - loader у index.html:
<div class="global-loader"></div>



3️⃣ ❌ loadMoreBtn.addEventListener(...) виконується до створення loadMoreBtn в DOM
🔹 Якщо кнопки ще немає в DOM, вона не працюватиме.
✅ Виправлення: Викликати addEventListener() після завантаження DOM:
document.addEventListener("DOMContentLoaded", () => {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async function () {
            showGlobalLoader();
            currentPage++;

            try {
                const data = await getImagesByQuery(currentQuery, currentPage);

                if (data.hits.length === 0) {
                    hideLoadMoreButton();
                    iziToast.info({ title: 'Info', message: "You've reached the end of search results.", position: 'topRight' });
                    return;
                }

                createGallery(data.hits);

                const galleryItem = document.querySelector('.gallery-item');
                if (galleryItem) {
                    const cardHeight = galleryItem.getBoundingClientRect().height;
                    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
                }

                if (currentPage >= Math.ceil(totalHits / 15)) {
                    hideLoadMoreButton();
                    iziToast.info({ title: 'Info', message: "You've reached the end of search results.", position: 'topRight' });
                }
            } catch (error) {
                iziToast.error({ title: 'Error', message: `Error fetching more images: ${error.message}`, position: 'topRight' });
            } finally {
                hideGlobalLoader();
            }
        });
    } else {
        console.error("loadMoreBtn not found in DOM!");
    }
});



📝 Оновлений main.js після всіх виправлень
import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showGlobalLoader,
    hideGlobalLoader,
    showLoadMoreButton,
    hideLoadMoreButton
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.search-form');
let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

// Ховаємо кнопку при запуску
hideLoadMoreButton();

// Обробник подій форми пошуку
searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    currentQuery = e.target.elements.searchQuery.value.trim();
    currentPage = 1;

    if (!currentQuery) {
        iziToast.error({ title: 'Error', message: 'Please enter a search query', position: 'topRight' });
        return;
    }

    clearGallery();
    showGlobalLoader();
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
    } catch (error) {
        iziToast.error({ title: 'Error', message: `Error fetching images: ${error.message}`, position: 'topRight' });
    } finally {
        hideGlobalLoader();
    }
});




body {
    font - family: Arial, sans - serif;
    margin: 0;
    padding: 20px;
    background - color: #f5f5f5;
}

.search - form {
    display: flex;
    justify - content: center;
    margin - bottom: 20px;
}

.gallery {
    display: flex;
    flex - wrap: wrap;
    gap: 20px;
    margin - bottom: 20px;
    padding: 0;
    list - style: none;
}

.gallery - item {
    flex - basis: calc(33.333 % - 20px);
    box - shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border - radius: 5px;
    overflow: hidden;
    background - color: white;
}

.image - wrapper {
    position: relative;
    width: 100 %;
    height: 200px;
}

.gallery - item img {
    width: 100 %;
    height: 100 %;
    object - fit: cover;
    display: block;
}

.image - loader {
    position: absolute;
    top: 50 %;
    left: 50 %;
    transform: translate(-50 %, -50 %);
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border - top: 3px solid #4E35DE;
    border - radius: 50 %;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0 % { transform: translate(-50 %, -50 %) rotate(0deg); }
    100 % { transform: translate(-50 %, -50 %) rotate(360deg); }
}

.image - info {
    display: flex;
    flex - wrap: wrap;
    justify - content: space - around;
    padding: 10px;
}

.info - item {
    margin: 5px;
    font - size: 14px;
    text - align: center;
}

.info - value {
    font - weight: bold;
}

.loading - message {
    text - align: center;
    font - size: 18px;
    font - weight: bold;
    color: #4E35DE;
    margin: 20px 0;
}

.load - more - btn {
    display: block;
    margin: 0 auto;
    padding: 10px 20px;
    background - color: #4E35DE;
    color: white;
    border: none;
    border - radius: 8px;
    cursor: pointer;
    transition: 0.3s;
}

.load - more - btn:hover {
    background - color: #61dafb;
}

.is - hidden {
    display: none;
}

.loader {
    display: none;
    width: 48px;
    height: 48px;
    border: 5px solid #4E35DE;
    border - radius: 50 %;
    border - bottom - color: transparent;
    margin: 20px auto;
    animation: rotation 1s linear infinite;
}

.loader.visible {
    display: block;
}

@keyframes rotation {
    0 % {
        transform: rotate(0deg);
    }
    100 % {
        transform: rotate(360deg);
    }
}