import C from './constants'
import { Component } from 'react'
import ProductFilters from './components/containers/ProductFilters'
import ProductList from './components/containers/ProductList'
import { BrowserRouter as Router } from 'react-router-dom'
import './stylesheets/style.scss'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <ProductFilters />
          <ProductList />
        </div>
      </Router>
    )
  }
}

export default App