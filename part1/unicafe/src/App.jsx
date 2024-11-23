import { useState } from 'react'
import PropTypes from 'prop-types'

// constant strings
const goodText = "Good"
const neutralText = "Neutral"
const badText = "Bad"
const allText = "All"
const avgText = "Average"
const posText = "Positive"
const noFeedback = "No feedback given :<"

// multipliers for calcs
const gW = 1
const nW = 0
const bW = -1

// calcs
const all = (g, n, b) => g+n+b
const avg = (g, n, b) => ((g*gW + n*nW + b*bW)/(g+n+b)).toFixed(2)
const pos = (g, n, b) => (g/(g+n+b)).toFixed(2) + ' %'

const Button = ({handler, text}) => (
  <button onClick={handler}>{text}</button>
)

const StatisticLine = ({value, text}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) =>
  good+bad+neutral > 0 ? (
  <>
    <table>
      <tbody>
        <StatisticLine value={good} text={goodText} />
        <StatisticLine value={neutral} text={neutralText} />
        <StatisticLine value={bad} text={badText} />
        <StatisticLine value={all(good, neutral, bad)} text={allText} />
        <StatisticLine value={avg(good, neutral, bad)} text={avgText} />
        <StatisticLine value={pos(good, neutral, bad)} text={posText} />
      </tbody>
    </table>
  </>
) : (
  <>
    <p>{noFeedback}</p>
  </>
)

const App = () => {

  // States
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (value, callback) => callback(value + 1)

  const goodClick = () => handleClick(good, setGood)

  const neutralClick = () => handleClick(neutral, setNeutral)

  const badClick = () => handleClick(bad, setBad)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handler={goodClick} text={goodText} />
      <Button handler={neutralClick} text={neutralText} />
      <Button handler={badClick} text={badText} />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

// typing
Button.propTypes = {
  handler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

StatisticLine.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  text: PropTypes.string.isRequired
}

Statistics.propTypes = {
  good: PropTypes.number.isRequired,
  neutral: PropTypes.number.isRequired,
  bad: PropTypes.number.isRequired
}

export default App