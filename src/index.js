import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');
const inputRef = document.querySelector('#search-box');

inputRef.addEventListener('input', debounce(onLoad, DEBOUNCE_DELAY));

function onLoad(ev) {
  if (ev.target.value.trim() === '') {
    listRef.innerHTML = '';
    infoRef.innerHTML = '';
    return;
  }

  fetchCountries(ev.target.value.trim())
    .then(data => {
      if (data.length > 10 || data.length === 0) {
        Notiflix.Notify.info(
          'Too many matches found! Please, enter a more specific name.'
        );
        return;
      }
      if (data.length > 1) {
        infoRef.innerHTML = '';
        listRef.innerHTML = createMarkup(data);
      } else {
        listRef.innerHTML = '';
        infoRef.innerHTML = createMarkupCountry(data);
      }
    })
    .catch(() => {
      listRef.innerHTML = '';
      infoRef.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name!');
    });
}

function createMarkup(array) {
  return array
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `
        <li>
        <div class="js-item">
        <img src="${svg}" width="60" height="40" alt="flag">
        <p>${official}</p>
        </div>
        </li>
        `
    )
    .join('');
}

function createMarkupCountry(array) {
  return array
    .map(
      ({
        name: { official },
        flags: { svg },
        capital,
        population,
        languages,
      }) =>
        `
        <img src="${svg}" width="100" alt="flag"> 
        <h1>${official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>
        `
    )
    .join('');
}
