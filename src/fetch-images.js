import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '25282501-233467bc51a05ee3437c83310';

export default async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response;
}
