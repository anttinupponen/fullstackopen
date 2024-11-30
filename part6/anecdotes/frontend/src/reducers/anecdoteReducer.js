import { createSlice } from '@reduxjs/toolkit'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // add a new anecdote to the state, push it to the end of the array
    // 'Immer' is actually replacing the state, not mutating it
    // Without Immer, we would have to return a new array with spread like this:
    // return [...state, action.payload]
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    // vote for an anecdote, update the votes of the anecdote with the given id
    // return a new array with the updated anecdote
    voteAnecdote(state, action) {
      const id = action.payload
      return state.map(anecdote =>
        anecdote.id !== id
        ? anecdote
        : { ...anecdote, votes: anecdote.votes + 1 })
    },
    // replace the state with the anecdotes from the server, entirely new array
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer