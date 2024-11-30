import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import PropTypes from 'prop-types'

const style = {
  list: {
    listStyleType: 'none',
    padding: 0
  },
  listItem: {
    margin: 4,
    padding: 4,
    border: '1px solid black',
    borderRadius: 5,
    cursor: 'pointer',
    width: '95%',
    maxWidth: '800px',
  },
  like: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'right',
    position: 'relative',
    bottom: -4,
    right: 4
  },
  anecdote: {
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 2,
    marginRight: 2
  },
  listButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    width: '100%',
  }
}

const Anecdote = ({ anecdote, handleVote }) => {

  return (
    <li style={style.listItem}>
      <button onClick={handleVote} style={style.listButton}>
        <p style={style.anecdote}>{anecdote.content}</p>
        <p style={style.like}>has {anecdote.votes} votes</p>
      </button>
    </li>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes
    }
    return state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
  })

  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    // dispatch(setTimedNotification(`You voted for ${anecdote.content}`, 5))
  }

  return (
    <ul style={style.list}>
      {[...anecdotes]
      .sort((a, b) => b.votes - a.votes)
      .map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => handleVote(anecdote)}
        />
      )}
    </ul>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object.isRequired,
  handleVote: PropTypes.func.isRequired
}

export default AnecdoteList