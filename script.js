const form = document.querySelector('form');
const submitBtn = document.querySelector('.submit-btn');
const error = document.querySelector('.error-msg');
const giphyApiKey = 'j7vJMyXALmzqp2bCkQZKnWDPU1Skk6zx'; 

form.addEventListener('submit', handleSubmit);
submitBtn.addEventListener('click', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  fetchWeather();
}

async function getWeatherData(location) {
  const weatherResponse = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=3467dcd1d7ad4f1e89591504232706&q=${location}`,
    {
      mode: 'cors',
    }
  );

  if (weatherResponse.status === 400) {
    throwErrorMsg();
  } else {
    error.style.display = 'none';
    const weatherData = await weatherResponse.json();
    console.log(weatherData);
    const newData = processData(weatherData);
    displayData(newData);

    const weatherCondition = newData.condition;
    const giphyResponse = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${giphyApiKey}&s=${weatherCondition}`,
      { mode: 'cors' }
    );

    if (giphyResponse.status === 200) {
      const giphyData = await giphyResponse.json();
      console.log(giphyData);
      const gifUrl = giphyData.data.images.original.url;
      changeBackground(gifUrl);
    }
  }
}

function throwErrorMsg() {
  error.style.display = 'block';
  if (error.classList.contains('fade-in')) {
    error.style.display = 'none';
    error.classList.remove('fade-in2');
    error.offsetWidth;
    error.classList.add('fade-in');
    error.style.display = 'block';
  } else {
    error.classList.add('fade-in');
  }
}

function processData(weatherData) {
  // grab all the data i want to display on the page
  const myData = {
    condition: weatherData.current.condition.text,
    feelsLike: {
      f: Math.round(weatherData.current.feelslike_f),
      c: Math.round(weatherData.current.feelslike_c),
    },
    currentTemp: {
      f: Math.round(weatherData.current.temp_f),
      c: Math.round(weatherData.current.temp_c),
    },
    wind: Math.round(weatherData.current.wind_mph),
    humidity: weatherData.current.humidity,
    location: weatherData.location.name.toUpperCase(),
  };

  // if in the US, add state
  // if not, add country
  if (weatherData.location.country === 'United States of America') {
    myData['region'] = weatherData.location.region.toUpperCase();
  } else {
    myData['region'] = weatherData.location.country.toUpperCase();
  }

  return myData;
}

function displayData(newData) {
  const weatherInfo = document.getElementsByClassName('info');
  Array.from(weatherInfo).forEach((div) => {
    if (div.classList.contains('fade-in2')) {
      div.classList.remove('fade-in2');
      div.offsetWidth;
      div.classList.add('fade-in2');
    } else {
      div.classList.add('fade-in2');
    }
  });
  document.querySelector('.condition').textContent = newData.condition;
  document.querySelector(
    '.location'
  ).textContent = `${newData.location}, ${newData.region}`;
  document.querySelector('.degrees').textContent = newData.currentTemp.f;
  document.querySelector(
    '.feels-like'
  ).textContent = `FEELS LIKE: ${newData.feelsLike.f}`;
  document.querySelector('.wind-mph').textContent = `WIND: ${newData.wind} MPH`;
  document.querySelector(
    '.humidity'
  ).textContent = `HUMIDITY: ${newData.humidity}`;
}

function reset() {
  form.reset();
}

function changeBackground(gifUrl) {
  document.body.style.backgroundImage = `url('${gifUrl}')`;
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center center';
  document.body.style.backgroundSize = 'cover';
}

function fetchWeather() {
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value;
  getWeatherData(userLocation);
}
