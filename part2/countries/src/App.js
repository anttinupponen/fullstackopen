import React, { useState, useEffect } from 'react'
import service from './service'

// 2.20

// ff5a03a9584e7b60dc8874cdca9713e8
const apiKey = process.env.REACT_APP_API_KEY

const Filter = ({filter, filterHandler}) => (
  <div>
    Filter: <input value={filter} onChange={filterHandler}/>
  </div>
)

const Country = ({country, setFilter, setCountries}) => {
return (
  <li>
    {country.name.common}
    <button onClick={() => {
      setCountries([country])
      setFilter(country.name.common)}
      }>Show</button>
  </li>
  )
}

// Separate for API calls
const Weather = ({country}) => {
  const [weather, setWeather] = useState(null)
  const [lat, lon] = country.latlng
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => setWeather(data))
      .catch(error => console.error(error));
  }, [lat, lon])

  // Show loading until weather is fetched
  if (!weather) {
    return <div>Loading...</div> //
  }
  // Weather icon source as per docs
  const src = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`
  return (
    <div>
        <p>Temperature: {weather.temperature} Celsius</p>
        <img src={src} alt={weather.weather[0].description}/>
        <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );

}

// Important language component
const Language = ({language}) => (
  <li>{language}</li>
)

// decently ugly but w/e
const Countries = ({countries, setFilter, setCountries}) => {
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map((language, idx) => <Language key={idx} language={language}/>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} width="200" height="150"/>
        <h3>Weather in {country.capital}</h3>
        <Weather country={country}/>
      </div>
    )
  } else {
    return (
      <ul>
        {countries.map((country) => <Country key={'country'+country.cca3} country={country} setFilter={setFilter} setCountries={setCountries}/>)}
      </ul>
    )
  }
}


const App = () => {
  
  // States
  // allCountries: all countries from api to cache
  const [allCountries, setAllCountries] = useState([])
  // countries: filtered countries
  const [countries, setCountries] = useState([])
  // The filter field
  const [filter, setFilter] = useState('')

  useEffect(() => {
    // Fetch only once per session to save api calls
    if (allCountries.length === 0) {
      console.log('effect triggered, fetching data')
      service.getAll()
      .then(setAllCountries)
      .catch(console.log)
    }
    console.log("This is allCountries", allCountries)
  }, [allCountries])

  // Update countries when filter changes
  const filterHandler = (event) => {
    const value = event.target.value
    setFilter(value)
    setCountries(allCountries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase())))
  }


  return (
    <div>
      <h2>Countries</h2>

      <Filter filter={filter} filterHandler={filterHandler}/>

      <h3>Results</h3>

      <Countries countries={countries} filter={filter} setFilter={setFilter} setCountries={setCountries}/>

    </div>
  )
}

export default App