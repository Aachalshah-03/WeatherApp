const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector(".weather-info")

const searchCitySection = document.querySelector('.search-city-container')

const notFoundCitySection = document.querySelector('.not-found-city-container')

const countryTxt = document.querySelector('.country-txt')

const tempTxt = document.querySelector('.temp-txt')

const conditionTxt = document.querySelector('.condition-txt')

const humidityTxt = document.querySelector('.humidity-txt')

const windTxt = document.querySelector('.wind-txt')

const weatherSummaryImg = document.querySelector('.weather-summary-img')

const CurrentDayDateTxt = document.querySelector('.current-day-date-txt')

const forecastItemContainer = document.querySelector('.forecast-item-container')

const apiKey = 'd837c77f10bf2bf4bf71950d0f448cff'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value= ''
    }
}) 

cityInput.addEventListener('keydown' ,(event) =>{
    if(event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value= ''
    }
})

async function getFetchData(endPoint, city){        /*endPoint: API path like "weather" or "forecast".*/
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <=800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDayDate(){
    const currentDate =new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options) /*Converts the date to a localized string using the 'en-GB' (British English) format.*/
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)
    if(weatherData.cod != 200){
        showDisplaySection(notFoundCitySection)
        return
    }
    console.log(weatherData)

    const{
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityTxt.textContent = humidity + ' %'
    windTxt.textContent = speed + ' m/s'

    CurrentDayDateTxt.textContent = getCurrentDayDate()

    weatherSummaryImg.src = `./weathericon/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)

    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastData = await getFetchData('forecast', city)
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split("T")[0]

    forecastItemContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItem(forecastWeather)
        }
    })
}

function updateForecastItem (weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="weathericon/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundCitySection]
        .forEach (section => section.style.display = 'none')
    section.style.display = 'flex'
}   
