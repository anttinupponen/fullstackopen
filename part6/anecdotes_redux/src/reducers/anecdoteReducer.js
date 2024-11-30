import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // add a new anecdote to the state, push it to the end of the array
    // 'Immer' is actually replacing the state, not mutating it
    // Without Immer, we would have to return a new array with spread like this:
    // return [...state, action.payload]
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    // vote for an anecdote, update the votes of the anecdote with the given id
    // return a new array with the updated anecdote
    updateAnecdoteLikes(state, action) {
      const id = action.payload.id
      return state.map(anecdote =>
        anecdote.id !== id
        ? anecdote
        : action.payload)
    },
    // replace the state with the anecdotes from the server, entirely new array
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, updateAnecdoteLikes, setAnecdotes } = anecdoteSlice.actions


export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update(anecdote)
    dispatch(updateAnecdoteLikes(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer