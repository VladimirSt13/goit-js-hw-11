import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
const axios = require('axios');

// api key 12767036-1273f5679a6a0002977b87267
const searchForm = document.querySelector('#search-form');

searchForm.querySelector('submit', querySearch);

const querySearch = () => {};

async function getPhoto() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
