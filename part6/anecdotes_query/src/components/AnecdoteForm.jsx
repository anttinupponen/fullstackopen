import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useSetNotification } from '../NotificationContext'
import QUERY_KEYS from '../queryKeys'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const setNotification = useSetNotification()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      console.log('new anecdote', newAnecdote)
      setNotification(`New anecdote ${newAnecdote.content} created.`)
      // response is the new anecdote
      // query data is the current state of the anecdotes
      // set query data to the new anecdote by concatenating the current state with the new anecdote
      const anecdotes = queryClient.getQueryData(QUERY_KEYS.ANECDOTES)
      queryClient.setQueryData(QUERY_KEYS.ANECDOTES, anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      console.log('error', error)
      setNotification('Too short anecdote, must have length 5 or more.')
    }
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      { onSuccess: () => {
          event.target.anecdote.value = ''
        }
      }
    )
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
