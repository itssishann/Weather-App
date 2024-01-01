const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loader = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

let currentTab= userTab;
const apiKey = "c20b345ab07c56d59fe7ae5567168bd2";
currentTab.classList.add("current-tab")
function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

           if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
           }
           else{
            searchForm.classList.remove("active");
            userContainer.classList.remove("active");
            getfromSessionStorage();
           }
    }
}
// const LOCATIONURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`
//  getfromSessionStorage check cordinatates are available or not  in session storage
function getfromSessionStorage(){
 const localCoordinates= sessionStorage.getItem("user-coordinates");
 if(!localCoordinates){
    grantAccessContainer.classList.add("active")
 }
 else{
    const coordinates = JSON.parse(localCoordinates)
    fetchUserWeatherInfo(coordinates);
 }
}
userTab.addEventListener("click", ()=>{
switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
switchTab(searchTab);
});
async function fetchUserWeatherInfo(coordinates){
const {lat,long} = coordinates;
grantAccessContainer.classList.remove("active");
loader.classList.add("active")
// calling an API
try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`);
    const data = await res.json();
    loader.classList.remove("active")
    userInfoContainer.classList.add("active")
    renderWeatherInfo(data)
} catch (error) {
    loader.classList.remove("active")
    console.log(`Error --> ${error}`);
}
}
function renderWeatherInfo(weatherInfo){

}