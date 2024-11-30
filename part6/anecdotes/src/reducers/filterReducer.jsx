import { createSlice } from '@reduxjs/toolkit'

// export const setFilter = filter => {
//   return {
//     type: 'SET_FILTER',
//     filter
//   }
// }

// const reducer = (state = '', action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.filter
//     default:
//       return state
//   }
// }

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  }
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer