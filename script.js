var cityName = document.getElementById("city-name");
var currentWeather = document.getElementById("current-weather");
var currentDate = document.getElementById("current-date");
var currentIcon = document.getElementById("current-icon");
var currentTemp = document.getElementById("current-temp");
var currentHumidity = document.getElementById("current-humidity");
var currentWindSpeed = document.getElementById("current-wind-speed");
var searchBtn = document.getElementById("searchBtn");
var apiKey = "88ac82a1f855e5fc6819a3367659b445";

// takes user input and passes to the API
function getValue() {
  let input = document.getElementById("input").value;
  getCurrentWeather(input);

  // Retrieve the current search history from local storage
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || {};

  // Increment the search counter
  let searchCounter = searchHistory.counter || 0;
  searchCounter++;

  // Add the new search to the search history
  searchHistory[`search${searchCounter}`] = input;
  searchHistory.counter = searchCounter;

  // Save the updated search history back to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  var searchList = document.getElementById("searchList");

  // Clear the search list
  searchList.innerHTML = "";

  // shows the search history
  for (let i = 1; i <= searchCounter; i++) {
    let searchKey = `search${i}`;
    let searchValue = searchHistory[searchKey];

    var li = document.createElement("li");
    li.textContent = searchValue;
    li.addEventListener("click", function () {
      document.getElementById("input").value = searchValue;
      getCurrentWeather(searchValue);
    });

    searchList.appendChild(li);
  }
}

window.addEventListener("load", function () {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || {};
  let searchCounter = searchHistory.counter || 0;
  var searchList = document.getElementById("searchList");
  for (let i = 1; i <= searchCounter; i++) {
    let searchKey = `search${i}`;
    let searchValue = searchHistory[searchKey];

    let li = document.createElement("li");
    li.textContent = searchValue;
    li.addEventListener("click", function () {
      document.getElementById("input").value = searchValue;
      getCurrentWeather(searchValue);
    });

    searchList.appendChild(li);
  }
});

function getCurrentWeather(city) {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      var currentWeatherData = {
        cityName: data.name,
        date: new Date(data.dt * 1000),
        icon: data.weather[0].icon,
        temp: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };
      displayCurrentWeather(currentWeatherData);
      get5DayForecast(data);
      clearForecastData();
    });
}

// displays the current weather forecast
function displayCurrentWeather(currentWeatherData) {
  cityName.textContent = currentWeatherData.cityName;
  currentDate.textContent = currentWeatherData.date.toDateString();
  currentIcon.src =
    "https://openweathermap.org/img/w/" + currentWeatherData.icon + ".png";
  currentTemp.textContent =
    "Current Temperature: " + currentWeatherData.temp + "°F";
  currentHumidity.textContent =
    "Current Humidity: " + currentWeatherData.humidity + "%";
  currentWindSpeed.textContent =
    "Current Wind Speed: " + currentWeatherData.windSpeed + "/mph";
}
// gets the 5 day forecast from API
function get5DayForecast(data) {
  var lat = data.coord.lat;
  var long = data.coord.lon;

  const forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    long +
    "&units=imperial&appid=" +
    apiKey;

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      // array for days 1 through 5
      var days = [
        { null: data },

        {
          date: new Date(data.list[0].dt * 1000),
          icon: data.list[0].weather[0].icon,
          temp: data.list[0].main.temp,
          humidity: data.list[0].main.humidity,
          windSpeed: data.list[0].wind.speed,
        },
        {
          date: new Date(data.list[8].dt * 1000),
          icon: data.list[8].weather[0].icon,
          temp: data.list[8].main.temp,
          humidity: data.list[8].main.humidity,
          windSpeed: data.list[8].wind.speed,
        },
        {
          date: new Date(data.list[16].dt * 1000),
          icon: data.list[16].weather[0].icon,
          temp: data.list[16].main.temp,
          humidity: data.list[16].main.humidity,
          windSpeed: data.list[16].wind.speed,
        },
        {
          date: new Date(data.list[24].dt * 1000),
          icon: data.list[24].weather[0].icon,
          temp: data.list[24].main.temp,
          humidity: data.list[24].main.humidity,
          windSpeed: data.list[24].wind.speed,
        },
        {
          date: new Date(data.list[32].dt * 1000),
          icon: data.list[32].weather[0].icon,
          temp: data.list[32].main.temp,
          humidity: data.list[32].main.humidity,
          windSpeed: data.list[32].wind.speed,
        },
      ];
      // creates dynamic HTML elements
      for (var i = 1; i < days.length; i++) {
        const dayNum = `day${i}`;
        const day = document.getElementById(dayNum);
        var date = document.createElement("p");
        date.textContent = "Date: " + days[i].date;
        day.appendChild(date);
        var temp = document.createElement("p");
        temp.textContent = "Temperature: " + days[i].temp + "°F";
        day.appendChild(temp);
        var icon = document.createElement("img");
        icon.src = "https://openweathermap.org/img/w/" + days[i].icon + ".png";
        day.appendChild(icon);
        var humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + days[i].humidity + "%";
        day.appendChild(humidity);
        var windSpeed = document.createElement("p");
        windSpeed.textContent = "Wind Speed: " + days[i].windSpeed + "/mph";
        day.appendChild(windSpeed);
      }
    });
}
function clearForecastData() {
  // clear the content of the forecast elements
  document.getElementById("day1").textContent = "";
  document.getElementById("day2").textContent = "";
  document.getElementById("day3").textContent = "";
  document.getElementById("day4").textContent = "";
  document.getElementById("day5").textContent = "";
}
// listens for clicks on search button
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  clearForecastData();
  getValue(event);
});
