const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loader = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
let currentTab = userTab;
const apiKey = "c20b345ab07c56d59fe7ae5567168bd2";
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userContainer.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

//  getfromSessionStorage check cordinatates are available or not  in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}
userTab.addEventListener("click", () => {
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});
async function fetchUserWeatherInfo(coordinates) {
  const { lat, long } = coordinates;
  grantAccessContainer.classList.remove("active");
  loader.classList.add("active");
  // calling an API
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`
    );
    const data = await res.json();
    loader.classList.remove("active");
    renderWeatherInfo(data);
    userInfoContainer.classList.add("active");
  } catch (error) {
    loader.classList.remove("active");
    console.log(`Error --> ${error}`);
  }
}
function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudliness = document.querySelector("[data-cloudliness]");
  const weatherIcons = document.querySelector("[data-weatherIcon]");
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/w160/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcons.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  temp.innerText = (weatherInfo?.main?.temp - 273.15).toFixed(2) + "°C";
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudliness.innerText = `${weatherInfo?.clouds?.all}%`;
}
const grantAccessBTN = document.querySelector("[data-grantAccess]");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("GeoLocation API is Not Supported in Current Device");
  }
}
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    long: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
grantAccessBTN.addEventListener("click", getLocation);
let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cityNameIN = searchInput.value.trim();

  if (cityNameIN === "") {
    return;
  } else {
    try {
      await fetchSearchWeatherInfo(cityNameIN);
    } catch (error) {
      console.error("Error fetching weather for city:", error);
    }
  }
});


async function fetchSearchWeatherInfo(city) {
  const errImgDiv = document.querySelector(".errImg");
  loader.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  errImgDiv.classList.remove("active");
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    const data = await res.json();
    loader.classList.remove("active");
    if (data.cod == "404") {
      errImgDiv.classList.add("active");
    } else {
      errImgDiv.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    renderWeatherInfo(data);
  } catch (error) {
    console.error("Error -->", error);
  }
}
function changeSession() {
  sessionStorage.clear();
  alert("Location will reset after you click ok".toUpperCase());
  location.reload(); //refresh page
}
