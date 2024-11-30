import { createContext, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'


const notificationReducer = (state, action) => {
  console.log('notificationReducer called with', '\nstate:', state, '\naction:', action)
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return { message: action.payload, clearAt: action.clearAt }
    case 'CLEAR_NOTIFICATION':
      // Only clear if this is the most recent timeout
      return state.clearAt <= action.clearAt ? { message: '', clearAt: 0 } : state
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, { 
    message: '', 
    clearAt: 0 
  })

  // Helper function to handle notification timing
  const setNotification = (message, seconds = 5) => {
    const clearAt = Date.now() + seconds * 1000 - 10 // subtract 10ms to ensure the notification is cleared
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: message, clearAt })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION', clearAt })
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider value={[notification.message, setNotification]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

// apparently these should be in a different file, but whatever
export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export const useSetNotification = () => {
  const [, setNotification] = useContext(NotificationContext)
  return setNotification
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default NotificationContext