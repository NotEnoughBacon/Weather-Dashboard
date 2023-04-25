const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast?lat='
const API_KEY = '01481694833cc03ef0087e6d61c30e67'
const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct?q='

const searchbtn = document.getElementById('search-btn');
const inputText = document.getElementById('input-text');

let storageArr = []
let forecastArr = []


const saveToLocal = () => {

    localStorage.setItem('searchedCities', storageArr)

}

const getGeo = () => {

    let inputValue = inputText.value 
    inputText.value = ''

    fetch(`${GEO_URL}${inputValue}&limit=1&appid=${API_KEY}`).then
        (res => {
            if (res.status > 400) {
                alert('Bad request.')
            }
        return res.json()
    }).then((data) => {

        let lat = data[0].lat
        let lon = data[0].lon

        storageArr.push(inputValue)
        localStorage.setItem('searchedCities', storageArr)

        getWeather(lat, lon)
    })
}

const getWeather = (lat, lon) => {

    fetch(`${BASE_URL}${lat}&lon=${lon}&appid=${API_KEY}`).then
        ((res) => {
            if (res.status > 400) {
                alert('Bad request.')
            }
        return res.json()
    }).then((data) => {

        let dayOne = {date: data.list[0].dt_txt, icon: }
        let dayTwo = {}
        let dayThree = {}
        let dayFour = {}
        let dayFive = {}







        console.log(data.list)
        console.log(dayOne)
    })
}

searchbtn.addEventListener('click', getGeo)