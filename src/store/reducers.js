import C from '../constants'
import { combineReducers } from 'redux'


export const allFilters = (state=[], action) => {
  switch(action.type) {
    case C.TOGGLE_FILTER :
      const hasFilter = state.some(filter => filter.key === action.payload.key) //check if filter exists in state
      return (hasFilter) ?
        state.filter(filter => filter.key !== action.payload.key) : //remove filter from state if exists
        [
          ...state,
          action.payload //add filter to state if does not exist
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