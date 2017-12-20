import C from '../constants'
import { combineReducers } from 'redux'


export const allFilters = (state=[], action) => {
  switch(action.type) {
    case C.TOGGLE_FILTER :
      return [
        ...state,
        action.payload
      ]
    default:
      return state
  }
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
  allFilters,
  errors
})