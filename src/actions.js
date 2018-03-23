import C from './constants'

export function toggleFilter(name,id,parent,urlname) {
  return {
    type: C.TOGGLE_FILTER,
    payload: {
      name: name.toLowerCase(),
      id,
      parent,
      urlname
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