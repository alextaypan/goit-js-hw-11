import './sass/main.scss';
import fetchImages from './fetch-images';
import renderGallery from './render-gallery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const { height: cardHeight } = gallery.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    notifEmptySearch();
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        notifNoImagesFound();
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        notifImagesFound(data);
        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtn() {
  page += 1;

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      const totalPages = data.totalHits / perPage;
      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        notifEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function notifImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function notifEmptySearch() {
  Notify.failure('The search string cannot be empty. Please specify your search query.');
}

function notifNoImagesFound() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function notifEndOfSearch() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
}
