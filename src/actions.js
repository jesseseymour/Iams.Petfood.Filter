import C from './constants'

export function toggleFilter(name,key) {
  return {
    type: C.TOGGLE_FILTER,
    payload: {
      name,
      key
    }
  }
}

export function setFilters(array) {
  return {
    type: C.SET_FILTERS,
    payload: {
      array
    }
  }
}

export function clearFilters() {
  return {
    type: C.CLEAR_FILTERS
  }
}