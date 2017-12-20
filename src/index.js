import C from './constants'
import React from 'react'
import { render } from 'react-dom'
// import routes from './routes'
import storeFactory from './store'
import sampleData from './initialState'
import ProductList from './components/ui/ProductList'
import { Provider } from 'react-redux'
import './stylesheets/style.scss'

const initialState = (localStorage["redux-store"]) ?
  JSON.parse(localStorage["redux-store"]) :
  sampleData

const saveState = () =>
  localStorage["redux-store"] = JSON.stringify(store.getState())

const store = storeFactory(initialState)
store.subscribe(saveState)

window.React = React
window.store = store

render(
  <Provider store={store}>
    <ProductList />
  </Provider>, 
  document.getElementById('react-container'))
