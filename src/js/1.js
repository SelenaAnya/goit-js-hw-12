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




document.addEventListener("DOMContentLoaded", () => {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) {
        console.error("loadMoreBtn not found in DOM!");
        return;
    }

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
            smoothScroll();
        } catch (error) {
            iziToast.error({ title: 'Error', message: `Error fetching more images: ${error.message}`, position: 'topRight' });
        } finally {
            hideGlobalLoader();
        }
    });
});
