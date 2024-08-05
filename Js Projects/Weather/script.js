const apiKey = "2f8780ea45f501a5a9d17b763c6b9504";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const input = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weather = document.querySelector(".weather");
const weatherName = document.querySelector(".weather-name");
const sunRise = document.querySelector(".sunrise p");
const sunSet = document.querySelector(".sunset p");
const errorMsg = document.querySelector(".error");


async function getWeather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if(response.status == 404){
        errorMsg.style.display = "block";
        weather.style.display = "none";
    }

    else{
        var data = await response.json();
        
        console.log(data);
        
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity+"%";
        document.querySelector(".wind").innerHTML = data.wind.speed+" km/h";
        sunRise.innerHTML = convertTimestampToTime(data.sys.sunrise)+" A.M.";
        sunSet.innerHTML = convertTimestampToTime(data.sys.sunset)+" P.M.";
    
        if(data.weather[0].main === "Clouds"){
            weatherIcon.src = "images/clouds.png";
            weatherName.innerText = "Cloudy";
        }
        else if(data.weather[0].main === "Clear"){
            weatherIcon.src = "images/clear.png";
            weatherName.innerText = "Clear";
        }
        else if(data.weather[0].main === "Rain"){
            weatherIcon.src = "images/rain.png";
            weatherName.innerText = "Rainy";
        }
        else if(data.weather[0].main === "Drizzle"){
            weatherIcon.src = "images/drizzle.png";
            weatherName.innerText = "Drizzling";
        }
        else if(data.weather[0].main === "Mist"){
            weatherIcon.src = "images/mist.png";
            weatherName.innerText = "Misty";
        }
        else if(data.weather[0].main === "Snow"){
            weatherIcon.src = "images/snow.png";
            weatherName.innerText = "Snowy";
        }
    
        weather.style.display = "block";
        errorMsg.style.display = "none";
    }

}


function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    return hours + ':' + minutes.substr(-2);
}

searchBtn.addEventListener("click", ()=>{
    getWeather(input.value);
    

})






