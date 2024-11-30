import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

// export const createAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: { content, votes: 0, id: getId() }
//   }
// }

// export const voteAnecdote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: id
//   }
// }

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push({ content, votes: 0, id: getId() })
    },
    voteAnecdote(state, action) {
      const id = action.payload
      return state.map(anecdote =>
        anecdote.id !== id
        ? anecdote
        : { ...anecdote, votes: anecdote.votes + 1 })
    }
  }
})

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'NEW_ANECDOTE':
//       return [...state, action.payload]
//     case 'VOTE':
//       return state.map(anecdote =>
//         anecdote.id !== action.payload
//           ? anecdote
//           : { ...anecdote, votes: anecdote.votes + 1 }
//       )
//     default:
//       return state
//   }
// }

export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer