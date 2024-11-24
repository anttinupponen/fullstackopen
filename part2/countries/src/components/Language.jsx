import PropTypes from 'prop-types'

// Important language component
const Language = ({language}) => (
  <li>{language}</li>
)

Language.propTypes = {
  language: PropTypes.string.isRequired
}

export default Language