import { useState, useEffect } from 'react'
import Service from './components/Service'
import Filter from './components/Filter'
import CountryList from './components/CountryList'

// 2.20




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
      Service.getAll()
      .then(setAllCountries)
      .catch(console.log)
    }
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

      <CountryList countries={countries} filter={filter} setFilter={setFilter} setCountries={setCountries}/>

    </div>
  )
}

export default App