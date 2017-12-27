import C from './constants'
import React from 'react'
import ReactDOM from 'react-dom'
import storeFactory from './store'
import { Provider } from 'react-redux'

const initialState = (localStorage["redux-store"]) ?
  JSON.parse(localStorage["redux-store"]) :
  // sampleData :
  sampleData

//const initialState = sampleData

const saveState = () =>
  localStorage["redux-store"] = JSON.stringify(store.getState())

const store = storeFactory(initialState) 
store.subscribe(saveState)

window.React = React
window.store = store

let render = () => {
  const App = require("./App").default

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, 
    document.getElementById('react-container'))
}

// render(
//   <div>
//     <Provider store={store}>
//       <ProductFilters />
//     </Provider>
//     <ProductList />
//   </div>, 
//   document.getElementById('react-container'))


if (module.hot) {
  const renderApp = render;
  render = () => {
    try {
      renderApp()
    }
    catch(error) {
      console.log(error)
    }
  }

  module.hot.accept("./App.js", () => {
    setTimeout(render)
  })
}

render()