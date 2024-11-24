import PropTypes from 'prop-types'
import Weather from './Weather'
import Language from './Language'
import Country from './Country'

const CountryList = ({countries, setFilter, setCountries}) => {
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

CountryList.propTypes = {
  countries: PropTypes.array.isRequired,
  setFilter: PropTypes.func.isRequired,
  setCountries: PropTypes.func.isRequired
}

export default CountryList