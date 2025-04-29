let apiKey = "856850ca5866497aa9a120205252604";
let searchInput = document.getElementById('searchInput');
var weatherData = {};
let todayInfo = document.getElementById("todayInfo");
let details = document.getElementById("details");
let hourly = document.getElementById("hourly");
let fullDate = [];
let Day = [];


document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const city = document.getElementById('searchInput').value.trim();
  if (city !== '') {
    getWeather(city);
  }
  searchInput.value = '';
});

async function getWeather(citydyn) {
  document.getElementById('pageLoader').classList.remove('hidden');
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${citydyn}&days=7`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Swal.close();
    if (data.error) {
      throw new Error(data.error.message);
    }
      weatherData = {
        location: data.location,
        forecast: data.forecast,
        current: data.current,
      };
      console.log(weatherData);
      displayWeather();
    }
    catch(error) {
      console.error("Error fetching weather data:", error);
      Swal.fire({
        title: 'Oops!',
        text: error.message,
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/7486/7486821.png',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Sad Cloud Icon',
        confirmButtonText: 'Try Again',
        background: '#f0f0f0',
        color: '#333',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      });     
    }
    finally {
      // Hide loader
      setTimeout(() => {
        document.getElementById('pageLoader').classList.add('hidden');
      }, 300);
    }
  }

getWeather('cairo');

function displayWeather() {
  if (!weatherData.forecast || !weatherData.forecast.forecastday.length) return;
  getDateFormatted();
  displayTodayInfo()
  displayTodayDetails();
  displayTodayHourlyDetails();
  displayWeeklyForecast();
  changeBackground();

  setTimeout(() => {
    document.getElementById('todayInfo').classList.add('show');
    document.getElementById('details').classList.add('show');
    document.getElementById('hourly').classList.add('show');
    document.getElementById('forecast').classList.add('show');
    document.getElementById('todayHours').classList.add('show');
    document.getElementById('week').classList.add('show');
  }, 1000);
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function getDateFormatted() {
  fullDate = [];
  Day = [];
  for (let i = 0; i < weatherData.forecast.forecastday.length; i++) {
    let date = new Date(weatherData.forecast.forecastday[i].date);
    let dayName = days[date.getDay()];
    let day = date.getDate();
    let monthName = months[date.getMonth()];
    // let hours = date.getHours().toString().padStart(2, "0");
    // let minutes = date.getMinutes().toString().padStart(2, "0");
    let formattedDate = `${dayName} ${day} ${monthName}`;
    let newFormat = `${dayName}`;
    fullDate.push(formattedDate);
    Day.push(newFormat);
  }
}

function displayTodayInfo() {
  todayInfo.innerHTML = `
  <h5 id="date">${fullDate[0]}</h5>
  <div class="my-4"><i id="icon"><img src="${weatherData.current.condition.icon}" alt="Weather Icon"></i>
    <div id="temperature" class="temperature">${weatherData.current.temp_c}°C</div>
    <div id="min" class="small-text my-2">${weatherData.forecast.forecastday[0].day.mintemp_c}°C</div>
    <div id="location" class="small-text">${weatherData.location.country + " / " + weatherData.location.name}</div>
    <p id="condition" class="small-text mt-2">${weatherData.current.condition.text} <img src="${weatherData.current.condition.icon}" alt="Weather Icon"></p>
  </div>

  <div class="d-flex justify-content-around flex-wrap">
    <div>
      <i class="fas fa-sun"></i> Sunrise: <span id="sunrise">${weatherData.forecast.forecastday[0].astro.sunrise}</span>
    </div>
    <div>
      <i class="fas fa-moon"></i> Sunset: <span id="sunset">${weatherData.forecast.forecastday[0].astro.sunset}</span>
    </div>
  </div>
`;
}

function displayTodayDetails() {
  details.innerHTML = `
  <h6 class="text-start mb-3">More Details:</h6>
        <div class="row text-start">
          <div class="col-6 col-md-3 mb-3">
            <i class="fas fa-wind"></i> Wind: <span id="wind">${weatherData.current.wind_kph} km/h</span>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <i class="fas fa-tint"></i> Humidity: <span id="humidity">${weatherData.current.humidity} %</span>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <i class="fas fa-tachometer-alt"></i> Pressure: <span id="Pressure">${weatherData.current.pressure_mb} mb</span>
          </div>
          <div class="col-6 col-md-3 mb-3">
            <i class="fas fa-cloud-rain"></i> Rain Chance: <span id="rain">${weatherData.forecast.forecastday[0].day.daily_chance_of_rain} %</span>
          </div>
        </div>
`;
}

function displayTodayHourlyDetails(){
  let hourlyDetails = "";
  for (let i = 0; i < weatherData.forecast.forecastday[0].hour.length; i += 3) {
    hourlyDetails += `
     <div class="hour-card">
            <small><span>${weatherData.forecast.forecastday[0].hour[i].time.split(" ")[1]}</span></small>
            <div><img src="${weatherData.forecast.forecastday[0].hour[i].condition.icon}" alt="Weather Icon"></div>
            <div>${weatherData.forecast.forecastday[0].hour[i].temp_c}°C</div>
          </div>
    `;
  }
  hourly.innerHTML = hourlyDetails;
}

function displayWeeklyForecast(){
  let forecast = document.getElementById("forecast");
  let forecastContent = "";
  for (let i = 1; i < Day.length; i++) {
    forecastContent += `
    <div class="col-6 col-md-3 col-lg-2">
      <div class="p-2 holder">
        <small>${Day[i]}</small><br>
        <img src="${weatherData.forecast.forecastday[i].day.condition.icon}" alt="Weather Icon">
        <div class="mt-2">
        <small>max. ${weatherData.forecast.forecastday[i].day.maxtemp_c}°</small><br>
        <small>min. ${weatherData.forecast.forecastday[i].day.mintemp_c}°</small>
        </div>
        <small>${weatherData.forecast.forecastday[i].day.condition.text}</small>
      </div>
    </div>
    `;
  }
  forecast.innerHTML = forecastContent;
}

function changeBackground() {
  const weatherCondition = weatherData.current.condition.text.toLowerCase();
  const body = document.getElementById('weatherBody');

  body.classList.remove('sunny', 'rainy', 'cloudy', 'snowy', 'thunder');

  if (weatherCondition.includes('sunny') || weatherCondition.includes('clear')) {
    body.classList.add('sunny');
  } else if (weatherCondition.includes('rain') || weatherCondition.includes('shower')) {
    body.classList.add('rainy');
  } else if (weatherCondition.includes('cloud')) {
    body.classList.add('cloudy');
  } else if (weatherCondition.includes('snow') || weatherCondition.includes('sleet')) {
    body.classList.add('snowy');
  } else if (weatherCondition.includes('thunder') || weatherCondition.includes('storm')) {
    body.classList.add('thunder');
  } else {
    body.style.background = 'linear-gradient(to bottom, #87ceeb, #ffffff)'; // Default
  }
}