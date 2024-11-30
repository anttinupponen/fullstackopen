import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useSetNotification } from './NotificationContext'
import QUERY_KEYS from './queryKeys'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const queryClient = useQueryClient()
  const setNotification = useSetNotification()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (anecdote) => {
      console.log('updated anecdote', anecdote)
      const anecdotes = queryClient.getQueryData(QUERY_KEYS.ANECDOTES)
      console.log('anecdotes', anecdotes)
      setNotification(`Anecdote ${anecdote.content} voted.`)
      queryClient.setQueryData(QUERY_KEYS.ANECDOTES,
        anecdotes.map(a => a.id === anecdote.id ? anecdote : a))
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: QUERY_KEYS.ANECDOTES,
    queryFn: getAnecdotes,
    retry: 2
  })
  // console.log("fetched stuff", result.dataUpdatedAt)

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />
  
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
