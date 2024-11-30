import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

// const getId = () => (100000 * Math.random()).toFixed(0)

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const createNew = async (content) => {
  const anecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const update = async (content) => {
  // to sync with the server state, we would need to get the anecdote from the server first
  // but suppose this is okay for now
  const anecdote = { ...content, votes: content.votes + 1 }
  const response = await axios.put(`${baseUrl}/${content.id}`, anecdote)
  return response.data
}

export default { getAll, createNew, getById, update }