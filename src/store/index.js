import C from '../constants'
import appReducer from './reducers'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

const consoleMessages = store => next => action => {

	let result

	console.groupCollapsed(`dispatching action => ${action.type}`)
	console.log('filters', store.getState().allFilters.length)
	result = next(action)

	let { allFilters, errors } = store.getState()

	console.log(`

		filters: ${allFilters.length}
		errors: ${errors.length}

	`)

	console.groupEnd()

	return result

}

export default (initialState={}) => {
	return applyMiddleware(thunk,consoleMessages)(createStore)(appReducer, initialState)
}



