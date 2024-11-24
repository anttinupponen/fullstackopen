import PropTypes from 'prop-types'

const Country = ({country, setFilter, setCountries}) => (
  <li>
    {country.name.common}
    <button onClick={() => {
      setCountries([country])
      setFilter(country.name.common)}
      }>Show
    </button>
  </li>
)

Country.propTypes = {
  country: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  setCountries: PropTypes.func.isRequired
}

export default Country
