const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?lat='
const API_KEY = '01481694833cc03ef0087e6d61c30e67'
const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct?q='

const searchbtn = document.getElementById('search-btn');
const inputText = document.getElementById('input-text');
const currentName = document.getElementById('current-name')
const todayDate = document.getElementById('current-date')
const currentImg = document.getElementById('current-img')
const currentTemp = document.getElementById('current-temp')
const currentHum = document.getElementById('current-hum')
const currentWind = document.getElementById('current-wind')
const forecastCards = document.getElementById('forecast-cards')
const previousSearch = document.getElementById('previous-search')

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${month}-${day}-${year}`

let history = []

//this function will get the history from local storage and display it on the page
const getHistory = () => {

    let history = []
    

    localStorage.getItem('searchedCities')

    if (localStorage.getItem('searchedCities') === null || localStorage.getItem('searchedCities') === undefined) {
        history = []
    } else {

        history = localStorage.getItem('searchedCities').split(',')
        
        //this loops over the history array and creates a button for each item in the array that calls the geo function
        for (i = 0; i < history.length; i ++) {

            let newButton = document.createElement('button')
            
            newButton.textContent = history[i]

            newButton.addEventListener('click', (function (e) {
                getGeo(this.textContent)
            }))

            previousSearch.appendChild(newButton)
        }

    }
}

//this takes the input value and calls the geo function, using the input value as the parameter for the api call
const getGeo = (inputValue) => {
 
    inputText.value = ''

    //this fetch gets the lat and lon of the city that was searched for
    fetch(`${GEO_URL}${inputValue}&limit=1&appid=${API_KEY}`).then
        (res => {
            if (res.status > 400) {
                alert('Bad request.')
            }
        return res.json()
    }).then((data) => {

        let lat = data[0].lat
        let lon = data[0].lon

        //and pushes the city name to the history array and local storage
        history.push(inputValue)
        localStorage.setItem('searchedCities', history)

        getWeather(lat, lon)
    })
}

const getWeather = (lat, lon) => {
    //this one gets the current weather for the city that was searched for
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`).then
    ((res) => {
        if (res.status > 400) {
            alert('Bad request.')
        }
    return res.json()
    }).then((data) => {

        currentName.innerHTML = data.name
        todayDate.innerHTML = currentDate
        currentImg.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        currentTemp.innerHTML = `Temp: ${data.main.temp}°F`
        currentHum.innerHTML = `Humidity: ${data.main.humidity}`
        currentWind.innerHTML = `Wind Speed: ${data.wind.speed} MPH`
    });

    //and this one gets the 5 day forecast
    fetch(`${BASE_URL}${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`).then
        ((res) => {
            if (res.status > 400) {
                alert('Bad request.')
            }
        return res.json()
    }).then((data) => {
        //this is how i chose to get the 5 day forecast. i'm sure there's a better way to do it, but this is what i came up with given it gives the forecast in 4 hour increments
        let forecastArr = []

        let dayOne = {date: data.list[0].dt_txt, icon: data.list[0].weather[0].icon, temp: data.list[0].main.temp, wind: data.list[0].wind.speed, hum: data.list[0].main.humidity};
        let dayTwo = {date: data.list[8].dt_txt, icon: data.list[8].weather[0].icon, temp: data.list[8].main.temp, wind: data.list[8].wind.speed, hum: data.list[8].main.humidity}
        let dayThree = {date: data.list[16].dt_txt, icon: data.list[16].weather[0].icon, temp: data.list[16].main.temp, wind: data.list[16].wind.speed, hum: data.list[16].main.humidity}
        let dayFour = {date: data.list[24].dt_txt, icon: data.list[24].weather[0].icon, temp: data.list[24].main.temp, wind: data.list[24].wind.speed, hum: data.list[24].main.humidity}
        let dayFive = {date: data.list[32].dt_txt, icon: data.list[32].weather[0].icon, temp: data.list[32].main.temp, wind: data.list[32].wind.speed, hum: data.list[32].main.humidity}

        forecastArr.push(dayOne, dayTwo, dayThree, dayFour, dayFive)
        //makes the cards for the forecast and displays them
        for (i=0; i<forecastArr.length; i++) {
            
            let newDiv = document.createElement('div')
            let newImg = document.createElement('img')

            newImg.setAttribute('src', `https://openweathermap.org/img/wn/${forecastArr[i].icon}@2x.png`)

            newDiv.className = 'forecast-card'
            newDiv.innerHTML = `
            Date: ${forecastArr[i].date}
            Temp: ${forecastArr[i].temp}°F
            Wind Speed: ${forecastArr[i].wind}MPH
            Humidity: ${forecastArr[i].hum}
            `
            newDiv.appendChild(newImg)
            forecastCards.appendChild(newDiv)

            getHistory()
        }
    })
}

searchbtn.addEventListener('click', (function (e) {
    e.preventDefault()

    let search = inputText.value 
    getGeo(search)
}) 

)

getHistory()