import axios from 'axios'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

// ff5a03a9584e7b60dc8874cdca9713e8 store it in source like a champ for the time being
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const Weather = ({country}) => {
  const [weather, setWeather] = useState(null)
  const [lat, lon] = country.latlng // latlng is an array, always present.

  useEffect(() => {
    console.log('Fetching weather data')
    axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
      .then(res => setWeather(res.data))
      .catch(console.log);
  }, [lat, lon])

  // Show loading until weather is fetched
  if (!weather) {
    return <div>Loading...</div>
  }
  
  // Weather icon source as per docs
  const src = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
  return (
    <div>
        <p>Temperature: {weather.main.temp} Celsius</p>
        <img src={src} alt={weather.weather[0].description}/>
        <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );

}

Weather.propTypes = {
  country: PropTypes.object.isRequired
}

export default Weather