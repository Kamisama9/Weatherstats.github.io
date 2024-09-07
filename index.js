const userTab = document.querySelector(".tab1")
const searchTab = document.querySelector(".tab2")
const weatherContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const userForm = document.querySelector(".user-info-container")
const loadingScreen = document.querySelector(".loading-container")
const grantButton=document.querySelector(".grant-btn")


let currtab = userTab
const KEY = '9f0bbdad1feb6123787d89c1e47852d3'
currtab.classList.add("current-tab")
getFromSessionStorage();




function switchTab(clickedTab) {
    if (clickedTab != currtab) {
        currtab.classList.remove("current-tab")
        currtab = clickedTab
        currtab.classList.add("current-tab")

        if (!searchForm.classList.contains("active")) {
            userForm.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
        else {
            searchForm.classList.remove("active")
            userForm.classList.remove("active")
            getFromSessionStorage();
        }
    }
}


// !get data from session storage
function getFromSessionStorage() {
    const checklocal = sessionStorage.getItem("user-coordinates")
    if (!checklocal)
        grantAccessContainer.classList.add('active')
    else {
        const coordinates = JSON.parse(checklocal);
        fetchUserdata(coordinates)
    }
}


//!Api call
async function fetchUserdata(coordinates) {
    const { lat, lon } = coordinates
    // console.log(lat)
    // console.log(lon)
    grantAccessContainer.classList.remove("active")
    loadingScreen.classList.add("active")

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`);
        const data = await response.json()
        loadingScreen.classList.remove("active")
        userForm.classList.add("active")
        console.log("function")
        renderdata(data);
    }
    catch(err) {
        console.log(err)
    }

}



//!render
function renderdata(data) {
const cityName=document.querySelector("[data-cityName]")
const countryFlag=document.querySelector("[data-countryFlag]")
const desc=document.querySelector("[data-weatherDesc]")
const weatherIcon=document.querySelector("[data-weatherIcon]")
const temp=document.querySelector("[data-temp]")
const windSpeed=document.querySelector("[data-windSpeed]")
const humidity=document.querySelector("[data-humidity]")
const cloudiness=document.querySelector("[data-cloudiness]")

cityName.innerHTML=data?.name
// console.log(cityName)
countryFlag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
desc.innerHTML=data?.weather?.[0]?.description
weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
temp.innerText = `${data?.main?.temp.toFixed(2)} °C`;
windSpeed.innerText = `${data?.wind?.speed.toFixed(2)} m/s`;
humidity.innerText = `${data?.main?.humidity.toFixed(2)} %`;
cloudiness.innerText = `${data?.clouds?.all.toFixed(2)} %`;
}




userTab.addEventListener("click", () => {
    switchTab(userTab)
})
searchTab.addEventListener("click", () => {
    switchTab(searchTab)
})


function getlocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{

    }
}
function showPosition(positon)
{
    const userCoordinates={
        lat:positon.coords.latitude,
        lon:positon. coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
    fetchUserdata(userCoordinates)
}


grantButton.addEventListener("click",()=>{
    getlocation();
})


const searchInput=document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value==='')return;

    fetchSearchWeather(searchInput.value)
})

async function fetchSearchWeather(data)
{
    loadingScreen.classList.add('active')
    userForm.classList.remove('active')
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${KEY}&units=metric`)
        const val=await res.json();
        loadingScreen.classList.remove('active')
        userForm.classList.add('active')
        renderdata(val)
    }
    catch(error)
    {
        console.log(error)
    }
}