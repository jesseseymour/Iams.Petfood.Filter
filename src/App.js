import C from './constants'
import { Component } from 'react'

import ProductFilters from './components/containers/ProductFilters'
import ProductList from './components/containers/ProductList'
import './stylesheets/style.scss'

class App extends Component {
  render() {
    return (
      <div className="App">
        <ProductFilters />
        <ProductList />
      </div>
    )
  }
}

export default App