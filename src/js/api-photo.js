const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  timeout: 1000,
  params: {
    key: '12767036-1273f5679a6a0002977b87267',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  },
});

export const APIGetPhoto = {
  page: 1,
  per_page: 40,
  getPhoto(searchQuery) {
    return instance
      .get(`?&q=${searchQuery}&page=${this.page}&per_page=${this.per_page}`)
      .then(({ data: { hits, total } }) => {
        this.page += 1;
        return {
          hits,
          total,
          isNextPage: this.page <= Math.ceil(total / this.per_page),
        };
      })
      .catch(console.error);
  },
  resetPage() {
    this.page = 1;
  },
};
