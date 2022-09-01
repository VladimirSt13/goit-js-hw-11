import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { APIGetPhoto } from './js/api-photo';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('#search-form button');
const loadMoreBtn = document.querySelector('.load-more');
const scrollDown = document.querySelector('.scroll-to-down');

let searchQuery;

searchForm.addEventListener('submit', onSearch);

loadMoreBtn.addEventListener('click', loadMore);

scrollDown.addEventListener('click', smoothScroll);

const lightbox = new SimpleLightbox('.gallery .gallery__item', {
  captionsData: 'alt',
  captionPosition: 'top',
  captionDelay: 250,
});

function onSearch(event) {
  event.preventDefault();
  clearGallery();

  loadMoreBtn.classList.add('is-hidden');

  submitBtn.disabled = true;

  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  console.log(searchQuery);

  APIGetPhoto.resetPage();

  if (searchQuery) {
    APIGetPhoto.getPhoto(searchQuery)
      .then(({ hits, total, isNextPage }) => {
        if (hits.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          !scrollDown.classList.contains('is-hidden') &&
            scrollDown.classList.add('is-hidden');
        } else {
          Notify.success(`Hooray! We found ${total} images.`);
          changeVisibilityLoadMoreBtn(isNextPage);
          scrollDown.classList.contains('is-hidden') &&
            scrollDown.classList.remove('is-hidden');
          appendPhotos(hits);
          lightbox.refresh();
        }
        submitBtn.disabled = false;
      })
      .catch(console.error);
  } else {
    event.currentTarget.elements.searchQuery.value = '';
    submitBtn.disabled = false;
    !scrollDown.classList.contains('is-hidden') &&
      scrollDown.classList.add('is-hidden');
  }
}

function loadMore() {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading...';

  APIGetPhoto.getPhoto(searchQuery)
    .then(({ hits, isNextPage }) => {
      appendPhotos(hits);
      lightbox.refresh();
      smoothScroll(1);
      changeVisibilityLoadMoreBtn(isNextPage);
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Load more';
    })
    .catch(console.error);
}

function changeVisibilityLoadMoreBtn(param) {
  if (param) {
    loadMoreBtn.classList.remove('is-hidden');
    return;
  }
  loadMoreBtn.classList.add('is-hidden');
  scrollDown.classList.add('is-hidden');
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

  window.scrollBy({
    top: cardHeight * 1 + 10,
    behavior: 'smooth',
  });
}
