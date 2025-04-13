import axios from 'axios';
const API_KEY = '49640008-31ceefc585112d8f472f2aefe';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
    const { data } = await axios.get(BASE_URL, {
        params: {
            key: API_KEY,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 15,
            page: page
        }
    });
    return data;
}


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


export { onLoadMore };
