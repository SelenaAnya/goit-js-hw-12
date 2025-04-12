const API_KEY = '49640008-31ceefc585112d8f472f2aefe';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=15`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}