// TOP of file

import PropTypes from 'prop-types'
import { useState } from 'react'

const App = () => {

  const [ counter, setCounter ] = useState(0)


  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}


// Add PropTypes definition
App.propTypes = {
  counter: PropTypes.number.isRequired
}

export default App