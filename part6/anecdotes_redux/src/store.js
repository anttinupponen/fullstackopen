import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'
import { setTimedNotification } from './reducers/notificationReducer'

const notificationMiddleware = store => next => action => {
  console.log('notificationMiddleware', action)
  if (action.type === 'anecdotes/appendAnecdote') {
    store.dispatch(setTimedNotification(`You created ${action.payload.content}`, 5))
  } else if (action.type === 'anecdotes/updateAnecdoteLikes') {
    store.dispatch(setTimedNotification(`You voted for ${action.payload.content}`, 5))
  }
  return next(action)
}

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationMiddleware)
})

store.subscribe(() => console.log(store.getState()))

export default store