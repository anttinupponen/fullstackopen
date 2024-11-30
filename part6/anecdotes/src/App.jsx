import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteFilter from './components/AnecdoteFilter'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteFilter />
      <Notification />
      <AnecdoteList />
      <h2>Anecdote Form</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App