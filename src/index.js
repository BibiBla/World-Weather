// current time function

function formatTime() {
  let date = new Date();
  console.log(date);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let day = date.getDay();
  let weekday = document.querySelector("#day");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  weekday.innerHTML = days[`${day}`];

  return `${hours}:${minutes}`;
}
let currentTime = document.querySelector("#time");
currentTime.innerHTML = formatTime();

// temperature display (API)

function displayTemperature(response) {
  console.log(response);
  let temperature = document.querySelector("#temperature");
  let city = document.querySelector("#city");
  let description = document.querySelector("#description");
  let tempMax = document.querySelector("#max-temp");
  let tempMin = document.querySelector("#min-temp");
  let windspeed = document.querySelector("#windspeed");
  let humidity = document.querySelector("#humidity");
  let icon = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;
  celsiusMax = response.data.main.temp_max;
  celsiusMin = response.data.main.temp_min;

  temperature.innerHTML = Math.round(response.data.main.temp);
  city.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  tempMax.innerHTML = Math.round(response.data.main.temp_max);
  tempMin.innerHTML = Math.round(response.data.main.temp_min);
  windspeed.innerHTML = Math.round(response.data.wind.speed);
  humidity.innerHTML = Math.round(response.data.main.humidity);
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

function search(city) {
  let apiKey = "4190a6ee70227a6b15b76f600409fe74";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}

function showLocalTemperature(response) {
  search(response.data.name);
}

function showCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "4190a6ee70227a6b15b76f600409fe74";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showLocalTemperature);
}

function showLocation() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

// Celsius/Fahrenheit conversion

let celsiusTemperature = null;
let celsiusMax = null;
let celsiusMin = null;

function showFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let currentCelsius = document.querySelector("#temperature");
  currentCelsius.innerHTML = fahrenheitTemperature;
  let fahrenheitMax = Math.round((celsiusMax * 9) / 5 + 32);
  let tempMax = document.querySelector("#max-temp");
  tempMax.innerHTML = fahrenheitMax;
  let maxSymbol = document.querySelector("#celsius-max");
  maxSymbol.innerHTML = "°F";
  let fahrenheitMin = Math.round((celsiusMin * 9) / 5 + 32);
  let fahrMin = document.querySelector("#min-temp");
  fahrMin.innerHTML = fahrenheitMin;
  let minSymbol = document.querySelector("#celsius-min");
  minSymbol.innerHTML = "°F";
  celsiusConverter.classList.remove("active");
  fahrenheitConverter.classList.add("active");
}

function showCelsius(event) {
  event.preventDefault();
  let currentCelsius = document.querySelector("#temperature");
  currentCelsius.innerHTML = Math.round(celsiusTemperature);
  let tempMax = document.querySelector("#max-temp");
  tempMax.innerHTML = Math.round(celsiusMax);
  let maxSymbol = document.querySelector("#celsius-max");
  maxSymbol.innerHTML = "°C";
  let tempMin = document.querySelector("#min-temp");
  tempMin.innerHTML = Math.round(celsiusMin);
  let minSymbol = document.querySelector("#celsius-min");
  minSymbol.innerHTML = "°C";
  fahrenheitConverter.classList.remove("active");
  celsiusConverter.classList.add("active");
}

let fahrenheitConverter = document.querySelector("#fahrenheit");
fahrenheitConverter.addEventListener("click", showFahrenheit);

let celsiusConverter = document.querySelector("#celsius");
celsiusConverter.addEventListener("click", showCelsius);

let button = document.querySelector("#location");
button.addEventListener("click", showLocation);

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", handleSubmit);
