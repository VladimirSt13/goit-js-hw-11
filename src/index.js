import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { APIGetPhoto } from './js/api-photo';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// api key 12767036-1273f5679a6a0002977b87267
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery;

loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', onSearch);

loadMoreBtn.addEventListener('click', loadMore);

const lightbox = new SimpleLightbox('.gallery .gallery__item', {
  captionsData: 'alt',
  captionPosition: 'top',
  captionDelay: 250,
});

function onSearch(event) {
  event.preventDefault();
  clearGallery();

  searchQuery = event.currentTarget.elements.searchQuery.value;
  APIGetPhoto.resetPage();
  APIGetPhoto.getPhoto(searchQuery)
    .then(({ hits, total, isNextPage }) => {
      console.log(hits.length);
      if (hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`Hooray! We found ${total} images.`);

      appendPhotos(hits);
      lightbox.refresh();
      changeVisibilityLoadMoreBtn(isNextPage);
      smoothScroll();
    })
    .catch(console.error);
}

function loadMore() {
  APIGetPhoto.getPhoto(searchQuery)
    .then(({ hits, isNextPage }) => {
      appendPhotos(hits);
      lightbox.refresh();
      smoothScroll();

      changeVisibilityLoadMoreBtn(isNextPage);
    })
    .catch(console.error);
}

function changeVisibilityLoadMoreBtn(param) {
  if (param) {
    loadMoreBtn.classList.remove('is-hidden');
    return;
  }
  loadMoreBtn.classList.add('is-hidden');
  Notify.success("We're sorry, but you've reached the end of search results.");
}

function appendPhotos(hits) {
  gallery.insertAdjacentHTML('beforeend', markupData(hits));
}

function clearGallery() {
  gallery.innerHTML = '';
}

function markupData(hits) {
  return hits
    .map(hit => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hit;
      return `
      <a class="gallery__item" href="${largeImageURL}">
          <div class="photo-card">
            <img
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>${likes}
              </p>
              <p class="info-item">
                <b>Views</b>${views}
              </p>
              <p class="info-item">
                <b>Comments</b>${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>${downloads}
              </p>
            </div>
          </div>
        </a>
    `;
    })
    .join('');
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  console.log(gallery.firstElementChild);

  window.scrollBy({
    top: cardHeight * 10,
    behavior: 'smooth',
  });
}
