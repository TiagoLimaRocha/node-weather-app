// Update current year on footer
const date = new Date();
const currYear = date.getFullYear();

document.getElementById("curr-year").innerHTML = currYear;

// Set page background image
const body = document.body;
const currHour = date.getHours();

if (currHour >= 7 && currHour <= 15){
    body.style.backgroundImage = 'url("img/day.png")';
}
else if (currHour >= 16 && currHour <= 20){
    body.style.backgroundImage = 'url("img/afternoon.png")';
}
else {
    body.style.backgroundImage = 'url("img/night.png")';
}


// Rain FXs
const nbDrop = 858;

const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeItRain = () => {
    for (let i = 0; i < nbDrop; i++){
        let dropLeft = randRange(0, 1600);
        let dropTop = randRange(-1000, 1400);

        document.getElementsByClassName("rain")[0].innerHTML += `<div class="drop" id="drop${i}"></div>`;
        document.getElementById(`drop${i}`).style.left = dropLeft;
        document.getElementById(`drop${i}`).style.top = dropTop;
    }
}


// Form Handling
const weatherForm = document.getElementById("weather-form");
const searchInput = document.querySelector("input");
const forecast = document.getElementById("weather-forecast");

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const location = searchInput.value;
    forecast.innerHTML = `<p class="loader">Loading...</p>`;
 
    fetch(`/weather?search_location=${location}`)
        .then((response) => {
            response.json().then((data) => {
                if (data.error){
                    console.log("error msg");
                    forecast.innerHTML = error;
                }
                else {
                    console.log("success msg");
                    forecast.innerHTML = `<h4>Weather forecast for <span id="searched-location">${data.location}</span></h4>
                                          <p>${data.forecast.temperature}ºC</p>
                                          <p>${data.forecast.summary}<p>`;

                    // Update background
                    const unix_timestamp = data.forecast.time;
                    const locationTime = new Date(unix_timestamp * 1000);
                    const locationHour = locationTime.getHours();

                    console.log(unix_timestamp);

                    if (locationHour >= 7 && locationHour <= 15) {
                        body.style.backgroundImage = 'url("img/day.png")';
                    } else if (locationHour >= 16 && locationHour <= 20) {
                        body.style.backgroundImage = 'url("img/afternoon.png")';
                    } else {
                        body.style.backgroundImage = 'url("img/night.png")';
                    }

                    
                    // Weather FXs
                    if (data.forecast.icon.includes("cloud")) {
                        document.body.classList.add("fog__container");
                        document.body.innerHTML += `<div class="fog__container">
                                                        <div class="fog__img fog__img--first"></div>
                                                        <div class="fog__img fog__img--second"></div>
                                                    </div>`;
                    }
                    else if (data.forecast.icon.includes("rain")) {
                        document.body.classList.add("rain");
                        makeItRain();
                    }
                    else if (data.forecast.icon.includes("snow")) {
                        document.body.classList.add("winter-is-coming");
                        document.body.innerHTML += `<div class="snow snow--near"></div>
                                                    <div class="snow snow--near snow--alt"></div>
                                                    
                                                    <div class="snow snow--mid"></div>
                                                    <div class="snow snow--mid snow--alt"></div>
                                                    
                                                    <div class="snow snow--far"></div>
                                                    <div class="snow snow--far snow--alt"></div>`;
                    }
                    else {

                    }
                }
            });
        });
});
