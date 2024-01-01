const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loader = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
let currentTab = userTab;
const apiKey = "c20b345ab07c56d59fe7ae5567168bd2";
currentTab.classList.add("current-tab");
getfromSessionStorage()
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
// const LOCATIONURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`
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
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
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
  const weatherIcons = document.querySelector("[data-weatherIcon]")
  cityName.innerText = weatherInfo?.name;
  countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText= weatherInfo?.weather?.[0]?.description;
  weatherIcons.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  windspeed.innerText=weatherInfo?.wind?.speed;
  temp.innerText = weatherInfo?.main?.temp;
  humidity.innerText=weatherInfo?.main?.humidity;  
  cloudliness.innerText=weatherInfo?.clouds?.all;
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

searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); //default action will be not run or use like redirect to other page will not work
const cityNameIN = searchInput.value.trim()
  if (cityNameIN === "") {
    return;
  }else{
  fetchSearchWeatherInfo(searchInput.value);
  }
});
async function fetchSearchWeatherInfo(city){
loader.classList.add("active")
userInfoContainer.classList.remove("active")
grantAccessContainer.classList.remove("active")
try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityNameIN}&appid=${apiKey}`);
    const data = await res.json();
    loader.classList.remove("active")
    userInfoContainer.classList.add("active")
    renderWeatherInfo(data);
} catch (error) {
    console.error("Error City->",error);
}
}