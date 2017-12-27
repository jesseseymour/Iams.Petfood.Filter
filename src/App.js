import C from './constants'
import { Component } from 'react'

import sampleData from './initialState'
import ProductFilters from './components/containers/ProductFilters'
import ProductList from './components/ui/ProductList'
import './stylesheets/style.scss'

class App extends Component {
  render() {
    return (
      <div className="App2">
        <ProductFilters />
        <ProductList />
      </div>
    )
  }
}

export default App