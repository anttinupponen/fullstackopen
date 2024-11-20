import React, { useState } from 'react'

// version 1.14

const Button = ({handler, text}) => (
  <button onClick={handler}>{text}</button>
)

const Toppest = ({anecdotes, points}) => {
  const topIdx = points.indexOf(Math.max(...points))
  const top = anecdotes[topIdx]
  return (
    <div>
      <p>
        {top}
      </p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const ranInt = () => {
    const min = 0
    const max = anecdotes.length-1
    const rand = Math.floor(Math.random() * (max - min + 1)) + min
    return rand
  }

  const selector = () => (
    setSelected(ranInt())
  )

  const voter = () => {
    const pointsCopy = [...points]
    pointsCopy[selected] += 1
    setPoints(pointsCopy)
  }

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <Button handler={voter} text="Vote" />
      <Button handler={selector} text="Next"/>
      <h1>Anecdote with the most votes</h1>
      <Toppest anecdotes={anecdotes} points={points} />
    </div>
  )
}

export default App