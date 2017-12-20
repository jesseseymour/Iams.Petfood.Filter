import C from './constants'

export function toggleFilter(name, parent) {
  return {
    type: C.TOGGLE_FILTER,
    payload: {name,parent}
  }
}