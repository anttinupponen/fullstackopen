import { useState } from 'react'
import PropTypes from 'prop-types'

// version 1.14

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
]

const randomAnecdote = () => {
  const min = 0
  const max = anecdotes.length-1
  const rand = Math.floor(Math.random() * (max - min + 1)) + min
  return rand
}

const Button = ({handler, text}) => (
  <button onClick={handler}>{text}</button>
)

const Toppest = ({anecdotes, points}) => {
  const topIdx = points.indexOf(Math.max(...points))
  const top = anecdotes[topIdx]
  return (
    <>
      <p>&quot;{top}&quot;<br />with {points[topIdx]} votes.</p>
    </>
  )
}

const App = () => {

  // Hold the index of the selected anecdote.
  const [selected, setSelected] = useState(0)
  // Points is an array of points, matching the indices of anecdotes,
  // i.e. points[3] = 4 would mean that anecdotes[3] has 4 votes.
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0)) // init with 0s

  const selector = () => setSelected(randomAnecdote())

  const voter = () => {
    const pointsCopy = [...points]
    pointsCopy[selected] += 1
    setPoints(pointsCopy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>&quot;{anecdotes[selected]}&quot;<br />has {points[selected]} votes.</p>
      <Button handler={voter} text="vote" />
      <Button handler={selector} text="next anecdote"/>
      <h2>Anecdote with the most votes</h2>
      <Toppest anecdotes={anecdotes} points={points} />
    </div>
  )
}

// Linter typing.
Button.propTypes = {
  handler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

Toppest.propTypes = {
  anecdotes: PropTypes.arrayOf(PropTypes.string).isRequired,
  points: PropTypes.arrayOf(PropTypes.number).isRequired
}

export default App