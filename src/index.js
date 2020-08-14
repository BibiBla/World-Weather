// current time function

function formatTime() {
  let date = new Date();
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

function formatForecastTime(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[`${day}`];
}
// temperature display (API)

function displayTemperature(response) {
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
  icon.setAttribute("src", `src/img/${response.data.weather[0].icon}.png`);
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiKey = "4190a6ee70227a6b15b76f600409fe74";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecast = null;
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  for (let index = 1; index < 6; index++) {
    forecast = response.data.daily[index];

    forecastElement.innerHTML += `
     <div class="col forecastColumns" >
      <div class="day-1">
        ${formatForecastTime(forecast.dt * 1000)}
          <img  src="src/img/${
            forecast.weather[0].icon
          }.png" alt="" class="icon">
            <div id = "forecast-max">
            <span class="forecast-temp-max">${Math.round(
              forecast.temp.max
            )}</span>
            <span class="forecast-degree" id = "forecast-celsius" >°C</span>
            </div>
            <div id = "forecast-min">
            <span class="forecast-temp-min">${Math.round(
              forecast.temp.min
            )}</span>
            <span class="forecast-degree" >°C</span>
            </div>
            
      </div>
    </div >
  `;
  }
}

function search(city) {
  let apiKey = "4190a6ee70227a6b15b76f600409fe74";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  //apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  //axios.get(apiURL).then(displayForecast);
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

  let forecastItems = document.querySelectorAll(".forecast-temp-max");
  forecastItems.forEach(function (item) {
    let currentTemp = item.innerHTML;
    // grabbing the current value to convert--
    // convert to Fahrenheit
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastItemsMin = document.querySelectorAll(".forecast-temp-min");
  forecastItemsMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    // grabbing the current value to convert---
    // convert to Fahrenheit
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastCelsiusSymbol = document.querySelectorAll(".forecast-degree");
  forecastCelsiusSymbol.forEach(function (item) {
    item.innerHTML = `°F`;
  });

  forecastMax = celsiusConverter.classList.remove("active");
  fahrenheitConverter.classList.add("active");
  let fahrenheitLink = document.querySelector("#fahrenheit");
  fahrenheitLink.removeEventListener("click", showFahrenheit);
  let celsiusLink = document.querySelector("#celsius");
  celsiusLink.addEventListener("click", showCelsius);
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

  let forecastItems = document.querySelectorAll(".forecast-temp-max");
  forecastItems.forEach(function (item) {
    let currentTemp = item.innerHTML;
    // grabbing the current value to convert---
    // convert to Celsius
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let forecastItemsMin = document.querySelectorAll(".forecast-temp-min");
  forecastItemsMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    // grabbing the current value to convert--
    // convert to Fahrenheit
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let forecastFahrenheitSymbol = document.querySelectorAll(".forecast-degree");
  forecastFahrenheitSymbol.forEach(function (item) {
    item.innerHTML = `°C`;
  });

  fahrenheitConverter.classList.remove("active");
  celsiusConverter.classList.add("active");
  let fahrenheitLink = document.querySelector("#fahrenheit");
  fahrenheitLink.addEventListener("click", showFahrenheit);
  let celsiusLink = document.querySelector("#celsius");
  celsiusLink.removeEventListener("click", showCelsius);
}

let fahrenheitConverter = document.querySelector("#fahrenheit");
fahrenheitConverter.addEventListener("click", showFahrenheit);

let celsiusConverter = document.querySelector("#celsius");
celsiusConverter.addEventListener("click", showCelsius);

let button = document.querySelector("#location");
button.addEventListener("click", showLocation);

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", handleSubmit);

search("Lisbon");
