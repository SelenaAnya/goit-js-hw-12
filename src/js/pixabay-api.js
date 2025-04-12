import axios from 'axios';
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
                page: page,
                safesearch: true,
                per_page: 15
            }
        });

        return response.data;
    } catch (error) {
        console.error("Помилка запиту:", error);
    }
}
