import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const style = {
  form: {
    padding: '0',
    width: '95%'
  },
  inputContainer: {
    width: '95%',
    maxWidth: '800px'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: 5,
    border: '1px solid black',
    boxSizing: 'border-box'  // This ensures padding doesn't add to width
  },
  button: {
    marginTop: 10,
    padding: '8px 16px',
    borderRadius: 5,
    border: '1px solid black',
    background: 'none',
    cursor: 'pointer'
  },
  label: {
    marginBottom: 2,
    display: 'block'
  }
}

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <form onSubmit={addAnecdote} aria-label="Add new anecdote" style={style.form}>
      <div style={style.inputContainer}>
        <label style={style.label} htmlFor="anecdote-input">New anecdote</label>
        <input 
          style={style.input}
          id="anecdote-input"
          name="anecdote"
          aria-required="true"
          aria-label="Enter your anecdote"
          placeholder="Type your anecdote here..."
        />
      </div>
      <button 
        type="submit"
        aria-label="Create new anecdote"
        style={style.button}
      >
        create
      </button>
    </form>
  )
}

export default AnecdoteForm