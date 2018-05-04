import C from '../constants'
import { combineReducers } from 'redux'


export const activeFilters = (state=[], action) => {
  switch(action.type) {
    case C.TOGGLE_FILTER :
      const hasFilter = state.some(filter => filter.id === action.payload.id) //check if filter exists in state
      return (hasFilter) ?
        state.filter(filter => filter.id !== action.payload.id) : //remove filter from state if exists
        [
          ...state,
          action.payload //add filter to state if does not exist
        ] 
    case C.SET_FILTERS :
      return action.payload.array //set filters if any found in url path or hash
    case C.CLEAR_FILTERS :
      return [] //return empty array to clear all filters
    default:
      return state
  }
}
export const productCount = (state=[], action) => {
  return action.type === C.PRODUCT_COUNT ? action.payload.productCount : state
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
  activeFilters,
  productCount,
  errors
})