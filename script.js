'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
///////////////////////////////////////
// const getCountryAndNeighbor = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data);
//     const [neighbor] = data.borders;
//     if (!neighbor) return;
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbor}`);
//     request2.send();
//     request2.addEventListener('load', function () {
//       const data2 = JSON.parse(this.responseText);
//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

// const renderCountry = function (data, classname = '') {
//   const html = `
//   <article class="country ${classname}">
//         <img class="country__img" src="${data.flag}" />
//         <div class="country__data">
//           <h3 class="country__name">${data.name}</h3>
//           <h4 class="country__region">${data.region}</h4>
//           <p class="country__row"><span>👫</span>${(
//             +data.population / 1000000
//           ).toFixed(1)} million people</p>
//           <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//           <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//         </div>
//       </article>
//       `;
//   countriesContainer.insertAdjacentHTML('beforeend', html);
//   countriesContainer.style.opacity = 1;
// };

// getCountryAndNeighbor(`ireland`);

const getCountryData = function (country) {
  errorHandle(
    `https://restcountries.eu/rest/v2/alpha/${country}`,
    `Country not found`
  )
    .then(data => {
      renderCountry(data);
      const neighbor = data.borders[0];
      if (!neighbor) throw new Error(`No neighbor found`);
      return errorHandle(
        `https://restcountries.eu/rest/v2/alpha/${neighbor}`,
        `Country not found`
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => renderError(`Something went wrong. ${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const renderCountry = function (data, classname = '') {
  const html = `
    <article class="country ${classname}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} million people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>
        `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

btn.addEventListener(`click`, async function () {
  countriesContainer.innerHTML = '';
  const country = await getPosition();
  getCountryData(country);
});

const errorHandle = function (url, errorMSG = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMSG} (${response.status})`);
    return response.json();
  });
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const getPosition = async function () {
  const countryRaw = await fetch('https://extreme-ip-lookup.com/json/')
    .then(res => res.json())
    .catch((data, status) => {
      console.log('Request failed');
    });
  return countryRaw.countryCode.toLowerCase();
};
