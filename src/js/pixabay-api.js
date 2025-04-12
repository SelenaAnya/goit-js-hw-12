const API_KEY = '49640008-31ceefc585112d8f472f2aefe';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(page = 1, query) {
    try {
        const response = await axios(`${BASE_URL}`, {
            params: {
                key: API_KEY,
                q: query,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page: page,
                per_page: 15
            }
        });

        return response.data;
    } catch (error) {
        console.error("Помилка запиту:", error);
    }
}
