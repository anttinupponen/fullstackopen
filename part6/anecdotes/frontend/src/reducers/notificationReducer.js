import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Initial notification',
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

// Create a new action creator for timed notifications
export const setTimedNotification = (message, seconds = 5) => {
  return async dispatch => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, seconds * 1000)
  }
}


export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer