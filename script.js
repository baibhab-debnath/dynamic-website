const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit-btn");
const error = document.querySelector(".error-msg");
form.addEventListener("submit", handleSubmit);
submitBtn.addEventListener("click", handleSubmit);
fetchWeather();

function handleSubmit(e) {
  e.preventDefault();
  fetchWeather();
}

async function getWeatherData(location) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=0e9f455ae7884811a6c92755212906&q=${location}`,
    {
      mode: "cors",
    }
  );
  if (response.status === 400) {
    throwErrorMsg();
  } else {
    error.style.display = "none";
    const weatherData = await response.json();
    const newData = processData(weatherData);
    const tableData = processTableData(weatherData);
    displayData(newData);
    displayTableData(tableData);
    reset();
  }
}

function throwErrorMsg() {
  error.style.display = "block";
}

function processData(weatherData) {
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
    wind: Math.round(weatherData.current.wind_kph),
    humidity: weatherData.current.humidity,
    location: weatherData.location.name.toUpperCase(),
    region: weatherData.location.region.toUpperCase(),
  };
  return myData;
}

function processTableData(weatherData) {
  const hourData = weatherData.forecast.forecastday[0].hour;
  const tableData = [];
  let index = 0;
  hourData.forEach((element) => {
    tableData[index] = {
      time: getTime(hourData[index].time_epoch),
      humidity: hourData[index].humidity,
      temp_c: hourData[index].temp_c,
    };
    index++;
  });
  return tableData;
}

function getTime(epochTime) {
  var dateObj = new Date(epochTime * 1000);
  var time = dateObj.toLocaleString("en-US", { hour: "numeric", hour12: true });
  return time;
}

function displayTableData(tableData) {
  resetTable();
  const tbody = document.getElementById("tableBody");
  tableData.forEach((item) => {
    let row = tbody.insertRow();
    let time = row.insertCell(0);
    time.innerHTML = item.time;
    let humidity = row.insertCell(1);
    humidity.innerHTML = item.humidity + " %";
    let temp_c = row.insertCell(2);
    temp_c.innerHTML = item.temp_c + " &#8451;";
  });
}

function resetTable() {
  var node = document.getElementById("tableBody");
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

function displayData(newData) {
  document.querySelector(".condition").textContent = newData.condition;
  document.querySelector(
    ".location"
  ).textContent = `${newData.location}, ${newData.region}`;
  document.querySelector(".degrees").textContent = newData.currentTemp.c;
  document.querySelector(
    ".feels-like"
  ).textContent = `FEELS LIKE: ${newData.feelsLike.c}`;
  document.querySelector(".wind-kph").textContent = `WIND: ${newData.wind} KPH`;
  document.querySelector(
    ".humidity"
  ).textContent = `HUMIDITY: ${newData.humidity}`;
}

function reset() {
  form.reset();
}

function fetchWeather() {
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value;
  if (userLocation == null || userLocation == undefined || userLocation == "") {
    getWeatherData("Agartala");
  } else {
    getWeatherData(userLocation);
  }
}
