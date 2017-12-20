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