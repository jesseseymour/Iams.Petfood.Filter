import C from '../constants'
import { combineReducers } from 'redux'


export const toggleFilter = (state=[], action) => {
  (action.type === C.TOGGLE_FILTER) ?
    state : 
    state
}

export const errors = (state=[], action) => {
  switch(action.type) {
    case C.ADD_ERROR :
      return [
         ...state,
         action.payload
      ]
    case C.CLEAR_ERROR : 
      return state.filter((message, i) => i !== action.payload)
    default: 
      return state
  }
}

export default combineReducers({
  toggleFilter,
  errors
})